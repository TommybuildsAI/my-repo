import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Constants from 'expo-constants';
import { useData } from '@/context/DataContext';
import { useLocations } from '@/context/LocationContext';
import { MapFallback } from '@/components/MapFallback';
import { colors, radius, type } from '@/theme/theme';

interface Props {
  focusMemberId?: string; // if set, only show this member + their jobs
}

const AARHUS_REGION = {
  latitude: 56.1567,
  longitude: 10.2108,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

/**
 * Whether the interactive map can render. iOS uses Apple Maps (always works);
 * Expo Go on Android ships its own key (appOwnership === 'expo'); a standalone
 * Android APK only works if a Google Maps key was configured at build time.
 */
function canRenderMap(): boolean {
  if (Platform.OS !== 'android') return true;
  if (Constants.appOwnership === 'expo') return true; // Expo Go
  return Boolean(Constants.expoConfig?.extra?.mapsKeyConfigured);
}

export function TeamMap({ focusMemberId }: Props) {
  const { members, jobs, memberById } = useData();
  const { pings } = useLocations();

  const shownMembers = focusMemberId
    ? members.filter((m) => m.id === focusMemberId)
    : members;

  const shownJobs = focusMemberId
    ? jobs.filter((j) => j.assignedToId === focusMemberId && j.status !== 'done')
    : jobs.filter((j) => j.status !== 'done');

  if (!canRenderMap()) {
    return <MapFallback members={shownMembers} jobs={shownJobs} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={AARHUS_REGION}
        showsUserLocation={false}
      >
        {/* Job site pins */}
        {shownJobs.map((job) => (
          <Marker
            key={job.id}
            coordinate={job.location}
            title={job.title}
            description={`${job.customerName} · ${job.address}`}
            pinColor={job.status === 'in_progress' ? colors.orange : colors.primary}
          />
        ))}

        {/* Live team member markers */}
        {shownMembers.map((member) => {
          const ping = pings[member.id];
          if (!ping) return null;
          return (
            <Marker
              key={member.id}
              coordinate={ping.coordinate}
              title={member.name}
              description={member.title}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.memberMarker, { backgroundColor: member.avatarColor }]}>
                <Text style={styles.memberInitials}>
                  {member.name
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {Platform.OS === 'web' && (
        <View style={styles.webNote}>
          <Text style={styles.webNoteText}>Kortet vises bedst i Expo Go på iPhone.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray5 },
  memberMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  memberInitials: { color: colors.white, fontSize: 12, fontWeight: '700' },
  webNote: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  webNoteText: { ...type.footnote, color: colors.secondaryLabel },
});
