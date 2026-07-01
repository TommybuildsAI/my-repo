import React from 'react';
import { useData } from '@/context/DataContext';
import { MapFallback } from '@/components/MapFallback';

/**
 * Web variant — react-native-maps has no web support, so we render the same
 * live list fallback. Native platforms use TeamMap.tsx (real MapView).
 */
export function TeamMap({ focusMemberId }: { focusMemberId?: string }) {
  const { members, jobs } = useData();
  const shownMembers = focusMemberId ? members.filter((m) => m.id === focusMemberId) : members;
  const shownJobs = focusMemberId
    ? jobs.filter((j) => j.assignedToId === focusMemberId && j.status !== 'done')
    : jobs.filter((j) => j.status !== 'done');
  return <MapFallback members={shownMembers} jobs={shownJobs} />;
}
