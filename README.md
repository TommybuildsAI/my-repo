# VVS Hold — MVP

En mobil-app (iOS) til et dansk VVS-firma til at koordinere holdet, følge medarbejdere live på kort, styre opgaver fra CRM, chatte og sende morgenbrief.

Built with **Expo (React Native + TypeScript)** and **Expo Router**. This MVP runs on **mock/local data** (no backend) so you can demo every flow in **Expo Go**.

## Features

| Feature | Where |
|---|---|
| **To roller** – ejer & medarbejder (vælg profil ved login) | `app/index.tsx` |
| **Team-koordination** – ejer ser hele holdet med status | `app/(owner)/team.tsx` |
| **Live location tracking** – kort med medarbejdere der bevæger sig i realtid | `app/(owner)/map.tsx`, `app/(employee)/map.tsx`, `src/components/TeamMap.tsx` |
| **Opgaver fra CRM** – seedede danske VVS-opgaver bag en swap-bar service | `src/services/crmService.ts` |
| **Delegering** – ejer tildeler opgaver til medarbejdere | `app/job/[id].tsx` |
| **Job-status** – medarbejder starter og markerer opgave færdig | `app/job/[id].tsx` |
| **Team-chat** – fælleschat + 1-til-1 samtaler | `app/chat/[threadId].tsx` |
| **Morgenbrief** – sendes til fælleschat **og** til hver medarbejder personligt | `app/(owner)/brief.tsx` |

## Kør appen (iPhone eller Android med Expo Go)

Kør udviklingsserveren på din **computer** (ikke på telefonen):

```bash
npm install
npx expo start        # tilføj --tunnel hvis telefon og computer er på forskellige netværk / wifi
```

- **iPhone:** scan QR-koden med kameraet, eller med **Expo Go**.
- **Android:** åbn **Expo Go** → serveren dukker op under *Development servers* (tryk på den), eller tryk **Scan QR code** og scan koden i terminalen. Alternativt skriv `a` i terminalen for at åbne på en tilsluttet Android-enhed/emulator.

> Telefon og computer skal være på **samme wifi**. Er de ikke det (fx mobildata), så kør `npx expo start --tunnel`.

Andre scripts:

```bash
npm run typecheck     # tsc --noEmit
npx expo-doctor       # tjek projektopsætning
```

## Demo-flow

1. **Log ind som ejer** (Henrik Jensen) → 5 faner: Hold, Kort, Opgaver, Chat, Brief.
2. **Opgaver** → vælg "Ikke tildelt" → åbn en opgave → **Tildel medarbejder**.
3. **Brief** → skriv en besked, vælg modtagere → **Send morgenbrief**. Beskeden lander i fælleschatten *og* hos hver valgt medarbejder.
4. **Kort** → medarbejder-markører bevæger sig hvert ~2. sekund mod deres opgaver.
5. **Log ud** (ikon øverst til højre) → **log ind som medarbejder** → **Mine opgaver** → åbn opgaven → **Start** → **Marker som færdig**. Status opdateres og gemmes (AsyncStorage) også efter genstart.

## Arkitektur

```
app/                    Expo Router routes (filbaseret)
  _layout.tsx           Providers + rolle-baseret routing
  index.tsx             Login / profilvælger
  (owner)/              Ejer-faner
  (employee)/           Medarbejder-faner
  job/[id].tsx          Opgave-detalje (status + tildeling)
  chat/[threadId].tsx   Chat-tråd
src/
  types/models.ts       Domænemodeller
  services/
    crmService.ts       CRM-grænseflade (mock nu, HTTP senere)
    storage.ts          AsyncStorage-hjælpere
    locationSim.ts      Simuleret realtids-lokation
  context/              Session / Data / Chat / Location providers
  data/seed.ts          Danske VVS-testdata (Aarhus)
  components/           Genbrugelige UI-komponenter
  theme/theme.ts        iOS-agtige design-tokens
```

### Data & state
Fire React Context-providers (`Session → Data → Chat → Location`). Al state gemmes i AsyncStorage, så ændringer overlever genstart. Første opstart seeder data via `crmService` + `src/data/seed.ts`.

### CRM-grænseflade
Appen importerer kun `crmService`. Skift fra mock til en rigtig API er en enkelt linje i `src/services/crmService.ts` — ingen kaldere skal ændres. CRM er kilde til hvilke opgaver der *findes*; status/tildeling ejes af appen (som i en rigtig integration).

### Live location
`src/services/locationSim.ts` flytter hver medarbejder lidt mod deres aktive opgave hvert ~2. sekund (ren JS, virker i Expo Go). Den aktuelle bruger kan bruge rigtig GPS via `expo-location`; resten er simuleret.

## Platforme
Appen kører på **både iOS og Android** i Expo Go fra samme kodebase. Kortet bruger Apple Maps på iOS og Google Maps på Android — begge virker i Expo Go uden API-nøgle. (En selvstændig Android-build kræver senere din egen Google Maps API-nøgle i `app.json`.)

## Bemærk
Dette er en MVP med lokale mock-data. Næste skridt mod produktion: rigtig backend (auth, realtids-chat, live GPS-deling) og CRM-integration bag den eksisterende `crmService`-grænseflade.
