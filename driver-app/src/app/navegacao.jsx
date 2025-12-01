import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as Location from "expo-location";
import travelService from "@/src/services/travel";
import { useLocation } from "@/src/hooks/useLocation";
import { useGeoapifyRouting } from "@/src/hooks/useGeoapifyRouting";
import { useReverseGeocode } from "@/src/hooks/useReverseGeocode";
import { formatarEndereco } from "@/src/lib/format-utils";
import ConfirmModal from "@/src/components/ConfirmModal";
import { usePreferences } from "@/src/contexts/PreferencesContext";
import { ThemedView, ThemedText } from "@/src/components";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";

const DEFAULT_CENTER = {
  latitude: -23.5489,
  longitude: -46.6388,
};

const normalizeCoordinate = (point) => {
  if (!point) return null;

  if (Array.isArray(point) && point.length === 2) {
    const [latitude, longitude] = point;
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return { latitude: lat, longitude: lon };
    }
    return null;
  }

  const latitude = Number(
    point.latitude ?? point.lat ?? point[1] ?? point.y ?? point.a ?? null
  );
  const longitude = Number(
    point.longitude ?? point.lng ?? point.lon ?? point[0] ?? point.x ?? null
  );

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude };
  }

  return null;
};

const normalizeCoordinatesArray = (coords = []) =>
  coords
    .map((coord) => normalizeCoordinate(coord))
    .filter((coord) => coord !== null);

