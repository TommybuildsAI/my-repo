import type { Coordinate, Job, LocationPing, TeamMember } from '@/types/models';

/**
 * Mock "realtime" location engine. Pure JS (no native deps), so it behaves
 * identically inside Expo Go. Every ~2s it steps each member's coordinate a
 * small fraction toward a target (the location of their active job) and emits a
 * fresh pings map to subscribers. Members idle with a little jitter on arrival
 * so markers appear to "work" at the site.
 */

type PingsMap = Record<string, LocationPing>;
type Subscriber = (pings: PingsMap) => void;

const TICK_MS = 2000;
const STEP_FRACTION = 0.06; // fraction of remaining distance per tick
const ARRIVE_THRESHOLD = 0.0004; // ~40m in degrees
const JITTER = 0.00008;

interface SimState {
  coordinate: Coordinate;
  target: Coordinate;
  heading: number;
}

class LocationSim {
  private state: Record<string, SimState> = {};
  private subscribers = new Set<Subscriber>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private overrides: Record<string, Coordinate> = {};

  /** (Re)initialise targets from members + jobs and start the ticker. */
  start(members: TeamMember[], jobs: Job[]): void {
    for (const m of members) {
      const activeJob = jobs.find(
        (j) => j.assignedToId === m.id && (j.status === 'assigned' || j.status === 'in_progress')
      );
      const target = activeJob ? activeJob.location : m.homeBase;
      const prev = this.state[m.id];
      this.state[m.id] = {
        coordinate: prev?.coordinate ?? { ...m.homeBase },
        target,
        heading: prev?.heading ?? 0,
      };
    }
    // Drop members no longer present
    for (const id of Object.keys(this.state)) {
      if (!members.some((m) => m.id === id)) delete this.state[id];
    }

    if (!this.timer) {
      this.timer = setInterval(() => this.tick(), TICK_MS);
    }
    this.emit();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  subscribe(cb: Subscriber): () => void {
    this.subscribers.add(cb);
    // Emit current snapshot immediately
    cb(this.snapshot());
    return () => {
      this.subscribers.delete(cb);
    };
  }

  /** Override a member's coordinate with a real GPS fix (the device user). */
  setOverride(memberId: string, coordinate: Coordinate | null): void {
    if (coordinate) {
      this.overrides[memberId] = coordinate;
    } else {
      delete this.overrides[memberId];
    }
  }

  private tick(): void {
    for (const id of Object.keys(this.state)) {
      const s = this.state[id];
      const dLat = s.target.latitude - s.coordinate.latitude;
      const dLon = s.target.longitude - s.coordinate.longitude;
      const dist = Math.hypot(dLat, dLon);

      if (dist > ARRIVE_THRESHOLD) {
        s.coordinate = {
          latitude: s.coordinate.latitude + dLat * STEP_FRACTION,
          longitude: s.coordinate.longitude + dLon * STEP_FRACTION,
        };
        s.heading = (Math.atan2(dLon, dLat) * 180) / Math.PI;
      } else {
        // arrived: idle jitter around the target
        s.coordinate = {
          latitude: s.target.latitude + (pseudoRandom(id + 'a') - 0.5) * JITTER,
          longitude: s.target.longitude + (pseudoRandom(id + 'b') - 0.5) * JITTER,
        };
      }
    }
    this.emit();
  }

  private snapshot(): PingsMap {
    const now = new Date().toISOString();
    const pings: PingsMap = {};
    for (const id of Object.keys(this.state)) {
      const s = this.state[id];
      const coordinate = this.overrides[id] ?? s.coordinate;
      pings[id] = { memberId: id, coordinate, heading: s.heading, updatedAt: now };
    }
    return pings;
  }

  private emit(): void {
    const snap = this.snapshot();
    this.subscribers.forEach((cb) => cb(snap));
  }
}

/**
 * Deterministic pseudo-random in [0,1) from a string seed — avoids Math.random
 * so ticks are reproducible per member/key.
 */
function pseudoRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // vary a little each tick using a rotating counter baked into the seed length
  return ((h >>> 0) % 1000) / 1000;
}

export const locationSim = new LocationSim();
