import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

export function useLocation(options = {}) {
  const {
    accuracy = Location.Accuracy.High,
    updateInterval = 2000,
    distanceInterval = 10,
    enabled = true,
  } = options;

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const watchSubscriptionRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const startLocationTracking = async () => {
      try {
        setLoading(true);
        setError(null);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permissão de localização negada");
        }

        const lastKnown = await Location.getLastKnownPositionAsync();
        if (isMounted && lastKnown) {
          setLocation({
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
            accuracy: lastKnown.coords.accuracy,
            heading: lastKnown.coords.heading,
            speed: lastKnown.coords.speed,
          });
          setLoading(false);
        }
        watchSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy,
            timeInterval: updateInterval,
            distanceInterval: distanceInterval,
          },
          (newLocation) => {
            if (isMounted) {
              setLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                accuracy: newLocation.coords.accuracy,
                heading: newLocation.coords.heading,
                speed: newLocation.coords.speed,
              });
              setLoading(false);
            }
          }
        );
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Erro ao obter localização");
          setLoading(false);
        }
      }
    };

    startLocationTracking();

    return () => {
      isMounted = false;
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
        watchSubscriptionRef.current = null;
      }
    };
  }, [enabled, accuracy, updateInterval, distanceInterval]);

  return { location, error, loading };
}
