# TraceHen

Blockchain-based chicken meat traceability system (Final Year Project, University of Agriculture Faisalabad). A consumer scans a pack's QR code and sees the farm, the vet check, and the full journey behind the chicken. Chicken meat only; the chain starts at the farm with chicks.

Working name: **TraceHen** (final name not decided yet — lock it before the first Play Store upload, because the Android package name `pk.edu.uaf.tracehen` is set at that upload and can never change after it).

## Stack

- Pure React Native CLI (no Expo) + TypeScript
- React Navigation v7 (typed routes)
- react-native-vision-camera (QR scan), react-native-svg, lucide-react-native (icons)
- react-native-pdf + react-native-blob-util (PDF documents)
- react-native-image-picker + react-native-document-picker (file uploads)
- react-native-keychain, @react-native-async-storage/async-storage (real app; the demo is session-only)
- Jest (tests)

## Run

Prerequisites: Node 20+, Android Studio (Android SDK + emulator), Java 17.

```bash
npm install
```

Android (first run on a laptop with Android Studio):

```bash
npx react-native run-android
```

Or open `android/` in Android Studio and press Run. `bundleInDebug = true` is set in `android/app/build.gradle`, so the app runs from Android Studio's Run button with no Metro server.

iOS: `cd ios && pod install && cd .. && npx react-native run-ios` (not the FYP target; Android is).

## Demo accounts

Password for all demo accounts: `demo1234`

| Username | Role |
| --- | --- |
| Demo Admin | Admin |
| Haji Tariq | Farm |
| Dr. Usman | Vet |
| Kashif | Slaughterhouse |
| Zubair | Shop |
| Salman | Mart |
| Ayesha | Consumer (ayesha.khan@gmail.com) |

## Modules

7 roles. Each role signs in and sees only its own screens.