const buildLeafletHtml = (center) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
    />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      :root {
        color-scheme: light;
      }
    </style>
    <style>
      * {
        box-sizing: border-box;
      }
      html,
      body,
      #map {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        background: #f8fafc;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          "Helvetica Neue", Arial, sans-serif;
        background: #f8fafc;
        color: #0f172a;
      }
      .leaflet-container { background: #f8fafc !important; }
      .pointer-ambulance {
        position: relative;
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-bottom: 38px solid #ef4444;
        filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35));
        transform-origin: 50% 75%;
        transform: rotate(var(--heading, 0deg));
        transition: transform 0.5s linear;
      }
      .pointer-ambulance::after {
        content: "";
        position: absolute;
        top: -18px;
        left: -9px;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #fff;
        border: 3px solid #ef4444;
      }
      .pin-destination {
        position: relative;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #22c55e;
        border: 3px solid #ffffff;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
      }
      .pin-destination::after {
        content: "";
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 12px solid #22c55e;
      }
      .origin-dot {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        border: 3px solid #38bdf8;
        background: #e0f2fe;
        box-shadow: 0 3px 6px rgba(14, 165, 233, 0.35);
      }
      .route-shadow {
        filter: drop-shadow(0 0 10px rgba(37, 99, 235, 0.35));
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-polylinedecorator@1.7.0/dist/leaflet.polylineDecorator.min.js"></script>
    <script>
      (function () {
        const initialCenter = [${center.latitude}, ${center.longitude}];
        const map = L.map("map", {
          zoomControl: false,
          attributionControl: false,
          inertia: true,
          inertiaDeceleration: 3500,
        }).setView(initialCenter, 13);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
          subdomains: "abcd",
          attribution: "© OpenStreetMap contributors © CARTO",
        }).addTo(map);

        let ambulanceMarker = null;
        let destinationMarker = null;
        let originMarker = null;
        let routePolyline = null;
        let routeHalo = null;
        let routeDecorator = null;
        let seguirLocalizacao = true;
        let lastRouteLatLngs = null;

        const ambulanceIcon = L.divIcon({
          html: '<div class="pointer-ambulance"></div>',
          className: "",
          iconSize: [40, 40],
          iconAnchor: [20, 30],
        });

        const destinationIcon = L.divIcon({
          html: '<div class="pin-destination"></div>',
          className: "",
          iconSize: [30, 40],
          iconAnchor: [15, 40],
        });

        const originIcon = L.divIcon({
          html: '<div class="origin-dot"></div>',
          className: "",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const meterOffset = (point, headingDeg, distanceMeters = 120) => {
          if (!point) return null;
          const R = 6378137;
          const heading = (headingDeg * Math.PI) / 180;
          const lat1 = (point[0] * Math.PI) / 180;
          const lon1 = (point[1] * Math.PI) / 180;
          const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(distanceMeters / R) +
              Math.cos(lat1) * Math.sin(distanceMeters / R) * Math.cos(heading)
          );
          const lon2 =
            lon1 +
            Math.atan2(
              Math.sin(heading) * Math.sin(distanceMeters / R) * Math.cos(lat1),
              Math.cos(distanceMeters / R) - Math.sin(lat1) * Math.sin(lat2)
            );
          return [(lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI];
        };

        const normalizePoint = (point) => {
          if (!point) return null;
          if (Array.isArray(point) && point.length === 2) {
            const lat = Number(point[0]);
            const lon = Number(point[1]);
            if (Number.isFinite(lat) && Number.isFinite(lon)) {
              return [lat, lon];
            }
            return null;
          }
          const lat = Number(point.latitude ?? point.lat ?? null);
          const lon = Number(point.longitude ?? point.lng ?? point.lon ?? null);
          if (Number.isFinite(lat) && Number.isFinite(lon)) {
            return [lat, lon];
          }
          return null;
        };

        const updateAmbulance = (data) => {
          const coords = normalizePoint(data);
          if (!coords) return;

          if (!ambulanceMarker) {
            ambulanceMarker = L.marker(coords, { icon: ambulanceIcon }).addTo(
              map
            );
          } else {
            ambulanceMarker.setLatLng(coords);
          }

          if (typeof data?.heading === "number") {
            const el = ambulanceMarker.getElement();
            if (el) {
              el.style.setProperty("--heading", data.heading + "deg");
            }
          }

          if (seguirLocalizacao) {
            const target = meterOffset(coords, data?.heading ?? 0, 140) || coords;
            const nextZoom = Math.max(map.getZoom(), 16.5);
            map.flyTo(target, nextZoom, { animate: true, duration: 0.5, easeLinearity: 0.1 });
          }
        };

        const updateDestination = (data) => {
          const coords = normalizePoint(data);
          if (!coords) return;

          if (!destinationMarker) {
            destinationMarker = L.marker(coords, {
              icon: destinationIcon,
            }).addTo(map);
          } else {
            destinationMarker.setLatLng(coords);
          }
        };

        const updateOrigin = (data) => {
          const coords = normalizePoint(data);
          if (!coords) return;
          if (!originMarker) {
            originMarker = L.marker(coords, { icon: originIcon }).addTo(map);
          } else {
            originMarker.setLatLng(coords);
          }
        };

        const updateRoute = (points, originFallback, destinationFallback) => {
          let latLngs = [];

          if (Array.isArray(points) && points.length) {
            latLngs = points
              .map((point) => normalizePoint(point))
              .filter((point) => point !== null);
          }

          if (!latLngs.length) {
            const fallback = [originFallback, destinationFallback]
              .map((entry) => normalizePoint(entry))
              .filter((entry) => entry !== null);

            if (fallback.length >= 2) {
              latLngs = fallback;
            }
          }

          if (!latLngs.length) {
            if (routePolyline) {
              map.removeLayer(routePolyline);
              routePolyline = null;
            }
            if (routeHalo) {
              map.removeLayer(routeHalo);
              routeHalo = null;
            }
            if (routeDecorator) {
              map.removeLayer(routeDecorator);
              routeDecorator = null;
            }
            lastRouteLatLngs = null;
            return;
          }

          if (!routeHalo) {
            routeHalo = L.polyline(latLngs, {
              color: "#1d4ed8",
              weight: 11,
              opacity: 0.35,
              className: "route-shadow",
            }).addTo(map);
          } else {
            routeHalo.setLatLngs(latLngs);
          }

          if (!routePolyline) {
            routePolyline = L.polyline(latLngs, {
              color: "#60a5fa",
              weight: 6,
              opacity: 0.95,
              lineJoin: "round",
            }).addTo(map);
          } else {
            routePolyline.setLatLngs(latLngs);
          }

          if (window.L?.polylineDecorator) {
            if (routeDecorator) {
              map.removeLayer(routeDecorator);
            }
            routeDecorator = L.polylineDecorator(routePolyline, {
              patterns: [
                {
                  offset: 40,
                  repeat: 80,
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 14,
                    polygon: false,
                    pathOptions: { color: "#bfdbfe", weight: 2, opacity: 0.9 },
                  }),
                },
              ],
            }).addTo(map);
          }

          if (!originMarker && latLngs.length) {
            updateOrigin(latLngs[0]);
          } else if (latLngs.length) {
            updateOrigin(latLngs[0]);
          }

          lastRouteLatLngs = latLngs;
        };

        const fitRoute = (data) => {
          let latLngs = [];

          if (Array.isArray(data?.route) && data.route.length) {
            latLngs = data.route
              .map((point) => normalizePoint(point))
              .filter((point) => point !== null);
          }

          if (!latLngs.length && lastRouteLatLngs?.length) {
            latLngs = lastRouteLatLngs;
          }

          if (!latLngs.length) {
            const origin = normalizePoint(data?.origin);
            const destination = normalizePoint(data?.destination);
            latLngs = [origin, destination].filter((point) => point);
          }

          if (!latLngs.length) {
            return;
          }

          if (latLngs.length === 1) {
            map.setView(latLngs[0], 15, { animate: true });
            return;
          }

          const bounds = L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [80, 160] });
        };

        const handleMessage = (event) => {
          if (!event?.data) return;
          let payload = null;
          try {
            payload = JSON.parse(event.data);
          } catch (error) {
            return;
          }

          if (!payload) return;

          if (payload.type === "UPDATE") {
            if (typeof payload.data?.seguirLocalizacao === "boolean") {
              seguirLocalizacao = payload.data.seguirLocalizacao;
            }

            if (payload.data?.route || payload.data?.origin || payload.data?.destination) {
              updateRoute(
                payload.data.route,
                payload.data.origin,
                payload.data.destination
              );
            }

            if (payload.data?.destination) {
              updateDestination(payload.data.destination);
            }

            if (payload.data?.origin) {
              updateOrigin(payload.data.origin);
            }

            if (payload.data?.ambulance) {
              updateAmbulance(payload.data.ambulance);
            }
          } else if (payload.type === "CENTER_ROUTE") {
            fitRoute(payload.data || {});
          }
        };

        document.addEventListener("message", handleMessage);
        window.addEventListener("message", handleMessage);

        const notifyReady = () => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: "READY" })
            );
          }
        };

        notifyReady();
      })();
    </script>
  </body>
