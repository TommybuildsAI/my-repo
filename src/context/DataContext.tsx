import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Job, JobStatus, TeamMember } from '@/types/models';
import { crmService } from '@/services/crmService';
import { seedMembers } from '@/data/seed';
import { StorageKeys, loadJson, saveJson } from '@/services/storage';

interface DataValue {
  members: TeamMember[];
  jobs: Job[];
  loading: boolean;
  employees: TeamMember[];
  memberById: (id: string | null | undefined) => TeamMember | undefined;
  jobsForMember: (memberId: string) => Job[];
  unassignedJobs: Job[];
  assignJob: (jobId: string, memberId: string | null) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  refreshFromCrm: () => Promise<void>;
}

const DataContext = createContext<DataValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Hydrate from storage, or seed on first launch.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const seeded = await loadJson<boolean>(StorageKeys.seeded, false);
      if (seeded) {
        const [storedMembers, storedJobs] = await Promise.all([
          loadJson<TeamMember[]>(StorageKeys.members, []),
          loadJson<Job[]>(StorageKeys.jobs, []),
        ]);
        if (!mounted) return;
        setMembers(storedMembers);
        setJobs(storedJobs);
        setLoading(false);
      } else {
        const freshMembers = seedMembers();
        const crmJobs = await crmService.getJobs();
        if (!mounted) return;
        setMembers(freshMembers);
        setJobs(crmJobs);
        setLoading(false);
        void saveJson(StorageKeys.members, freshMembers);
        void saveJson(StorageKeys.jobs, crmJobs);
        void saveJson(StorageKeys.seeded, true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persistJobs = useCallback((next: Job[]) => {
    setJobs(next);
    void saveJson(StorageKeys.jobs, next);
  }, []);

  const assignJob = useCallback(
    (jobId: string, memberId: string | null) => {
      setJobs((prev) => {
        const next = prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                assignedToId: memberId,
                status: memberId ? j.status : 'assigned',
                updatedAt: new Date().toISOString(),
              }
            : j
        );
        void saveJson(StorageKeys.jobs, next);
        return next;
      });
    },
    []
  );

  const updateJobStatus = useCallback((jobId: string, status: JobStatus) => {
    setJobs((prev) => {
      const next = prev.map((j) =>
        j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j
      );
      void saveJson(StorageKeys.jobs, next);
      return next;
    });
  }, []);

  const refreshFromCrm = useCallback(async () => {
    setLoading(true);
    const crmJobs = await crmService.getJobs();
    // Preserve local dispatch state (status/assignment) for jobs we already track.
    setJobs((prev) => {
      const byId = new Map(prev.map((j) => [j.id, j]));
      const merged = crmJobs.map((cj) => {
        const local = byId.get(cj.id);
        return local ? { ...cj, status: local.status, assignedToId: local.assignedToId } : cj;
      });
      void saveJson(StorageKeys.jobs, merged);
      return merged;
    });
    setLoading(false);
  }, []);

  const memberById = useCallback(
    (id: string | null | undefined) => members.find((m) => m.id === id),
    [members]
  );

  const jobsForMember = useCallback(
    (memberId: string) => jobs.filter((j) => j.assignedToId === memberId),
    [jobs]
  );

  const value = useMemo<DataValue>(
    () => ({
      members,
      jobs,
      loading,
      employees: members.filter((m) => m.role === 'employee'),
      memberById,
      jobsForMember,
      unassignedJobs: jobs.filter((j) => j.assignedToId === null),
      assignJob,
      updateJobStatus,
      refreshFromCrm,
    }),
    [members, jobs, loading, memberById, jobsForMember, assignJob, updateJobStatus, refreshFromCrm]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