- **Admin** — one pre-created Super Admin (no sign-up). Dashboard, Review Applications, Organizations & Sites. Approves / requests more info / rejects applications; suspends organizations.
- **Farm** — registers batches (chicks placed, DOA, deaths), adds events, requests a vet visit, creates dispatches (vehicle, driver, company). Transport is farm-entered; there is no Transporter role.
- **Vet** — inspections (Fit / On Hold / Not Fit, On Hold needs a recheck date), certificates. Physical inspection + withdrawal check only; no lab test in v1.
- **Slaughterhouse** — receives dispatches, ante-/post-mortem checks (recorded by the plant's meat inspector), QC Hold, creates packs, dispatches packs to Mart.
- **Shop** — receives live birds from the farm (count + DOA only, no inspection), cages, sales, removals.
- **Mart** — receives pack shipments, stock, pack withdraw (mandatory reason). Sells direct to consumer.
- **Consumer** — sign-in required (no guest scan). Scan page only: scan a pack QR with the camera, or type the code, to see the pack's history. No dashboard, no Scan History.

## Notes

- **Demo is session-only.** All demo data lives in memory; a reload resets to the demo accounts/data. No localStorage, no backend, no database yet. The real app will persist data via a backend.
- **Entries only.** The backend/blockchain only saves entries. Vet status, withdrawal, QC Hold, and similar are recorded statuses, never a gate or block.
- **No eggs, no hatchery, no breeder, no halal attestation in v1.** Chain starts at the farm with chicks.
- **First real Android build/run is on the developer's laptop in Android Studio.** The Gradle build was not verified on the build machine (no Android SDK there). The JS bundle, TypeScript, and lint were verified.
- The camera QR scan uses the real camera (vision-camera). The HTML demo simulated the scan; this app decodes a real QR code.

## Project structure

One component/screen per file. Shared styles live in one place (`src/theme/`). Business logic lives in the store (`src/services/store.tsx`); screens only render and call store actions. Demo data lives in `src/data/demoData.ts`.

```
android/                 Android native project (package pk.edu.uaf.tracehen)
ios/                     iOS native project (not the FYP target)
assets/
  images/                Poultry photos, onboarding images, map image
  documents/             Bundled license PDFs (seed data)
src/
  theme/                 colors.ts (light + dark tokens) · typography.ts (Manrope)
                         spacing.ts · assets.ts (image/PDF require map)
  types/                 models.ts (all data types)
  data/                  demoData.ts (ALL seed data, one dataset) · roles.ts
  services/              store.tsx (AppStore: auth, approval, per-user scope,
                         notifications, forgot password, remembered logins,
                         theme, toast, chain actions) · storage.ts (the only
                         place that touches Keychain/AsyncStorage) · qr.ts
  hooks/                 useAuth.ts · useTheme.ts · useToast.ts (thin wrappers)
  components/            One file per component (Icon, AppButton, AppHeader,
                         BottomNav, StatCard, ListCard, RowItem, Pill, ChipRow,
                         FormField, FilePicker, MapPicker, DocViewer, QRCode,
                         StatusBanner, Timeline, Journey, Recon,
                         EmptyState, Toast, Modal, SegmentedControl,
                         DecisionGrid, Switch, ScreenLayout)
  navigation/            types.ts (RootStackParamList — every route, typed)
                         RootNavigator.tsx (registers every route)
  screens/
    entry/               Splash, Onboarding, Landing, SignIn, SignUp, Pending,
                         ForgotPassword, MapPickerScreen
    admin/               Dashboard, Applications, ApplicationDetail, Batches,
                         BatchDetail, Organizations, OrganizationDetail,
                         Document, Notifications, Settings, Profile,
                         ChangePassword
    farm/                Home, Batches, BatchDetail, NewBatch, NewEvent,
                         NewVet, Dispatch, NewDispatch, DispatchDetail,
                         Document, Map, Notifications, Settings, Profile,
                         ChangePassword
    vet/                 Home, Inspections, InspectionDetail, Certificates,
                         CertificateDetail, Document, Notifications, Settings,
                         Profile, ChangePassword
    plant/               Home, Lots, LotDetail, Receipt, Slaughter, QC,
                         CreatePacks, Packs, PackDetail, Dispatch, Document,
                         Map, Notifications, Settings, Profile, ChangePassword
    shop/                Home, Deliveries, DeliveryDetail, Receipt, Stock,
                         CageDetail, Sale, Removal, Document, Map,
                         Notifications, Settings, Profile, ChangePassword
    mart/                Home, Shipments, ShipmentDetail, Receipt, Stock,
                         PackDetail, Withdraw, Document, Map, Notifications,
                         Settings, Profile, ChangePassword
    consumer/            Scan, Notifications, Settings, Profile, ChangePassword
  utils/                 format.ts · validation.ts · counts.ts
__tests__/               Jest tests
```

### Where to change something

- **A color, font size, spacing, or radius** — `src/theme/colors.ts`, `typography.ts`, or `spacing.ts`. Never hard-code a value in a screen.
- **A label, placeholder, or button text** — the screen file in `src/screens/<module>/` or `src/screens/entry/`.
- **A repeated UI piece (button, card, input, header)** — the component in `src/components/`; change it once, it updates everywhere.
- **A demo value (a batch, a lot, a pack, a demo account)** — `src/data/demoData.ts`.
- **A data shape (a field on a batch, lot, pack, application)** — `src/types/models.ts` (+ `src/data/demoData.ts`).
- **Auth, approval, notifications, forgot password, or a chain flow** — `src/services/store.tsx`.
- **A route** — add it to `src/navigation/types.ts` (RootStackParamList) AND `src/navigation/RootNavigator.tsx`, and make it reachable from a screen or BottomNav tab.
- **An icon** — `src/components/Icon.tsx` (Lucide names; the custom chicken + map-pin are SVG paths there).
- **An image or PDF** — add the file to `assets/images/` or `assets/documents/` and map it in `src/theme/assets.ts`.

## Verify

```bash
npx tsc --noEmit
npm run lint
npm test
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/test.bundle
```

All four must pass with zero errors before a delivery.
