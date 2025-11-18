import { useState, useEffect, useCallback, useMemo } from "react";
import authService from "../services/auth";
import { formatarDateParaBackend } from "@/src/lib/date-utils";

const isWithinBusinessDays = (cachedDate, businessDays = 7) => {
  const now = new Date();
  const cached = new Date(cachedDate);
  const diffTime = now - cached;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return true;

  let businessDaysPassed = 0;
  const currentDate = new Date(cached);

  for (let i = 0; i <= diffDays && businessDaysPassed < businessDays; i++) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      businessDaysPassed++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDaysPassed < businessDays;
};

const cleanExpiredCache = (usersMap) => {
  const cleaned = new Map();

  usersMap.forEach((value, key) => {
    if (value.cachedAt && isWithinBusinessDays(value.cachedAt, 7)) {
      cleaned.set(key, value);
    }
  });

  return cleaned;
};

export const useUsers = (userIds = []) => {
  const [users, setUsers] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(new Map());

  const userIdsKey = useMemo(() => {
    return JSON.stringify([...new Set(userIds.filter(Boolean))].sort());
  }, [userIds]);

  useEffect(() => {
    setUsers((prev) => cleanExpiredCache(prev));
  }, [userIdsKey]);

  const idsToFetch = useMemo(() => {
    const uniqueIds = [...new Set(userIds.filter(Boolean))];
    return uniqueIds
      .filter((id) => {
        const cached = users.get(id);
        if (!cached) return true;
        if (!cached.cachedAt) return true;
        return !isWithinBusinessDays(cached.cachedAt, 7);
      })
      .filter((id) => !errors.has(id));
  }, [userIds, users, errors]);

  const fetchUser = useCallback(async (userId) => {
    try {
      const user = await authService.getUserById(userId);
      const now = new Date();
      setUsers((prev) => {
        const newMap = new Map(prev);
        newMap.set(userId, {
          user,
          cachedAt: formatarDateParaBackend(now),
        });
        return newMap;
      });
      setErrors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
      return user;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${userId}:`, error);
      setErrors((prev) => {
        const newMap = new Map(prev);
        newMap.set(userId, error.message || "Erro ao buscar usuário");
        return newMap;
      });
      return null;
    }
  }, []);

  useEffect(() => {
    if (idsToFetch.length === 0) return;

    setLoading(true);
    Promise.all(idsToFetch.map((id) => fetchUser(id))).finally(() =>
      setLoading(false)
    );
  }, [idsToFetch, fetchUser]);

  const getUser = useCallback(
    (userId) => {
      const cached = users.get(userId);
      if (!cached) return null;

      if (cached.cachedAt && !isWithinBusinessDays(cached.cachedAt, 7)) {
        setTimeout(() => {
          setUsers((prev) => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });
        }, 0);
        return null;
      }

      return cached.user || null;
    },
    [users]
  );

  const getUserName = useCallback(
    (userId) => {
      const cached = users.get(userId);
      if (!cached) return null;

      if (cached.cachedAt && !isWithinBusinessDays(cached.cachedAt, 7)) {
        setTimeout(() => {
          setUsers((prev) => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });
        }, 0);
        return null;
      }

      return cached.user?.nome || null;
    },
    [users]
  );

  return {
    users,
    loading,
    errors,
    getUser,
    getUserName,
    fetchUser,
  };
};
