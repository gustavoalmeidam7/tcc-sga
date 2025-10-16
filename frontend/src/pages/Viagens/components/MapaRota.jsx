import { useEffect, memo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet-providers";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;

const origemIcon = L.AwesomeMarkers.icon({
  icon: 'home',
  markerColor: 'green',
  prefix: 'fa',
  iconColor: 'white'
});

const destinoIcon = L.AwesomeMarkers.icon({
  icon: 'hospital',
  markerColor: 'red',
  prefix: 'fa',
  iconColor: 'white'
});

function MapUpdater({ center, zoom, rota, coordOrigem, coordDestino }) {
  const map = useMap();

  useEffect(() => {
    if (rota && rota.length > 0) {
      const bounds = L.latLngBounds(rota);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1.5
      });
    }
    else if (coordOrigem && coordDestino) {
      const bounds = L.latLngBounds([coordOrigem, coordDestino]);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1.5
      });
    }
    else if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map, rota, coordOrigem, coordDestino]);

  return null;
}


function MapaRotaComponent({
  center,
  zoom,
  coordOrigem,
  coordDestino,
  origem,
  destino,
  rota,
  loading,
}) {
  return (
    <div className="xl:col-span-2">
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all py-1">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent p-3 md:p-4 lg:p-2">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Mapa da Rota
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {loading
              ? "Calculando rota..."
              : rota.length > 0
              ? "Rota calculada"
              : "Aguardando endereços"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div className="relative">
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: "500px", width: "100%" }}
              scrollWheelZoom={true}
              className="z-0"
              maxBounds={[
                [-33.75, -73.99],
                [5.27, -34.73],
              ]}
              minZoom={4}
              maxZoom={18}
            >
              <MapUpdater
                center={center}
                zoom={zoom}
                rota={rota}
                coordOrigem={coordOrigem}
                coordDestino={coordDestino}
              />

              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="CartoDB Dark">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="CartoDB Light">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri Satélite">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri'
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {coordOrigem && (
                <Marker position={coordOrigem} icon={origemIcon}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold text-green-600">🏠 Origem</p>
                      <p className="text-xs mt-1">{origem}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {coordDestino && (
                <Marker position={coordDestino} icon={destinoIcon}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold text-red-600">🏥 Destino</p>
                      <p className="text-xs mt-1">{destino}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {rota.length > 0 && (
                <Polyline
                  positions={rota}
                  color="#3b82f6"
                  weight={5}
                  opacity={0.7}
                />
              )}
            </MapContainer>

            {loading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 md:h-12 md:w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-sm md:text-lg font-semibold">
                    Calculando melhor rota...
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const MapaRota = memo(MapaRotaComponent);
