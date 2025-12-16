export const buildLeafletHtml = (
  center: { latitude: number; longitude: number }
) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      :root { --bg-color: #f3f4f6; }
      body, html { margin: 0; padding: 0; height: 100%; width: 100%; background: var(--bg-color); overflow: hidden; }
      
      #map-container {
        width: 100%; height: 100%;
        position: absolute; top: 0; left: 0;
        display: flex; align-items: center; justify-content: center;
      }
      #map { 
          width: 150vmax; 
          height: 150vmax; 
          position: relative;
          transition: transform 0.3s ease-out;
          will-change: transform;
      }

      .nav-arrow-container {
        width: 48px; height: 48px;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.3s linear;
        will-change: transform;
      }
      .nav-arrow {
        width: 0; height: 0;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        border-bottom: 34px solid #2563EB;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        transform: translateY(-4px);
        z-index: 2;
      }
      .nav-halo {
        position: absolute; width: 64px; height: 64px;
        background: rgba(37, 99, 235, 0.15);
        border-radius: 50%; z-index: 1;
        animation: pulse 2s infinite;
      }
      @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }

      .route-outline { stroke: #1e293b; stroke-width: 10; opacity: 0.4; stroke-linecap: round; }
      .route-fill { stroke: #3b82f6; stroke-width: 7; opacity: 1; stroke-linecap: round; }
      
      .pin-dest {
        background: #ef4444; width: 24px; height: 24px;
        border: 4px solid white; border-radius: 50%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      }
      
      .leaflet-control-attribution { display: none; }
    </style>
  </head>
  <body>
    <div id="map-container">
        <div id="map"></div>
    </div>
    
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      (function () {
        const initialCenter = [${center.latitude}, ${center.longitude}];
        const map = L.map("map", { 
            zoomControl: false, 
            attributionControl: false, 
            fadeAnimation: true, 
            zoomAnimation: true, 
            inertia: true 
        }).setView(initialCenter, 18);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          maxZoom: 20, subdomains: "abcd"
        }).addTo(map);

        let userMarker, routeBack, routeFront, destMarker;
        let currentRoute = [];
        const navIcon = L.divIcon({ html: '<div class="nav-arrow-container"><div class="nav-halo"></div><div class="nav-arrow"></div></div>', className: 'bg-transparent', iconSize: [48, 48], iconAnchor: [24, 24] });
        const destIcon = L.divIcon({ html: '<div class="pin-dest"></div>', className: 'bg-transparent', iconSize: [28, 28], iconAnchor: [14, 14] });
        const mapEl = document.getElementById('map');

        const normalize = (pt) => { if(!pt) return null; return [pt.latitude ?? pt.lat ?? pt[0], pt.longitude ?? pt.lng ?? pt[1]]; };

        let currentRotation = 0;
        let targetRotation = 0;
        let isUserInteracting = false;
        let rotationAnimationFrame = null;
        let lastInteractionTime = 0;

        mapEl.addEventListener('touchstart', () => {
          isUserInteracting = true;
          lastInteractionTime = Date.now();
        });

        mapEl.addEventListener('touchend', () => {
          setTimeout(() => {
            isUserInteracting = false;
          }, 1000);
        });

        function animateRotation() {
          if (isUserInteracting) {
            rotationAnimationFrame = requestAnimationFrame(animateRotation);
            return;
          }

          const diff = targetRotation - currentRotation;
          
          let normalizedDiff = diff;
          if (diff > 180) normalizedDiff = diff - 360;
          if (diff < -180) normalizedDiff = diff + 360;
          const rotationSpeed = 0.35;
          currentRotation += normalizedDiff * rotationSpeed;

          if (currentRotation >= 360) currentRotation -= 360;
          if (currentRotation < 0) currentRotation += 360;

          mapEl.style.transform = 'rotate(' + (-currentRotation) + 'deg)';
          mapEl.style.transition = 'none';

          if (Math.abs(normalizedDiff) > 0.5) {
            rotationAnimationFrame = requestAnimationFrame(animateRotation);
          }
        }

        window.updateUser = (data, follow) => {
          const coords = normalize(data); if (!coords) return;
          
          if (!userMarker) {
              userMarker = L.marker(coords, { icon: navIcon, zIndexOffset: 1000 }).addTo(map);
          } else {
             userMarker.setLatLng(coords);
          }
          
          if (typeof data.heading === 'number' && !isNaN(data.heading)) {
             targetRotation = data.heading;
             
             if (!rotationAnimationFrame) {
               rotationAnimationFrame = requestAnimationFrame(animateRotation);
             }
             
             const iconRotation = data.heading;
             const arrowContainer = userMarker.getElement()?.querySelector('.nav-arrow-container');
             if (arrowContainer) {
                arrowContainer.style.transform = 'rotate(' + iconRotation + 'deg)';
                arrowContainer.style.transition = 'transform 0.3s ease-out';
             }
          }

          if (follow) {
              map.setView(coords, map.getZoom(), { animate: true, duration: 0.5 });
          }
        };


        window.updateRoute = (points) => {
           if(!points || !points.length) return;
           const latlngs = points.map(normalize).filter(p => p);
           currentRoute = latlngs;
           if(routeBack) map.removeLayer(routeBack);
           if(routeFront) map.removeLayer(routeFront);
           routeBack = L.polyline(latlngs, { className: 'route-outline' }).addTo(map);
           routeFront = L.polyline(latlngs, { className: 'route-fill' }).addTo(map);
           routeBack.bringToBack(); routeFront.bringToBack();
        };

        window.updateDest = (pt) => {
            const c = normalize(pt); if(!c) return;
            if(!destMarker) destMarker = L.marker(c, { icon: destIcon }).addTo(map);
            else destMarker.setLatLng(c);
        };

        window.fitAll = (points) => { 
            if(!points || points.length < 2) return; 
            map.fitBounds(L.latLngBounds(points), { 
                padding: [50, 50],
                animate: true,
                duration: 0.5
            }); 
        };

        const notifyInteraction = () => {
             if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ type: "USER_INTERACTION" }));
        };
        
        map.on('dragstart', notifyInteraction);
        map.on('zoomstart', notifyInteraction);
        map.on('movestart', (e) => {
        });

        document.addEventListener("message", handleMsg); window.addEventListener("message", handleMsg);
        function handleMsg(e) {
            try {
                const payload = JSON.parse(e.data);
                if (payload.type === "UPDATE_POS") window.updateUser(payload.data.ambulance, payload.data.follow);
                else if (payload.type === "UPDATE_ROUTE") { window.updateRoute(payload.data.route); if(payload.data.destination) window.updateDest(payload.data.destination); }
                else if (payload.type === "FIT_ROUTE") {
                    window.fitAll(payload.data.route);
                }
                else if (payload.type === "RESET_ZOOM") {
                    if (userMarker) {
                        map.setView(userMarker.getLatLng(), 19, { 
                            animate: true, 
                            duration: 0.5 
                        });
                    }
                }
            } catch(err) {}
        }
        setTimeout(() => { if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ type: "READY" })); }, 500);
      })();
    </script>
  </body>
</html>
`;
