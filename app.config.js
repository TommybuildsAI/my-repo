/**
 * Dynamic Expo config. Layers an optional Google Maps API key (for standalone
 * Android APK builds) on top of the static app.json. Expo passes the parsed
 * app.json in as `config`, so everything there is preserved.
 *
 * Set the key when building an APK that should show the Android map:
 *   GOOGLE_MAPS_API_KEY=xxxx eas build -p android --profile preview
 * Without it, the app still builds and the map tab shows a graceful fallback.
 */
module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

  return {
    ...config,
    android: {
      ...config.android,
      ...(googleMapsApiKey
        ? { config: { googleMaps: { apiKey: googleMapsApiKey } } }
        : {}),
    },
    extra: {
      ...config.extra,
      // The map component uses this to decide whether to render a real Android map.
      mapsKeyConfigured: Boolean(googleMapsApiKey),
      eas: {
        ...(config.extra && config.extra.eas ? config.extra.eas : {}),
      },
    },
  };
};
