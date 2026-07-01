import { seedJobs } from '@/data/seed';
import type { Job } from '@/types/models';

/**
 * CRM service boundary. The app only ever imports `crmService`, so swapping the
 * mock for a real HTTP-backed implementation later is a one-line change here —
 * no callers need to be touched.
 *
 * The CRM is the read-only source of record for which jobs *exist*. Dispatch
 * state (status / assignment) is owned by the app (DataContext + AsyncStorage),
 * which mirrors how a real field-service integration works.
 */
export interface CrmService {
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | null>;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockCrmService: CrmService = {
  async getJobs() {
    await delay(300); // mimic network latency
    return seedJobs();
  },
  async getJob(id: string) {
    await delay(150);
    return seedJobs().find((j) => j.id === id) ?? null;
  },
};

// Swap to a real implementation later, e.g.:
//   export const crmService: CrmService = httpCrmService;
export const crmService: CrmService = mockCrmService;