</html>
`;

const LEAFLET_HTML = buildLeafletHtml(DEFAULT_CENTER);

export default function NavegacaoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const insets = useSafeAreaInsets();
  const webViewRef = useRef(null);
  const { preferences } = usePreferences();
  const { isDark, colors } = useThemeStyles();

  const [viagem, setViagem] = useState(null);
  const [, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rotaCoordenadas, setRotaCoordenadas] = useState([]);
  const [distanciaRestante, setDistanciaRestante] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(null);
  const [proximaInstrucao, setProximaInstrucao] = useState(null);
  const [seguirLocalizacao, setSeguirLocalizacao] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showControls, setShowControls] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimeoutRef = useRef(null);

  const showControlsTemporarily = useCallback(() => {
    if (!preferences.autoHideNavigationControls) {
      setShowControls(true);
      fadeAnim.setValue(1);
      return;
    }

    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 5000);
  }, [fadeAnim, preferences.autoHideNavigationControls]);

  useEffect(() => {
    if (!preferences.autoHideNavigationControls) {
      setShowControls(true);
      fadeAnim.setValue(1);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      showControlsTemporarily();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [
    showControlsTemporarily,
    preferences.autoHideNavigationControls,
    fadeAnim,
  ]);

  const {
    location: gpsLocation,
    error: gpsError,
    loading: gpsLoading,
  } = useLocation({
    accuracy: Location.Accuracy.BestForNavigation,
    updateInterval: 1000,
    distanceInterval: 2,
  });

  const { endereco: enderecoAtual } = useReverseGeocode(
    gpsLocation?.latitude,
    gpsLocation?.longitude,
    { enabled: !!gpsLocation }
  );

  const calcularDistanciaLinear = useCallback((lat1, lon1, lat2, lon2) => {
    if (
      [lat1, lon1, lat2, lon2].some(
        (valor) => typeof valor !== "number" || Number.isNaN(valor)
      )
    ) {
      return null;
    }
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }, []);

  const distanciaEstimada = useMemo(() => {
    if (
      viagem &&
      gpsLocation &&
      viagem.lat_fim &&
      viagem.long_fim &&
      !distanciaRestante
    ) {
      return calcularDistanciaLinear(
        gpsLocation.latitude,
        gpsLocation.longitude,
        parseFloat(viagem.lat_fim),
        parseFloat(viagem.long_fim)
      );
    }
    return null;
  }, [viagem, gpsLocation, distanciaRestante, calcularDistanciaLinear]);

  const tempoEstimado = useMemo(() => {
    if (distanciaEstimada) {
      return Math.max(1, Math.ceil((parseFloat(distanciaEstimada) / 50) * 60));
    }
    return null;
  }, [distanciaEstimada]);

  useEffect(() => {
    if (!id) {
      setErrorMsg("ID da viagem não fornecido");
      setLoading(false);
      return;
    }

    const fetchViagem = async () => {
      try {
        setLoading(true);
        const data = await travelService.getTravelById(id);
        setViagem(data);
      } catch (err) {
        console.error("Erro ao buscar viagem:", err);
        setErrorMsg(err.message || "Erro ao carregar viagem");
      } finally {
        setLoading(false);
      }
    };

    fetchViagem();
  }, [id]);

  const coordOrigem = useMemo(() => {
    if (
      gpsLocation &&
      !Number.isNaN(gpsLocation.latitude) &&
      !Number.isNaN(gpsLocation.longitude)
    ) {
      return [gpsLocation.latitude, gpsLocation.longitude];
    }
    if (viagem?.lat_inicio && viagem?.long_inicio) {
      return [parseFloat(viagem.lat_inicio), parseFloat(viagem.long_inicio)];
    }
    return null;
  }, [gpsLocation, viagem]);

  const coordDestino = useMemo(() => {
    if (viagem?.lat_fim && viagem?.long_fim) {
      return [parseFloat(viagem.lat_fim), parseFloat(viagem.long_fim)];
    }
    return null;
  }, [viagem]);

  const origemCoords = useMemo(() => {
    if (!coordOrigem) return null;
    const latitude = Number(coordOrigem[0]);
    const longitude = Number(coordOrigem[1]);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return { latitude, longitude };
  }, [coordOrigem]);

  const destinoCoords = useMemo(() => {
    if (!coordDestino) return null;
    const latitude = Number(coordDestino[0]);
    const longitude = Number(coordDestino[1]);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return { latitude, longitude };
  }, [coordDestino]);

  const requestFitToRoute = useCallback(
    (routeOverride, originOverride, destinationOverride) => {
      if (!mapReady || !webViewRef.current) return;

      const payload = {
        type: "CENTER_ROUTE",
        data: {
          route:
            (routeOverride && routeOverride.length && routeOverride) ||
            (rotaCoordenadas.length ? rotaCoordenadas : null),
          origin: originOverride || origemCoords,
          destination: destinationOverride || destinoCoords,
        },
      };

      webViewRef.current.postMessage(JSON.stringify(payload));
    },
    [mapReady, rotaCoordenadas, origemCoords, destinoCoords]
  );

  const handleRotaCalculada = useCallback(
    (resultado) => {
      if (!resultado) return;
      setDistanciaRestante(resultado.distancia);
      setTempoRestante(resultado.duracao);
      setProximaInstrucao(resultado.instructions?.[0] || null);

      const coordenadasNormalizadas = normalizeCoordinatesArray(
        resultado.coordinates || []
      );
      if (coordenadasNormalizadas.length) {
        setRotaCoordenadas(coordenadasNormalizadas);
        requestFitToRoute(coordenadasNormalizadas);
      }
    },
    [requestFitToRoute]
  );

  const { isLoading: calculandoRota, error: erroCalculoRota } =
    useGeoapifyRouting(coordOrigem, coordDestino, handleRotaCalculada, {
      enabled: !!(coordOrigem && coordDestino && viagem),
      updateInterval: 10000,
    });

  const estaCalculandoRota = calculandoRota;
  const erroDeRota = erroCalculoRota;

  const sendUpdateToMap = useCallback(() => {
    if (!mapReady || !webViewRef.current) return;

    const payload = {
      type: "UPDATE",
      data: {
        seguirLocalizacao,
        route: rotaCoordenadas,
        destination: destinoCoords,
        origin: origemCoords,
        ambulance:
          gpsLocation && !Number.isNaN(gpsLocation.latitude)
            ? {
                latitude: gpsLocation.latitude,
                longitude: gpsLocation.longitude,
                heading: gpsLocation.heading || 0,
              }
            : null,
      },
    };

    webViewRef.current.postMessage(JSON.stringify(payload));
  }, [
    mapReady,
    seguirLocalizacao,
    rotaCoordenadas,
    destinoCoords,
    origemCoords,
    gpsLocation,
  ]);

  useEffect(() => {
    sendUpdateToMap();
  }, [sendUpdateToMap]);

  useEffect(() => {
    if (mapReady) {
      requestFitToRoute();
    }
  }, [mapReady, requestFitToRoute]);

  const handleWebViewMessage = useCallback((event) => {
    if (!event?.nativeEvent?.data) return;
    try {
      const payload = JSON.parse(event.nativeEvent.data);
      if (payload.type === "READY") {
        setMapReady(true);
      }
    } catch (err) {
      console.warn("Mensagem inválida do mapa:", err?.message);
    }
  }, []);

  const centralizarRota = useCallback(() => {
    requestFitToRoute();
  }, [requestFitToRoute]);

  const handleFinalizarViagem = useCallback(() => {
    setShowEndConfirm(true);
  }, []);

  const confirmEndTravel = async () => {
    setShowEndConfirm(false);
    try {
      await travelService.endTravel(id);
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || "Não foi possível finalizar.");
      setShowError(true);
    }
  };


  if (errorMsg || !viagem) {
    return (
      <ThemedView
        variant="secondary"
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
        />
        <View className="px-5 pt-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              name="arrow-left"
              size={24}
              color={isDark ? colors.foreground : "#1F2937"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Feather name="alert-circle" size={48} color={colors.error} />
          <ThemedText
            variant="primary"
            className="text-xl font-bold mt-4 text-center"
          >
            {errorMsg || "Viagem não encontrada"}
          </ThemedText>
          {gpsError && (
            <Text className="mt-2 text-center" style={{ color: colors.error }}>
              {gpsError}
            </Text>
          )}
        </View>
      </ThemedView>
    );
  }

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View className="flex-1">
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: LEAFLET_HTML }}
          style={{ flex: 1, backgroundColor: "black" }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleWebViewMessage}
          startInLoadingState
          scrollEnabled={false}
        />

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: insets.top + 8,
            zIndex: 10,
          }}
        >
          <View
            className="mx-4 rounded-2xl px-4 py-3 flex-row items-center shadow-lg"
            style={{
              backgroundColor: isDark
                ? `${colors.card}E6`
                : "rgba(255, 255, 255, 0.95)",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3 rounded-full p-2"
              style={{ backgroundColor: isDark ? colors.input : "#F3F4F6" }}
            >
              <Feather
                name="arrow-left"
                size={20}
                color={isDark ? colors.foreground : "#111827"}
              />
            </TouchableOpacity>
            <View className="flex-1">
              <ThemedText
                variant="muted"
                className="text-xs uppercase tracking-wide"
              >
                Indo para
              </ThemedText>
              <ThemedText
                variant="primary"
                className="text-base font-semibold"
                numberOfLines={1}
              >
                {formatarEndereco(viagem.end_fim) || "Destino da viagem"}
              </ThemedText>
            </View>
            <View
              className="px-3 py-1.5 rounded-full ml-3"
              style={{ backgroundColor: colors.success }}
            >
              <Text className="text-white text-xs font-semibold">
                Em viagem
              </Text>
            </View>
          </View>
        </View>

        {!showControls && (
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: insets.bottom + 30,
              right: 16,
              zIndex: 5,
              backgroundColor: isDark
                ? `${colors.card}E6`
                : "rgba(255, 255, 255, 0.9)",
              padding: 12,
              borderRadius: 9999,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={showControlsTemporarily}
          >
            <Feather
              name="layers"
              size={24}
              color={isDark ? colors.foreground : "#1F2937"}
            />
          </TouchableOpacity>
        )}

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
            position: "absolute",
            right: 4,
            top: insets.top + 120,
          }}
          pointerEvents={showControls ? "auto" : "none"}
        >
          <View
            className="rounded-3xl p-3 mb-3 shadow-lg"
            style={{ backgroundColor: isDark ? colors.card : "#FFFFFF" }}
          >
            <TouchableOpacity
              onPress={centralizarRota}
              className="items-center justify-center mb-3"
            >
              <Feather
                name="maximize-2"
                size={20}
                color={isDark ? colors.primary : "#1D4ED8"}
              />
            </TouchableOpacity>
            <View
              className="h-px mb-3"
              style={{ backgroundColor: isDark ? colors.border : "#E5E7EB" }}
            />
            <TouchableOpacity
              onPress={() => setSeguirLocalizacao((prev) => !prev)}
              className="items-center justify-center"
            >
              <Feather
                name={seguirLocalizacao ? "navigation" : "navigation"}
                size={20}
                color={
                  seguirLocalizacao
                    ? isDark
                      ? colors.primary
                      : "#1D4ED8"
                    : isDark
                      ? colors.foregroundMuted
                      : "#9CA3AF"
                }
              />
              <ThemedText variant="muted" className="text-[10px] mt-1">
                {seguirLocalizacao ? "Seguindo" : "Solto"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {(gpsError || erroDeRota || gpsLoading) && (
          <View
            className="absolute left-0 right-0"
            style={{ top: insets.top + 80 }}
          >
            <View
              className={`mx-4 rounded-xl px-4 py-2 shadow-lg ${gpsLoading ? "bg-blue-600/95" : "bg-red-600/95"}`}
            >
              <Text className="text-white text-sm font-semibold">
                {gpsLoading
                  ? "Buscando sinal de GPS..."
                  : gpsError || erroDeRota}
              </Text>
            </View>
          </View>
        )}

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [200, 0],
                }),
              },
            ],
            position: "absolute",
            left: 0,
            right: 0,
            bottom: insets.bottom + 20,
          }}
          pointerEvents={showControls ? "auto" : "none"}
        >
          <View
            className="mx-4 rounded-3xl px-4 py-5 shadow-2xl"
            style={{ backgroundColor: isDark ? colors.card : "#FFFFFF" }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <ThemedText variant="muted" className="text-xs uppercase">
                  Tempo
                </ThemedText>
                <ThemedText
                  variant="primary"
                  className="text-3xl font-semibold"
                >
                  {tempoRestante || tempoEstimado
                    ? `${tempoRestante || tempoEstimado} min`
                    : "--"}
                </ThemedText>
              </View>
              <View className="items-end">
                <ThemedText variant="muted" className="text-xs uppercase">
                  Distância
                </ThemedText>
                <ThemedText
                  variant="primary"
                  className="text-2xl font-semibold"
                >
                  {distanciaRestante || distanciaEstimada
                    ? `${distanciaRestante || distanciaEstimada} km`
                    : "--"}
                </ThemedText>
              </View>
            </View>

            <View className="flex-row items-center mb-3">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{
                  backgroundColor: isDark ? `${colors.primary}20` : "#DBEAFE",
                }}
              >
                <Feather
                  name="navigation-2"
                  size={24}
                  color={isDark ? colors.primary : "#2563EB"}
                />
              </View>
              <ThemedText
                variant="primary"
                className="flex-1 text-base font-semibold ml-3"
              >
                {proximaInstrucao?.instruction ||
                  "Siga em direção ao destino indicado"}
              </ThemedText>
            </View>

            <ThemedText variant="muted" className="text-xs" numberOfLines={1}>
              {enderecoAtual || "Obtendo endereço atual..."}
            </ThemedText>

            <View className="flex-row items-center justify-between mt-4">
              <TouchableOpacity
                onPress={handleFinalizarViagem}
                className="flex-1 bg-red-600 rounded-2xl py-3 mr-3 items-center shadow-md"
                activeOpacity={0.9}
              >
                <Text className="text-white font-semibold">
                  Finalizar viagem
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Detalhes", { id })}
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? colors.border : "#E5E7EB",
                }}
              >
                <Feather
                  name="menu"
                  size={20}
                  color={isDark ? colors.foreground : "#111827"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {estaCalculandoRota && (
          <View className="absolute left-0 right-0 bottom-0 mb-4 items-center">
            <View
              className="px-4 py-2 rounded-full flex-row items-center shadow"
              style={{
                backgroundColor: isDark
                  ? `${colors.card}E6`
                  : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <ActivityIndicator
                size="small"
                color={isDark ? colors.primary : "#1D4ED8"}
              />
              <ThemedText variant="primary" className="ml-2 text-sm">
                Calculando melhor rota...
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      <ConfirmModal
        visible={showEndConfirm}
        title="Finalizar Viagem"
        message="Deseja finalizar esta viagem agora?"
        onConfirm={confirmEndTravel}
        onCancel={() => setShowEndConfirm(false)}
        confirmText="Finalizar"
        type="danger"
      />

      <ConfirmModal
        visible={showSuccess}
        title="Sucesso"
        message="Viagem finalizada com sucesso."
        onConfirm={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
        confirmText="OK"
        cancelText=""
        type="success"
      />

      <ConfirmModal
        visible={showError}
        title="Erro"
        message={errorMessage}
        onConfirm={() => setShowError(false)}
        confirmText="OK"
        cancelText=""
        type="danger"
      />
    </View>
  );
}
