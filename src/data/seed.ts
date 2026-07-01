import { colors } from '@/theme/theme';
import type {
  ChatMessage,
  ChatThread,
  Job,
  MorningBrief,
  TeamMember,
} from '@/types/models';

/**
 * Seed data for the VVS company "Aarhus VVS & Varme". All coordinates are
 * clustered around central Aarhus so the live map reads well. Timestamps are
 * generated relative to "now" when the seed is first built, so the demo always
 * looks current.
 */

// Aarhus city centre
const AARHUS = { latitude: 56.1567, longitude: 10.2108 };

function offset(latM: number, lonM: number) {
  // ~metres to degrees at Aarhus latitude
  return {
    latitude: AARHUS.latitude + latM / 111_320,
    longitude: AARHUS.longitude + lonM / (111_320 * Math.cos((AARHUS.latitude * Math.PI) / 180)),
  };
}

export const OWNER_ID = 'm_henrik';

export function seedMembers(): TeamMember[] {
  return [
    {
      id: OWNER_ID,
      name: 'Henrik Jensen',
      role: 'owner',
      phone: '+45 20 11 22 33',
      title: 'Ejer',
      avatarColor: colors.primary,
      homeBase: offset(-400, -300), // the office
    },
    {
      id: 'm_lars',
      name: 'Lars Mikkelsen',
      role: 'employee',
      phone: '+45 21 44 55 66',
      title: 'VVS-montør',
      avatarColor: '#FF9F0A',
      homeBase: offset(600, 900),
    },
    {
      id: 'm_mette',
      name: 'Mette Nielsen',
      role: 'employee',
      phone: '+45 22 77 88 99',
      title: 'VVS-montør',
      avatarColor: '#34C759',
      homeBase: offset(-900, 1200),
    },
    {
      id: 'm_anders',
      name: 'Anders Poulsen',
      role: 'employee',
      phone: '+45 23 12 34 56',
      title: 'VVS-montør',
      avatarColor: '#FF375F',
      homeBase: offset(1400, -700),
    },
    {
      id: 'm_sofie',
      name: 'Sofie Kristensen',
      role: 'employee',
      phone: '+45 24 65 43 21',
      title: 'VVS-lærling',
      avatarColor: '#5E5CE6',
      homeBase: offset(-1300, -1100),
    },
  ];
}

function iso(offsetMinutes: number): string {
  return new Date(Date.now() + offsetMinutes * 60_000).toISOString();
}

