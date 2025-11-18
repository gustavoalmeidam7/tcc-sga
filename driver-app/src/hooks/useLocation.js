import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

export function useLocation(options = {}) {
  const {
    accuracy = Location.Accuracy.High,
    updateInterval = 5000,
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

    const requestPermissionsAndGetLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permissão de localização negada");
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy,
        });

        if (isMounted) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            accuracy: currentLocation.coords.accuracy,
            heading: currentLocation.coords.heading,
            speed: currentLocation.coords.speed,
          });
          setLoading(false);
        }

        watchSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy,
            timeInterval: updateInterval,
            distanceInterval: 10,
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

    requestPermissionsAndGetLocation();

    return () => {
      isMounted = false;
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
        watchSubscriptionRef.current = null;
      }
    };
  }, [enabled, accuracy, updateInterval]);

  return { location, error, loading };
}
