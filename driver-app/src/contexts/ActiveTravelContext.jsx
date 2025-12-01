import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActiveTravelContext = createContext(null);

export function ActiveTravelProvider({ children }) {
  const [activeTravelId, setActiveTravelId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredId = async () => {
      try {
        const savedActiveTravel = await AsyncStorage.getItem("activeTravelId");
        if (savedActiveTravel) {
          setActiveTravelId(savedActiveTravel);
        }
      } catch (error) {
        console.warn("Erro ao carregar viagem ativa:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStoredId();
  }, []);

  useEffect(() => {
    const saveId = async () => {
      try {
        if (activeTravelId) {
          await AsyncStorage.setItem("activeTravelId", activeTravelId);
        } else {
          await AsyncStorage.removeItem("activeTravelId");
        }
      } catch (error) {
        console.warn("Erro ao salvar viagem ativa:", error);
      }
    };

    if (!loading) {
      saveId();
    }
  }, [activeTravelId, loading]);

  const setActiveTravel = useCallback((travelId) => {
    setActiveTravelId(travelId ? String(travelId) : null);
  }, []);

  const clearActiveTravel = useCallback(() => {
    setActiveTravelId(null);
  }, []);

  const hasActiveTravel = useCallback(() => {
    return activeTravelId !== null;
  }, [activeTravelId]);

  const value = {
    activeTravelId,
    setActiveTravel,
    clearActiveTravel,
    hasActiveTravel,
    loading,
  };

  return (
    <ActiveTravelContext.Provider value={value}>
      {children}
    </ActiveTravelContext.Provider>
  );
}

export function useActiveTravel() {
  const context = useContext(ActiveTravelContext);
  if (!context) {
    throw new Error(
      "useActiveTravel deve ser usado dentro de um ActiveTravelProvider"
    );
  }
  return context;
}