/** Today at a given hour:minute, as ISO. */
function todayAt(hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function seedJobs(): Job[] {
  const base = (n: number): Pick<Job, 'createdAt' | 'updatedAt'> => ({
    createdAt: iso(-n * 60),
    updatedAt: iso(-n * 30),
  });

  return [
    {
      id: 'j_1001',
      crmId: 'CRM-1001',
      title: 'Utæt vandhane',
      description: 'Dryppende blandingsbatteri i køkkenet. Kunden ønsker udskiftning.',
      jobType: 'Utæt vandhane',
      status: 'assigned',
      customerName: 'Familie Sørensen',
      address: 'Vestergade 12, 8000 Aarhus C',
      location: offset(300, 500),
      assignedToId: 'm_lars',
      scheduledFor: todayAt(8, 30),
      priority: 'normal',
      estimatedHours: 1,
      ...base(12),
    },
    {
      id: 'j_1002',
      crmId: 'CRM-1002',
      title: 'Fjernvarme service',
      description: 'Årligt eftersyn af fjernvarmeunit. Tjek veksler og filtre.',
      jobType: 'Fjernvarme service',
      status: 'in_progress',
      customerName: 'Bente Holm',
      address: 'Skovvej 45, 8240 Risskov',
      location: offset(1800, 2100),
      assignedToId: 'm_mette',
      scheduledFor: todayAt(9, 0),
      priority: 'high',
      estimatedHours: 2,
      ...base(20),
    },
    {
      id: 'j_1003',
      crmId: 'CRM-1003',
      title: 'Toilet reparation',
      description: 'Løbende toilet, cisterne skal justeres eller udskiftes.',
      jobType: 'Toilet reparation',
      status: 'assigned',
      customerName: 'Café Nord ApS',
      address: 'Mejlgade 30, 8000 Aarhus C',
      location: offset(-200, 700),
      assignedToId: 'm_anders',
      scheduledFor: todayAt(10, 15),
      priority: 'normal',
      estimatedHours: 1,
      ...base(8),
    },
    {
      id: 'j_1004',
      crmId: 'CRM-1004',
      title: 'Vandvarmer udskiftning',
      description: 'Gammel varmtvandsbeholder utæt. Udskiftes med 110L model.',
      jobType: 'Vandvarmer udskiftning',
      status: 'assigned',
      customerName: 'Jørgen Dahl',
      address: 'Grønnegade 8, 8000 Aarhus C',
      location: offset(-600, 200),
      assignedToId: 'm_lars',
      scheduledFor: todayAt(13, 0),
      priority: 'high',
      estimatedHours: 3,
      ...base(30),
    },
    {
      id: 'j_1005',
      crmId: 'CRM-1005',
      title: 'Radiator montering',
      description: 'Montering af 2 nye radiatorer i tilbygning.',
      jobType: 'Radiator montering',
      status: 'done',
      customerName: 'Familie Andersen',
      address: 'Lundingsgade 5, 8000 Aarhus C',
      location: offset(-800, -400),
      assignedToId: 'm_mette',
      scheduledFor: todayAt(7, 30),
      priority: 'normal',
      estimatedHours: 2,
      ...base(60),
    },
    {
      id: 'j_1006',
      crmId: 'CRM-1006',
      title: 'Afløb tilstoppet',
      description: 'Tilstoppet afløb i badeværelse. Kraftig lugt.',
      jobType: 'Afløb tilstoppet',
      status: 'assigned',
      customerName: 'Restaurant Havnen',
      address: 'Europaplads 2, 8000 Aarhus C',
      location: offset(100, 1400),
      assignedToId: null,
      scheduledFor: todayAt(11, 0),
      priority: 'high',
      estimatedHours: 1,
      ...base(3),
    },
    {
      id: 'j_1007',
      crmId: 'CRM-1007',
      title: 'Gaskedel eftersyn',
      description: 'Lovpligtigt eftersyn af gaskedel, samt rensning.',
      jobType: 'Gaskedel eftersyn',
      status: 'assigned',
      customerName: 'Ejendom Trøjborg A/S',
      address: 'Tordenskjoldsgade 21, 8200 Aarhus N',
      location: offset(2200, 300),
      assignedToId: 'm_anders',
      scheduledFor: todayAt(14, 30),
      priority: 'normal',
      estimatedHours: 2,
      ...base(5),
    },
    {
      id: 'j_1008',
      crmId: 'CRM-1008',
      title: 'Badeværelse renovering',
      description: 'Opstart af VVS-arbejde til badeværelsesrenovering. Nedtagning.',
      jobType: 'Badeværelse renovering',
      status: 'assigned',
      customerName: 'Familie Kjær',
      address: 'Silkeborgvej 120, 8230 Åbyhøj',
      location: offset(-1600, -2400),
      assignedToId: 'm_sofie',
      scheduledFor: todayAt(9, 30),
      priority: 'normal',
      estimatedHours: 4,
      ...base(15),
    },
    {
      id: 'j_1009',
      crmId: 'CRM-1009',
      title: 'Utæt vandhane',
      description: 'Udendørs vandhane fryser/drypper. Udskiftes med frostsikker.',
      jobType: 'Utæt vandhane',
      status: 'assigned',
      customerName: 'Peter Vestergaard',
      address: 'Strandvejen 88, 8000 Aarhus C',
      location: offset(500, 2600),
      assignedToId: null,
      scheduledFor: todayAt(15, 0),
      priority: 'low',
      estimatedHours: 1,
      ...base(2),
    },
    {
      id: 'j_1010',
      crmId: 'CRM-1010',
      title: 'Radiator montering',
      description: 'Udskiftning af termostatventiler på 5 radiatorer.',
      jobType: 'Radiator montering',
      status: 'assigned',
      customerName: 'Boligforening Møllevang',
      address: 'Fuglebakkevej 15, 8210 Aarhus V',
      location: offset(-2100, 600),
      assignedToId: 'm_sofie',
      scheduledFor: todayAt(13, 30),
      priority: 'normal',
      estimatedHours: 2,
      ...base(4),
    },
  ];
}

const TEAM_THREAD_ID = 't_team';

export function seedThreads(members: TeamMember[]): ChatThread[] {
  const team: ChatThread = {
    id: TEAM_THREAD_ID,
    type: 'team',
    title: 'Hele holdet',
    memberIds: members.map((m) => m.id),
    lastMessagePreview: 'God morgen alle sammen! 👷',
    lastMessageAt: todayAt(6, 45),
  };

  const directs: ChatThread[] = members
    .filter((m) => m.role === 'employee')
    .map((m) => ({
      id: directThreadId(m.id),
      type: 'direct' as const,
      title: m.name,
      memberIds: [OWNER_ID, m.id],
      lastMessagePreview: undefined,
      lastMessageAt: undefined,
    }));

  return [team, ...directs];
}

/** Deterministic direct-thread id between the owner and an employee. */
export function directThreadId(employeeId: string): string {
  return `t_direct_${employeeId}`;
}

export function seedMessages(): ChatMessage[] {
  return [
    {
      id: 'msg_1',
      threadId: TEAM_THREAD_ID,
      senderId: OWNER_ID,
      text: 'God morgen alle sammen! 👷 Husk sikkerhedssko på Silkeborgvej i dag.',
      createdAt: todayAt(6, 45),
      kind: 'text',
    },
    {
      id: 'msg_2',
      threadId: TEAM_THREAD_ID,
      senderId: 'm_lars',
      text: 'Godmorgen! Jeg er på vej til Vestergade nu.',
      createdAt: todayAt(7, 55),
      kind: 'text',
    },
    {
      id: 'msg_3',
      threadId: TEAM_THREAD_ID,
      senderId: 'm_mette',
      text: 'Fjernvarme-servicen på Skovvej er i gang 🔧',
      createdAt: todayAt(9, 10),
      kind: 'text',
    },
  ];
}

export function seedBriefs(): MorningBrief[] {
  return [];
}
