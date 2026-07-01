/** Domain models for the VVS field-service app. */

export type Role = 'owner' | 'employee';

export type JobStatus = 'assigned' | 'in_progress' | 'done';

export type Priority = 'low' | 'normal' | 'high';

export type JobType =
  | 'Utæt vandhane'
  | 'Fjernvarme service'
  | 'Toilet reparation'
  | 'Vandvarmer udskiftning'
  | 'Radiator montering'
  | 'Afløb tilstoppet'
  | 'Gaskedel eftersyn'
  | 'Badeværelse renovering';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  phone: string; // "+45 20 12 34 56"
  title: string; // "VVS-montør", "Ejer"
  avatarColor: string;
  homeBase: Coordinate; // starting point for the location simulation
}

export interface Job {
  id: string;
  crmId: string; // origin id from the CRM
  title: string; // short summary, e.g. "Utæt vandhane"
  description: string;
  jobType: JobType;
  status: JobStatus;
  customerName: string;
  address: string;
  location: Coordinate;
  assignedToId: string | null; // TeamMember.id or null (unassigned)
  scheduledFor: string; // ISO datetime
  priority: Priority;
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
}

export type ThreadType = 'team' | 'direct';

export interface ChatThread {
  id: string;
  type: ThreadType;
  title: string; // "Hele holdet" or the member's name
  memberIds: string[];
  lastMessagePreview?: string;
  lastMessageAt?: string;
}

export type MessageKind = 'text' | 'brief';

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string;
  kind: MessageKind;
}

export interface LocationPing {
  memberId: string;
  coordinate: Coordinate;
  heading: number; // degrees, for marker rotation
  updatedAt: string;
}

export interface MorningBrief {
  id: string;
  authorId: string; // owner
  date: string; // ISO date
  message: string;
  sentToTeam: boolean;
  recipientIds: string[]; // each employee gets a direct copy
  createdAt: string;
}
