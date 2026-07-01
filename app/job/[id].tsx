import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ListSection, ListRow, Cell } from '@/components/ui/List';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { colors, spacing, type } from '@/theme/theme';
import { formatSchedule } from '@/utils/format';
import type { JobStatus } from '@/types/models';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { jobs, employees, memberById, assignJob, updateJobStatus } = useData();
  const { role, currentUser } = useSession();
  const navigation = useNavigation();
  const [picking, setPicking] = React.useState(false);

  const job = jobs.find((j) => j.id === id);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: job?.title ?? 'Opgave' });
  }, [navigation, job?.title]);

  if (!job) {
    return (
      <View style={styles.center}>
        <Text style={[type.body, { color: colors.secondaryLabel }]}>Opgaven blev ikke fundet.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxl }}>
      {/* Summary */}
      <ListSection>
        <Cell>
          <View style={styles.summary}>
            <Text style={[type.title3, styles.title]}>{job.title}</Text>
            <View style={styles.badges}>
              <StatusBadge status={job.status} />
              <PriorityBadge priority={job.priority} />
            </View>
            <Text style={[type.subhead, styles.desc]}>{job.description}</Text>
          </View>
        </Cell>
      </ListSection>

      {/* Details */}
      <ListSection header="Detaljer">
        <ListRow title="Kunde" value={job.customerName} accessory="none" />
        <Cell onPress={openMaps}>
          <View style={{ flex: 1 }}>
            <Text style={type.body}>Adresse</Text>
            <Text style={[type.footnote, styles.sub]}>{job.address}</Text>
          </View>
          <Text style={[type.body, styles.link]}>Kort</Text>
          <Ionicons name="chevron-forward" size={17} color={colors.tertiaryLabel} style={styles.chev} />
        </Cell>
        <ListRow title="Planlagt" value={formatSchedule(job.scheduledFor)} accessory="none" />
        <ListRow title="Estimat" value={`${job.estimatedHours} ${job.estimatedHours === 1 ? 'time' : 'timer'}`} accessory="none" />
        <ListRow title="CRM-id" value={job.crmId} accessory="none" />
      </ListSection>

      {/* Assignment */}
      <ListSection header="Tildelt til" separatorInset={60}>
        {assignee ? (
          <ListRow
            leading={<Avatar name={assignee.name} color={assignee.avatarColor} size={38} />}
            title={assignee.name}
            subtitle={assignee.title}
            accessory="none"
          />
        ) : (
          <ListRow title="Ikke tildelt" tint={false} accessory="none" />
        )}
        {isOwner ? (
          <ListRow
            title={assignee ? 'Skift medarbejder' : 'Tildel medarbejder'}
            tint
            onPress={() => setPicking((p) => !p)}
            accessory="none"
            rightNode={
              <Ionicons name={picking ? 'chevron-up' : 'chevron-down'} size={17} color={colors.primary} />
            }
          />
        ) : null}
        {isOwner && picking
          ? [
              ...employees.map((m) => (
                <ListRow
                  key={m.id}
                  leading={<Avatar name={m.name} color={m.avatarColor} size={32} />}
                  title={m.name}
                  onPress={() => {
                    assignJob(job.id, m.id);
                    setPicking(false);
                  }}
                  accessory="none"
                  rightNode={
                    job.assignedToId === m.id ? (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    ) : undefined
                  }
                />
              )),
              assignee ? (
                <ListRow
                  key="remove"
                  title="Fjern tildeling"
                  destructive
                  onPress={() => {
                    assignJob(job.id, null);
                    setPicking(false);
                  }}
                  accessory="none"
                />
              ) : null,
            ]
          : null}
      </ListSection>

      {/* Status actions */}
      <View style={styles.actions}>
        {isOwner || isMine ? (
          <>
            {job.status === 'assigned' ? (
              <Button title="Start opgave" icon="play" onPress={() => setStatus('in_progress')} />
            ) : null}
            {job.status === 'in_progress' ? (
              <Button title="Marker som færdig" icon="checkmark-done" variant="success" onPress={() => setStatus('done')} />
            ) : null}
            {job.status === 'done' ? (
              <>
                <View style={styles.doneBanner}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.green} />
                  <Text style={[type.subhead, styles.doneText]}>Opgaven er færdig</Text>
                </View>
                <Button title="Genåbn opgave" variant="gray" icon="refresh" onPress={() => setStatus('in_progress')} />
              </>
            ) : null}
          </>
        ) : (
          <Text style={[type.footnote, styles.hint]}>Kun den tildelte medarbejder kan opdatere status.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.groupedBackground },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.groupedBackground },
  summary: { flex: 1, gap: spacing.sm, paddingVertical: 2 },
  title: { color: colors.label },
  badges: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  desc: { color: colors.secondaryLabel },
  sub: { color: colors.secondaryLabel, marginTop: 1 },
  link: { color: colors.primary },
  chev: { marginLeft: 6, marginRight: -4 },
  actions: { paddingHorizontal: spacing.lg, gap: spacing.sm, marginTop: spacing.sm },
  doneBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  doneText: { color: colors.green, fontWeight: '500' },
  hint: { color: colors.secondaryLabel, textAlign: 'center' },
});
