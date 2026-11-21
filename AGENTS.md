# TraceHen frontend — house rules

- **Pure React Native CLI, zero Expo.** No `expo-*` package, no Expo import,
  no `app.json`. If a guide tells you to run `npx expo`, it does not apply
  here.
- **React Navigation, typed.** Every route name lives in
  `src/navigation/types.ts` (`RootStackParamList`). Never navigate by a path
  string; never add a route without adding it to `RootStackParamList` AND to
  `src/navigation/RootNavigator.tsx` AND making it reachable from a screen,
  a BottomNav tab or the login flow.
- **Routes live in `src/screens/` (never `src/app/`).** One file per route.
- **`bundleInDebug = true` must stay** in `android/app/build.gradle`
  (`react {}` block). It is what lets the app run from Android Studio's Run
  button with no Metro server. If `android/` is ever regenerated, re-apply
  it before anything else.
- **CAMERA permission** stays in `android/app/src/main/AndroidManifest.xml`
  (vision-camera, Scan screen). minSdk is 26 — do not lower it.
- **No `any`, no dead code, no dead buttons.** Run `npm run lint` and
  `npm run tsc` before declaring anything done; both must pass with zero
  errors.
- **English only** in code, comments and UI.
- **Mock boundary:** demo data lives in `src/data/demoData.ts`; the single
  data layer is the store in `src/services/store.tsx` (AppStore / useApp).
  Screens never touch Keychain/AsyncStorage directly — only
  `src/services/storage.ts` does. (`src/services/mockApi.ts` was deleted:
  dead code, superseded by the store.)
- **Chain rules (do not reintroduce):** chicken meat only — no eggs, no
  hatchery, no breeder, no halal attestation. Chain starts at the farm with
  chicks. Blockchain = entries only, never a gate or a block.
