import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { LocationPing } from '@/types/models';
import { locationSim } from '@/services/locationSim';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';

interface LocationValue {
  pings: Record<string, LocationPing>;
}

const LocationContext = createContext<LocationValue | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { members, jobs, loading } = useData();
  const { currentUser } = useSession();
  const [pings, setPings] = useState<Record<string, LocationPing>>({});

  // (Re)start the simulation whenever the roster or job targets change.
  useEffect(() => {
    if (loading || members.length === 0) return;
    locationSim.start(members, jobs);
  }, [members, jobs, loading]);

  // Subscribe to live pings.
  useEffect(() => {
    const unsub = locationSim.subscribe(setPings);
    return unsub;
  }, []);

  // Try to use the device's real GPS for the current user's own marker.
  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    (async () => {
      if (!currentUser) return;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;
        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 15, timeInterval: 5000 },
          (pos) => {
            locationSim.setOverride(currentUser.id, {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          }
        );
      } catch {
        // Location unavailable (e.g. simulator without a fix) — simulated position is used.
      }
    })();
    return () => {
      cancelled = true;
      if (currentUser) locationSim.setOverride(currentUser.id, null);
      sub?.remove();
    };
  }, [currentUser]);

  return <LocationContext.Provider value={{ pings }}>{children}</LocationContext.Provider>;
}

export function useLocations(): LocationValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocations must be used within LocationProvider');
  return ctx;
}
