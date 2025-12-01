import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "route_cache_";
const EXPIRATION_DAYS = 30;

const getCoordKey = (lat, lon) =>
  `${Number(lat).toFixed(4)}_${Number(lon).toFixed(4)}`;

const generateKey = (origin, destination) => {
  const start = getCoordKey(origin[0], origin[1]);
  const end = getCoordKey(destination[0], destination[1]);
  return `${CACHE_PREFIX}${start}_to_${end}`;
};

export const RouteCacheService = {
  async getRoute(origin, destination) {
    try {
      const key = generateKey(origin, destination);
      const cached = await AsyncStorage.getItem(key);

      if (!cached) return null;

      const data = JSON.parse(cached);

      const now = Date.now();
      if (now - data.timestamp > EXPIRATION_DAYS * 24 * 60 * 60 * 1000) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      return data.route;
    } catch (error) {
      console.warn("Erro ao ler cache de rota:", error);
      return null;
    }
  },

  async saveRoute(origin, destination, routeData) {
    try {
      const key = generateKey(origin, destination);
      const payload = {
        timestamp: Date.now(),
        route: routeData,
      };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
    } catch (error) {
      console.warn("Erro ao salvar rota no cache:", error);
    }
  },

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const routeKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(routeKeys);
    } catch (error) {
      console.error("Erro ao limpar cache de rotas:", error);
    }
  },
};
