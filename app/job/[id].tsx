import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, StatusBadge } from '@/components/StatusBadge';
import { colors, radius, spacing } from '@/theme/theme';
import { formatSchedule } from '@/utils/format';
import type { JobStatus } from '@/types/models';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { jobs, employees, memberById, assignJob, updateJobStatus } = useData();
  const { role, currentUser } = useSession();
  const navigation = useNavigation();
  const router = useRouter();
  const [picking, setPicking] = React.useState(false);

  const job = jobs.find((j) => j.id === id);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: job?.title ?? 'Opgave' });
  }, [navigation, job?.title]);

  if (!job) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Opgaven blev ikke fundet.</Text>
      </View>
    );
  }

  const assignee = memberById(job.assignedToId);
  const isOwner = role === 'owner';
  const isMine = job.assignedToId === currentUser?.id;

  const setStatus = (status: JobStatus) => updateJobStatus(job.id, status);

  const openMaps = () => {
    const q = encodeURIComponent(job.address);
    Linking.openURL(`http://maps.apple.com/?q=${q}`).catch(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{job.title}</Text>
          <PriorityBadge priority={job.priority} />
        </View>
        <StatusBadge status={job.status} />
        <Text style={styles.description}>{job.description}</Text>
      </View>

      {/* Customer & location */}
      <View style={styles.card}>
        <InfoRow icon="person-outline" label="Kunde" value={job.customerName} />
        <Divider />
        <Pressable onPress={openMaps}>
          <InfoRow icon="location-outline" label="Adresse" value={job.address} action="Vis kort" />
        </Pressable>
        <Divider />
        <InfoRow icon="time-outline" label="Planlagt" value={formatSchedule(job.scheduledFor)} />
        <Divider />
        <InfoRow icon="hourglass-outline" label="Estimat" value={`${job.estimatedHours} timer`} />
        <Divider />
        <InfoRow icon="pricetag-outline" label="CRM- id" value={job.crmId} />
      </View>

      {/* Assignment */}
      <Text style={styles.sectionLabel}>TILDELT TIL</Text>
      <View style={styles.card}>
        {assignee ? (
          <View style={styles.assigneeRow}>
            <Avatar name={assignee.name} color={assignee.avatarColor} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={styles.assigneeName}>{assignee.name}</Text>
              <Text style={styles.assigneeTitle}>{assignee.title}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.unassigned}>Endnu ikke tildelt</Text>
        )}

        {isOwner && (
          <View style={{ marginTop: spacing.md }}>
            <Button
              title={assignee ? 'Skift medarbejder' : 'Tildel medarbejder'}
              variant="secondary"
              icon="people-outline"
              onPress={() => setPicking((p) => !p)}
            />
            {picking && (
              <View style={styles.picker}>
                {employees.map((m) => (
                  <Pressable
                    key={m.id}
                    style={styles.pickRow}
                    onPress={() => {
                      assignJob(job.id, m.id);
                      setPicking(false);
                    }}
                  >
                    <Avatar name={m.name} color={m.avatarColor} size={32} />
                    <Text style={styles.pickName}>{m.name}</Text>
                    {job.assignedToId === m.id && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </Pressable>
                ))}
                {assignee && (
                  <Pressable
                    style={styles.pickRow}
                    onPress={() => {
                      assignJob(job.id, null);
                      setPicking(false);
                    }}
                  >
                    <Ionicons name="close-circle-outline" size={32} color={colors.danger} />
                    <Text style={[styles.pickName, { color: colors.danger }]}>Fjern tildeling</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Status actions */}
      <Text style={styles.sectionLabel}>STATUS</Text>
      <View style={styles.card}>
        {(isOwner || isMine) ? (
          <View style={{ gap: spacing.sm }}>
            {job.status === 'assigned' && (
              <Button title="Start opgave" icon="play" onPress={() => setStatus('in_progress')} />
            )}
            {job.status === 'in_progress' && (
              <Button
                title="Marker som færdig"
                icon="checkmark-done"
                variant="success"
                onPress={() => setStatus('done')}
              />
            )}
            {job.status === 'done' && (
              <View style={styles.doneBanner}>
                <Ionicons name="checkmark-circle" size={22} color={colors.statusDone} />
                <Text style={styles.doneText}>Opgaven er markeret færdig</Text>
              </View>
            )}
            {job.status === 'done' && (
              <Button
                title="Genåbn opgave"
                variant="secondary"
                icon="refresh"
                onPress={() => setStatus('in_progress')}
              />
            )}
          </View>
        ) : (
          <Text style={styles.unassigned}>Kun den tildelte medarbejder kan opdatere status.</Text>
        )}
      </View>

      <Pressable style={styles.mapLink} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color={colors.primary} />
        <Text style={styles.mapLinkText}>Tilbage</Text>
      </Pressable>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  action,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  action?: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.textTertiary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
      {action && <Text style={styles.infoAction}>{action}</Text>}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { color: colors.textSecondary, fontSize: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.sm },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 21 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  infoLabel: { fontSize: 15, color: colors.textSecondary, width: 78 },
  infoValue: { fontSize: 15, color: colors.text, flex: 1, fontWeight: '500' },
  infoAction: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginLeft: 26 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  assigneeName: { fontSize: 17, fontWeight: '600', color: colors.text },
  assigneeTitle: { fontSize: 14, color: colors.textSecondary },
  unassigned: { fontSize: 15, color: colors.textTertiary },
  picker: { marginTop: spacing.sm, gap: 2 },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  pickName: { flex: 1, fontSize: 16, color: colors.text },
  doneBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  doneText: { fontSize: 16, color: colors.statusDone, fontWeight: '500' },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: spacing.sm,
  },
  mapLinkText: { fontSize: 16, color: colors.primary },
});
