import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const ActiveTravelContext = createContext(null);

export function ActiveTravelProvider({ children }) {
  const [activeTravelId, setActiveTravelId] = useState(null);

  useEffect(() => {
    const savedActiveTravel = localStorage.getItem("activeTravelId");
    if (savedActiveTravel) {
      setActiveTravelId(savedActiveTravel);
    }
  }, []);

  useEffect(() => {
    if (activeTravelId) {
      localStorage.setItem("activeTravelId", activeTravelId);
    } else {
      localStorage.removeItem("activeTravelId");
    }
  }, [activeTravelId]);

  const setActiveTravel = useCallback((travelId) => {
    setActiveTravelId(travelId);
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
