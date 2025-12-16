import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Platform } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import * as Location from "expo-location";
import travelService from "@/services/travel";
import { useLocation } from "@/hooks/useLocation";
import { useGeoapifyRouting } from "@/hooks/useGeoapifyRouting";
import { Travel } from "@/types/models";

const normalizeCoordinate = (point: any) => {
  if (!point) return null;
  if (Array.isArray(point) && point.length === 2) {
    const lat = Number(point[0]);
    const lon = Number(point[1]);
    return Number.isFinite(lat) && Number.isFinite(lon)
      ? { latitude: lat, longitude: lon }
      : null;
  }
  const latitude = Number(point.latitude ?? point.lat ?? point.y ?? point[0]);
  const longitude = Number(point.longitude ?? point.lng ?? point.x ?? point[1]);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude };
  }
  return null;
};

const normalizeCoordinatesArray = (coords: any[] = []) =>
  coords
    .map(normalizeCoordinate)
    .filter((c) => c !== null) as { latitude: number; longitude: number }[];

const calcularDistancia = (point1: any, point2: any) => {
  if (!point1 || !point2) return 0;
  const R = 6371e3;
  const lat1 = (point1.latitude * Math.PI) / 180;
  const lat2 = (point2.latitude * Math.PI) / 180;
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export function useRideNavigation(tripId: string | null) {
  const webViewRef = useRef<WebView>(null);
  const lastSentRouteRef = useRef<string>("");

  const [viagem, setViagem] = useState<Travel | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [faseAtual, setFaseAtual] = useState<"buscar_paciente" | "corrida_andamento">("buscar_paciente");
  const [pacienteConfirmado, setPacienteConfirmado] = useState(false);
  const [mostrarConfirmacaoPaciente, setMostrarConfirmacaoPaciente] = useState(false);
  const [modalAutomaticoMostrado, setModalAutomaticoMostrado] = useState(false);

  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [followUser, setFollowUser] = useState(true);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [dynamicETA, setDynamicETA] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const [showManeuverAlert, setShowManeuverAlert] = useState(false);
  const [alertDistance, setAlertDistance] = useState<number | null>(null);

  const { location: userLocation, loading: isLoadingLocation } = useLocation({
    accuracy: Location.Accuracy.BestForNavigation,
    updateInterval: 1000,
    distanceInterval: 1,
  }) as {
    location: {
      latitude: number;
      longitude: number;
      heading: number | null;
      speed: number | null;
    } | null;
    loading: boolean;
  };

  useEffect(() => {
    if (tripId) {
      setLoading(true);
      travelService
        .getTravelById(tripId)
        .then(setViagem)
        .catch((err) => {
          console.error("Erro ao carregar viagem:", err);
          setErrorMsg(err.message || "Erro ao carregar detalhes da viagem");
        })
        .finally(() => setLoading(false));
    }
  }, [tripId]);

  useEffect(() => {
    if (faseAtual === "buscar_paciente") setModalAutomaticoMostrado(false);
  }, [faseAtual]);
  useEffect(() => {
    if (userLocation?.speed !== null && userLocation?.speed !== undefined) {
      const speedKmh = Math.round((userLocation.speed || 0) * 3.6);
      setCurrentSpeed(speedKmh >= 0 ? speedKmh : 0);
    } else {
      setCurrentSpeed(0);
    }
  }, [userLocation?.speed]);

  const coordOrigem = useMemo(() => {
    return userLocation 
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : null;
  }, [userLocation]);

  const coordDestino = useMemo(() => {
    if (faseAtual === "buscar_paciente")
      return viagem?.lat_inicio
        ? {
            latitude: Number(viagem.lat_inicio),
            longitude: Number(viagem.long_inicio),
          }
        : null;
    return viagem?.lat_fim
      ? { latitude: Number(viagem.lat_fim), longitude: Number(viagem.long_fim) }
      : null;
  }, [faseAtual, viagem]);

  const closestRouteIndex = useMemo(() => {
    if (!userLocation || !routeCoordinates.length) return 0;
    
    const searchLimit = Math.min(50, Math.ceil(routeCoordinates.length * 0.1));
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;

    for (let i = 0; i < searchLimit; i++) {
      const d = calcularDistancia(userLocation, routeCoordinates[i]);
      if (d < minDistance) {
        minDistance = d;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [userLocation?.latitude, userLocation?.longitude, routeCoordinates]);

  const slicedRoute = useMemo(() => 
    closestRouteIndex > 0 
      ? routeCoordinates.slice(closestRouteIndex) 
      : routeCoordinates,
    [routeCoordinates, closestRouteIndex]
  );

  const shouldRecalculateRoute = useMemo(() => {
    if (!userLocation || !routeCoordinates.length) return true;
    const nearestPoint = routeCoordinates[closestRouteIndex];
    if (!nearestPoint) return true;
    const distanceFromRoute = calcularDistancia(userLocation, nearestPoint);
    return distanceFromRoute > 100;
  }, [userLocation, routeCoordinates, closestRouteIndex]);

  interface GeoapifyResponse {
    distancia: string | null;
    duracao: number | null;
    instructions: any[];
    coordinates: any[][];
  }

  const coordOrigemArray = useMemo(() => 
    coordOrigem ? [coordOrigem.latitude, coordOrigem.longitude] : null, 
    [coordOrigem]
  );

  const coordDestinoArray = useMemo(() => 
    coordDestino ? [coordDestino.latitude, coordDestino.longitude] : null, 
    [coordDestino]
  );

  const { isLoading: calculandoRota } = useGeoapifyRouting(
    coordOrigemArray,
    coordDestinoArray,
    (res: GeoapifyResponse | null) => {
      if (!res) return;
      setDistance(res.distancia ? Number(res.distancia) : 0);
      setDuration(res.duracao || 0);
      setInstructions(res.instructions || []);
      const coords = normalizeCoordinatesArray(res.coordinates || []);
      if (coords.length > 0) setRouteCoordinates(coords);
    },
    { 
      enabled: !!(coordOrigem && coordDestino && mapReady && shouldRecalculateRoute), 
      updateInterval: null
    }
  );

  useEffect(() => {
    if (!mapReady || !webViewRef.current || !slicedRoute.length) return;
    
    webViewRef.current.postMessage(
      JSON.stringify({
        type: "UPDATE_ROUTE",
        data: {
          route: slicedRoute,
          destination: coordDestino
            ? { lat: coordDestino.latitude, lng: coordDestino.longitude }
            : null,
        },
      })
    );
  }, [mapReady, slicedRoute, coordDestino]);

  const hasInitialFitRef = useRef(false);
  useEffect(() => {
    if (mapReady && routeCoordinates.length > 0 && !hasInitialFitRef.current) {
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: "FIT_ROUTE",
          data: { route: routeCoordinates },
        })
      );
      hasInitialFitRef.current = true;
    }
  }, [mapReady, routeCoordinates.length]);

  useEffect(() => {
    if (mapReady && userLocation && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: "UPDATE_POS",
          data: {
            ambulance: { ...userLocation, heading: userLocation.heading || 0 },
            follow: followUser,
          },
        })
      );
    }
  }, [mapReady, userLocation, followUser]);

  useEffect(() => {
    if (!userLocation || !slicedRoute.length) return;
    
    const speedKmh = (userLocation.speed || 0) * 3.6;
    setCurrentSpeed(speedKmh);
    
    let totalDistance = 0;
    for (let i = 0; i < slicedRoute.length - 1; i++) {
      totalDistance += calcularDistancia(slicedRoute[i], slicedRoute[i + 1]);
    }
    setDistanceRemaining(totalDistance);
    
    if (speedKmh > 5) {
      const etaMinutes = (totalDistance / 1000) / speedKmh * 60;
      setDynamicETA(Math.ceil(etaMinutes));
    } else {
      setDynamicETA(duration); 
    }
  }, [userLocation, slicedRoute, duration]);

  useEffect(() => {
    if (faseAtual === "buscar_paciente" && !startTime) {
      setStartTime(Date.now());
    }
    
    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, faseAtual]);

  const nextInstructions = useMemo(() => {
    const next2 = instructions.slice(0, 2);
    return {
      current: next2[0] || null,
      upcoming: next2[1] || null,
    };
  }, [instructions]);

  useEffect(() => {
    const distToManeuver = nextInstructions.current?.distance || 0;
    
    if (distToManeuver <= 200 && distToManeuver > 100) {
      setAlertDistance(200);
      setShowManeuverAlert(true);
    } else if (distToManeuver <= 100 && distToManeuver > 50) {
      setAlertDistance(100);
      setShowManeuverAlert(true);
    } else if (distToManeuver <= 50 && distToManeuver > 0) {
      setAlertDistance(50);
      setShowManeuverAlert(true);
    } else {
      setShowManeuverAlert(false);
      setAlertDistance(null);
    }
  }, [nextInstructions]);

  const isOffRoute = useMemo(() => {
    if (!userLocation || !routeCoordinates.length) return false;
    const nearestPoint = routeCoordinates[closestRouteIndex];
    if (!nearestPoint) return false;
    
    const distanceFromRoute = calcularDistancia(userLocation, nearestPoint);
    
    const speedKmh = (userLocation.speed || 0) * 3.6;
    return distanceFromRoute > 50 && speedKmh > 10;
  }, [userLocation, routeCoordinates, closestRouteIndex]);

  useEffect(() => {
    if (
      faseAtual === "buscar_paciente" &&
      userLocation &&
      coordDestino &&
      !pacienteConfirmado
    ) {
      const dist = calcularDistancia(userLocation, coordDestino);
      
      if (dist < 150 && !mostrarConfirmacaoPaciente && !modalAutomaticoMostrado) {
        setMostrarConfirmacaoPaciente(true);
        setModalAutomaticoMostrado(true);
      }
      
      if (dist > 200 && modalAutomaticoMostrado) {
          setModalAutomaticoMostrado(false);
          setMostrarConfirmacaoPaciente(false); 
      }
    }
  }, [userLocation, coordDestino, faseAtual, pacienteConfirmado, mostrarConfirmacaoPaciente, modalAutomaticoMostrado]);

  const handleRecenter = () => {
    setFollowUser(true);
    if (userLocation && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: "RESET_ZOOM",
        })
      );
      
      setTimeout(() => {
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: "UPDATE_POS",
            data: {
              ambulance: { ...userLocation, heading: userLocation.heading || 0 },
              follow: true,
            },
          })
        );
      }, 100); 
    }
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const d = JSON.parse(event.nativeEvent.data);
      if (d.type === "READY") setMapReady(true);
      if (d.type === "USER_INTERACTION") setFollowUser(false);
    } catch {}
  };

  const confirmarPacienteBuscado = () => {
    setPacienteConfirmado(true);
    setFaseAtual("corrida_andamento");
    setMostrarConfirmacaoPaciente(false);
  };

  return {
    webViewRef,
    
    viagem,
    loading,
    errorMsg,
    faseAtual,
    pacienteConfirmado,
    mostrarConfirmacaoPaciente,
    
    distance,
    duration,
    instructions,
    calculandoRota,
    followUser,
    mapReady,
    
    currentSpeed, 
    dynamicETA,
    distanceRemaining,
    elapsedTime,
    nextInstructions,
    showManeuverAlert,
    alertDistance,
    isOffRoute,
    
    setMostrarConfirmacaoPaciente,
    setFaseAtual,
    handleRecenter,
    handleWebViewMessage,
    confirmarPacienteBuscado,
    setErrorMsg
  };
}
