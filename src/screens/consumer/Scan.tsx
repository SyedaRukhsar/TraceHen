// Consumer Scan — the Scan page (final v51): big scanner viewfinder, Scan Code
// (real camera + real QR detection), typed-code fallback, and the pack history
// rendered INLINE below the scanner on this same screen. Built from
// modules/consumer.html + modules/consumer.js (lookupCode, martPackState,
// renderResult) — labels, texts and logic copied verbatim. No dashboard, no
// cards, no Scan History list, no Scan from Photo, no demo-codes tap list,
// no helper line under the Scan button.
//
// Two drift notes (see the module report for the full account):
// - The "not a guarantee" notice is NOT in consumer.html / consumer.js; it is
//   included here with the exact wording from fyp-consumer-module-decisions.md
//   because the conversion task orders it.
// - consumer.js lookupCode verifies only the PACK-S2-281126 range for a
//   plant-ended pack, but the conversion task (and the spec) name
//   PACK-S2-031226-0123 as the VERIFIED plant-ended demo code, so that range
//   is verified too, from the frozen LOT-S2-031226 facts.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowRight,
  Check,
  CircleHelp,
  ScanLine,
  TriangleAlert,
  X,
} from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import Svg, { Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import { ConsumerBottomNav, ConsumerHeader, PrimaryButton } from './ConsumerChrome';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { darkColors, lightColors } from '../../theme/colors';
import type { ThemeColors } from '../../theme/colors';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerScan'>;

const DEMO_TODAY = '09 Dec 2026';
const DEMO_CODE = 'PACK-S3-051226-0001';

// ---------- Seed data — verbatim from modules/consumer.js ----------
interface LotSeed {
  batch: string;
  farm: string;
  farmPlace: string;
  farmer: string;
  cert: string;
  vet: string;
  plant: string;
  plantCode: string;
  chillTemp: string;
  weight: string;
  dispatchDate?: string;
  vehicle?: string;
  driver?: string;
  mart?: string;
  martPlace?: string;
  martReceived?: string;
  martTime?: string;
  martTemp?: string;
}

const LOT_S3: LotSeed = {
  batch: 'LOT-S3-051226',
  farm: 'Green Valley Farm',
  farmPlace: 'Jaranwala, Faisalabad',
  farmer: 'Muhammad Aslam',
  cert: 'CERT-V3-021226',
  vet: 'Dr. Usman · Vet V3',
  plant: 'Punjab Fresh Abattoir',
  plantCode: 'S2',
  chillTemp: '3.8',
  dispatchDate: '05 Dec 2026',
  vehicle: 'LEB-2210',
  driver: 'Shahid',
  mart: 'Imtiaz Mega Mart',
  martPlace: 'Faisalabad',
  martReceived: '05 Dec 2026',
  martTime: '02:40 PM',
  martTemp: '3.6',
  weight: '1.2',
};

const LOT_S2: LotSeed = {
  batch: 'LOT-S2-281126',
  farm: 'Green Valley Farm',
  farmPlace: 'Jaranwala, Faisalabad',
  farmer: 'Muhammad Aslam',
  cert: 'CERT-V3-261126',
  vet: 'Dr. Usman · Vet V3',
  plant: 'Punjab Fresh Abattoir',
  plantCode: 'S2',
  chillTemp: '3.5',
  weight: '1.2',
};

// Frozen LOT-S2-031226 facts (Al-Barkat batch, DISP-101B, 1,950 packs at the
// plant). No chilling temperature is recorded for this lot in the shared
// dataset, so its plant step carries no temperature — nothing is invented.
const LOT_S2_031226: LotSeed = {
  batch: 'LOT-S2-031226',
  farm: 'Al-Barkat Broiler Farm',
  farmPlace: 'Samundri, Faisalabad',
  farmer: 'Haji Tariq',
  cert: 'CERT-V3-011226',
  vet: 'Dr. Usman · Vet V3',
  plant: 'Punjab Fresh Abattoir',
  plantCode: 'S2',
  chillTemp: '',
  weight: '1.2',
};

const CAGE = {
  cage: 'C-01',
  batch: 'LOT-S2-031226',
  delivery: 'DISP-101A',
  farm: 'Al-Barkat Broiler Farm',
  farmCode: 'F12',
  farmPlace: 'Samundri, Faisalabad',
  farmer: 'Haji Tariq',
  cert: 'CERT-V3-011226',
  vet: 'Dr. Usman · Vet V3',
  vehicle: 'FDN-4411',
  driver: 'Riaz',
  dispatchDate: '04 Dec 2026',
  shop: 'Madina Live Chicken Shop',
  shopPlace: 'Samanabad, Faisalabad',
  receivedDate: '04 Dec 2026',
};

const RECALL = {
  pack: 'PACK-S3-051226-2750',
  by: 'Punjab Fresh Abattoir (S2)',
  date: '07 Dec 2026',
  reason: 'Cold-chain break found in one dispatch compartment — this pack was recalled as a precaution.',
};

const WITHDRAWN_AT_MART: Record<string, string> = {
  '1000': 'Damaged',
  '2000': 'Damaged',
  '2899': 'Damaged',
};

// ---------- Lookup — verbatim from modules/consumer.js ----------
type ScanStatus = 'VERIFIED' | 'RECALLED' | 'UNKNOWN' | 'WITHDRAWN';
type MartState = 'SOLD' | 'AVAILABLE' | 'AT_PLANT';

interface LookupResult {
  code: string;
  status: ScanStatus;
  kind: 'PACK' | 'CAGE' | null;
  lot?: LotSeed;
  n?: number;
  martState?: MartState;
}

function pad4(n: number): string {
  return `000${n}`.slice(-4);
}

function martPackState(n: number): 'WITHDRAWN' | 'SOLD' | 'AVAILABLE' {
  if (WITHDRAWN_AT_MART[String(n)]) {
    return 'WITHDRAWN';
  }
  if (n % 24 === 0) {
    return 'SOLD';
  }
  return 'AVAILABLE';
}

function lookupCode(raw: string): LookupResult {
  const code = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
  if (code === 'CAGE-C-01' || code === 'C-01' || code === 'CAGE-C-1') {
    return { code: 'CAGE-C-01', status: 'VERIFIED', kind: 'CAGE' };
  }
  const m = code.match(/^PACK-S3-051226-(\d{1,4})$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 2900) {
      const id = `PACK-S3-051226-${pad4(n)}`;
      if (id === RECALL.pack) {
        return { code: id, status: 'RECALLED', kind: 'PACK', lot: LOT_S3, n };
      }
      const state = martPackState(n);
      if (state === 'WITHDRAWN') {
        return { code: id, status: 'WITHDRAWN', kind: 'PACK', lot: LOT_S3, n };
      }
      return { code: id, status: 'VERIFIED', kind: 'PACK', lot: LOT_S3, n, martState: state };
    }
  }
  const m2 = code.match(/^PACK-S2-281126-(\d{1,4})$/);
  if (m2) {
    const n2 = parseInt(m2[1], 10);
    if (n2 >= 1 && n2 <= 1478) {
      return {
        code: `PACK-S2-281126-${pad4(n2)}`,
        status: 'VERIFIED',
        kind: 'PACK',
        lot: LOT_S2,
        n: n2,
        martState: 'AT_PLANT',
      };
    }
  }
  // Task-ordered demo code (see the file header): the plant-ended
  // PACK-S2-031226 range, 1–1,950 packs.
  const m3 = code.match(/^PACK-S2-031226-(\d{1,4})$/);
  if (m3) {
    const n3 = parseInt(m3[1], 10);
    if (n3 >= 1 && n3 <= 1950) {
      return {
        code: `PACK-S2-031226-${pad4(n3)}`,
        status: 'VERIFIED',
        kind: 'PACK',
        lot: LOT_S2_031226,
        n: n3,
        martState: 'AT_PLANT',
      };
    }
  }
  return { code: code || '—', status: 'UNKNOWN', kind: null };
}

// ---------- QR pattern — the deterministic qrSVG generator from consumer.js,
// rendered with react-native-svg. The inner 3x3 of each finder uses
// (x0+2, x0+2), exactly as the HTML generator does (kept verbatim).
function qrModules(seed: string): boolean[][] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const rnd = (): number => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  };
  const n = 21;
  const grid: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false));
  const inFinder = (x: number, y: number): boolean =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) {
        continue;
      }
      if (rnd() < 0.44) {
        grid[y][x] = true;
      }
    }
  }
  const finder = (x0: number, y0: number): void => {
    for (let y = y0; y < y0 + 7; y++) {
      for (let x = x0; x < x0 + 7; x++) {
        grid[y][x] = true;
      }
    }
    for (let y = y0 + 1; y < y0 + 6; y++) {
      for (let x = x0 + 1; x < x0 + 6; x++) {
        grid[y][x] = false;
      }
    }
    for (let y = x0 + 2; y < x0 + 5; y++) {
      for (let x = x0 + 2; x < x0 + 5; x++) {
        if (y >= 0 && y < n && x >= 0 && x < n) {
          grid[y][x] = true;
        }
      }
    }
  };
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  return grid;
}

function QrPattern({ seed, size }: { seed: string; size: number }) {
  const grid = useMemo(() => qrModules(seed), [seed]);
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      if (grid[y][x]) {
        cells.push({ x, y });
      }
    }
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 21 21">
      <Rect x={0} y={0} width={21} height={21} fill={lightColors.card} />
      {cells.map(cell => (
        <Rect key={`${cell.x}-${cell.y}`} x={cell.x} y={cell.y} width={1} height={1} fill={lightColors.ink} />
      ))}
    </Svg>
  );
}

// ---------- Scan frame pieces (css.css .scan-frame, .corner, .scan-line) ----------
// Fixed frame geometry (no theme dependency) lives at module level so the
// small frame pieces can use it without a theme.
const frameStyles = StyleSheet.create({
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3.5,
  },
  cornerTl: {
    top: 16,
    left: 16,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  cornerTr: {
    top: 16,
    right: 16,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  cornerBl: {
    bottom: 16,
    left: 16,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  cornerBr: {
    bottom: 16,
    right: 16,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    left: 26,
    right: 26,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: darkColors.green700,
    shadowColor: darkColors.green700,
    shadowOpacity: 0.9,
    shadowRadius: 7,
    elevation: 4,
  },
});

function Corners() {
  // Fixed bright-green scan accent from css.css (#4ade80 = dark green-700).
  const color = darkColors.green700;
  return (
    <>
      <View style={[frameStyles.corner, frameStyles.cornerTl, { borderColor: color }]} />
      <View style={[frameStyles.corner, frameStyles.cornerTr, { borderColor: color }]} />
      <View style={[frameStyles.corner, frameStyles.cornerBl, { borderColor: color }]} />
      <View style={[frameStyles.corner, frameStyles.cornerBr, { borderColor: color }]} />
    </>
  );
}

function ScanLineAnim({ height }: { height: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1050,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1050,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [anim]);
  const top = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [22, Math.max(22, height - 25)],
  });
  return <Animated.View style={[frameStyles.scanLine, { top }]} />;
}

// ---------- Scan result pieces (css.css .status-banner, .warn-box, .kv, .timeline) ----------
const BANNER_TITLE: Record<ScanStatus, string> = {
  VERIFIED: 'VERIFIED',
  RECALLED: 'RECALLED',
  UNKNOWN: 'UNKNOWN',
  WITHDRAWN: 'WITHDRAWN AT MART',
};

const BANNER_SUB: Record<ScanStatus, string> = {
  VERIFIED: 'This code is genuine and matched in the TraceHen system.',
  RECALLED: 'This pack has been recalled. Do not eat it.',
  UNKNOWN: 'This code was not found in the TraceHen system.',
  WITHDRAWN: 'This pack was withdrawn at the mart and should not be on sale.',
};

function ScanStatusBanner({ status }: { status: ScanStatus }) {
  const { colors } = useApp();
  const styles = makeStyles(colors);
  const bannerStyle =
    status === 'VERIFIED'
      ? styles.bannerVerified
      : status === 'RECALLED'
        ? styles.bannerRecalled
        : status === 'UNKNOWN'
          ? styles.bannerUnknown
          : styles.bannerWithdrawn;
  // Icon disc colours are the exact css.css values; the two greys/ambers
  // have no theme token (#6b7280 unknown, #d97706 withdrawn).
  const iconBg =
    status === 'VERIFIED'
      ? colors.green
      : status === 'RECALLED'
        ? colors.badgeRed
        : status === 'UNKNOWN'
          ? '#6b7280'
          : '#d97706';
  return (
    <View style={[styles.statusBanner, bannerStyle]}>
      <View style={[styles.bannerIcon, { backgroundColor: iconBg }]}>
        {status === 'VERIFIED' ? (
          <Check size={32} color={colors.white} strokeWidth={2.4} />
        ) : status === 'UNKNOWN' ? (
          <CircleHelp size={32} color={colors.white} strokeWidth={2.2} />
        ) : (
          <TriangleAlert size={32} color={colors.white} strokeWidth={2.2} />
        )}
      </View>
      <Text style={styles.bannerTitle}>{BANNER_TITLE[status]}</Text>
      <Text
        style={[
          styles.bannerSub,
          {
            color:
              status === 'VERIFIED'
                ? colors.green900
                : status === 'RECALLED'
                  ? colors.red
                  : status === 'UNKNOWN'
                    ? colors.grayTx
                    : colors.amber,
          },
        ]}
      >
        {BANNER_SUB[status]}
      </Text>
    </View>
  );
}

function WarnBox({ title, body }: { title: string; body: string }) {
  const { colors } = useApp();
  const styles = makeStyles(colors);
  return (
    <View style={styles.warnBox}>
      <TriangleAlert size={20} color={colors.red} strokeWidth={2.2} />
      <View style={styles.warnBody}>
        <Text style={styles.warnTitle}>{title}</Text>
        <Text style={styles.warnText}>{body}</Text>
      </View>
    </View>
  );
}

function KvRow({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'bad' }) {
  const { colors } = useApp();
  const styles = makeStyles(colors);
  const valueColor =
    tone === 'ok' ? colors.green700 : tone === 'bad' ? colors.red : colors.ink;
  return (
    <View style={styles.kv}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

interface TraceStep {
  title: string;
  detail: string;
  red?: boolean;
}

function TraceTimeline({ steps }: { steps: TraceStep[] }) {
  const { colors } = useApp();
  const styles = makeStyles(colors);
  return (
    <View style={styles.timeline}>
      <View style={styles.timelineLine} />
      {steps.map((step, i) => (
        <View key={`${step.title}-${i}`} style={styles.timelineItem}>
          <View
            style={[styles.timelineIcon, step.red ? { backgroundColor: colors.badgeRed } : undefined]}
          >
            {step.red ? (
              <TriangleAlert size={16} color={colors.white} strokeWidth={2.2} />
            ) : (
              <Check size={16} color={colors.white} strokeWidth={2.4} />
            )}
          </View>
          <Text style={styles.timelineTitle}>{step.title}</Text>
          {step.detail.split('\n').map((line, j) => (
            <Text key={`${i}-${j}`} style={styles.timelineDetail}>
              {line}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

// ---------- Screen ----------
export default function ConsumerScanScreen({}: Props) {
  const { colors, theme, currentUser, notify, showToast } = useApp();
  const styles = makeStyles(colors);
  const scrollRef = useRef<ComponentRef<typeof ScrollView> | null>(null);
  const [code, setCode] = useState(DEMO_CODE);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [camReady, setCamReady] = useState(false);
  const [camHeight, setCamHeight] = useState(300);
  const scannedRef = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted ?? false;

  const openCamera = useCallback(() => {
    scannedRef.current = false;
    setCamReady(false);
    setCameraOpen(true);
  }, []);

  const closeCamera = useCallback(() => {
    setCameraOpen(false);
  }, []);

  const showScanResult = useCallback(
    (codeValue: string) => {
      const r = lookupCode(codeValue);
      setResult(r);
      setError('');
      if (r.status === 'RECALLED' && currentUser) {
        notify(currentUser.name, {
          t: 'Recall alert',
          s: `${r.code} · Recalled ${RECALL.date} · Do not eat — return it to Imtiaz Mega Mart`,
          c: 'red',
        });
      }
      if (r.status === 'VERIFIED') {
        showToast(`Verified — ${r.code} is genuine.`);
      } else if (r.status === 'UNKNOWN') {
        showToast('Unknown code — not in the TraceHen system.');
      }
    },
    [currentUser, notify, showToast],
  );

  const showResultRef = useRef(showScanResult);
  useEffect(() => {
    showResultRef.current = showScanResult;
  }, [showScanResult]);

  const closeCameraRef = useRef(closeCamera);
  useEffect(() => {
    closeCameraRef.current = closeCamera;
  }, [closeCamera]);

  const onBarcodeScanned = useCallback((event: BarcodeScanningResult) => {
    const value = event.data;
    if (!value || scannedRef.current) {
      return;
    }
    scannedRef.current = true;
    closeCameraRef.current();
    showResultRef.current(value);
  }, []);

  useEffect(() => {
    if (result) {
      const t = setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [result]);

  const backToScanner = useCallback(() => {
    if (cameraOpen) {
      closeCamera();
    }
    setResult(null);
    setError('');
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [cameraOpen, closeCamera]);

  const doScan = useCallback(() => {
    if (!code.trim()) {
      setError('Type the pack or cage code first.');
      return;
    }
    setError('');
    showScanResult(code);
  }, [code, showScanResult]);

  // "Scan Code" asks the SYSTEM camera permission directly (expo-camera
  // requestPermission) and opens the camera. There is no custom permission
  // sheet — the system prompt is the only one, so the user is never asked
  // twice.
  const openWithOsPermission = useCallback(async (): Promise<void> => {
    if (hasPermission) {
      openCamera();
      return;
    }
    const res = await requestPermission();
    if (res.granted) {
      openCamera();
      return;
    }
    setError(
      'Camera access was not allowed. You can still type the pack code below to see its history.',
    );
  }, [hasPermission, openCamera, requestPermission]);

  const resultView = result ? renderResult(result, styles) : null;

  return (
    <View style={styles.screen}>
      <ConsumerHeader
        subtitle={result ? 'History' : 'Scan'}
        showBack={result !== null}
        onBack={backToScanner}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Scan</Text>

        <View style={[styles.scanFrame, styles.scanHero]}>
          <Corners />
          <ScanLineAnim height={308} />
          <View style={styles.heroQr}>
            <QrPattern seed={DEMO_CODE} size={130} />
          </View>
          <Text style={styles.scanHint}>Camera ready — align the QR inside the frame</Text>
        </View>

        <View style={styles.scanButtonWrap}>
          <PrimaryButton
            title="Scan Code"
            onPress={() => {
              void openWithOsPermission();
            }}
            icon={<ScanLine size={20} color={colors.white} strokeWidth={2} />}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {error ? <Text style={styles.formError}>{error}</Text> : null}
        <Text style={styles.fieldLabel}>Enter pack or cage code</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          placeholderTextColor={colors.chev}
          onSubmitEditing={doScan}
          returnKeyType="go"
        />
        <Text style={styles.fieldHint}>Printed under the QR — e.g. PACK-S3-051226-0001 or CAGE-C-01.</Text>
        <PrimaryButton
          title="View History"
          onPress={doScan}
          icon={<ArrowRight size={18} color={colors.white} strokeWidth={2.4} />}
        />

        {resultView}
      </ScrollView>
      <ConsumerBottomNav active="scan" />

      {/* Live camera overlay — real expo-camera feed + real QR detection */}
      <Modal visible={cameraOpen} animationType="slide" onRequestClose={closeCamera}>
        <View style={[styles.camOverlay, theme === 'dark' ? { backgroundColor: colors.black } : undefined]}>
          <View style={styles.camTop}>
            <Text style={styles.camTitle}>Scan pack QR</Text>
            <Pressable style={styles.camClose} onPress={closeCamera} accessibilityLabel="Close camera">
              <X size={20} color={colors.white} strokeWidth={2.4} />
            </Pressable>
          </View>
          <View
            style={styles.camFrame}
            onLayout={event => setCamHeight(event.nativeEvent.layout.height)}
          >
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              onBarcodeScanned={onBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onCameraReady={() => setCamReady(true)}
            />
            {!camReady ? (
              <View style={styles.camQr}>
                <QrPattern seed={DEMO_CODE} size={100} />
              </View>
            ) : null}
            <Corners />
            <ScanLineAnim height={camHeight} />
            <Text style={styles.scanHint}>
              {camReady
                ? 'Camera on — align the QR inside the frame'
                : 'Point the camera at the QR on the pack'}
            </Text>
          </View>
          <Text style={styles.camNote}>
            Hold the pack&rsquo;s QR inside the frame — it scans automatically and the pack&rsquo;s history
            opens.
          </Text>
          <Pressable style={styles.camCancel} onPress={closeCamera}>
            <Text style={styles.camCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );

  function renderResult(r: LookupResult, s: ReturnType<typeof makeStyles>) {
    const banner = <ScanStatusBanner status={r.status} />;
    const warn =
      r.status === 'RECALLED' ? (
        <WarnBox
          title="Do not eat this chicken"
          body={`Recalled by ${RECALL.by} on ${RECALL.date}. ${RECALL.reason}\nReturn the pack to Imtiaz Mega Mart, Faisalabad for a full refund.`}
        />
      ) : r.status === 'WITHDRAWN' ? (
        <WarnBox
          title="Do not buy this pack"
          body="Imtiaz Mega Mart withdrew this pack from stock — reason: Damaged. If it is on a shelf, please hand it to the mart staff."
        />
      ) : null;

    if (r.status === 'UNKNOWN') {
      return (
        <View style={s.resultWrap}>
          {banner}
          {warn}
          <View style={s.detailCard}>
            <Text style={s.cardHeading}>What this means</Text>
            <KvRow label="Code scanned" value={r.code} />
            <KvRow label="Scanned on" value={DEMO_TODAY} />
            <Text style={s.unknownText}>
              The code is not a TraceHen code, or it was typed wrong. Check the code under the QR
              on the pack and scan again. A genuine TraceHen pack always shows its farm, vet,
              plant and mart here.
            </Text>
          </View>
          <PrimaryButton title="Scan Again" onPress={backToScanner} />
          <Text style={s.guaranteeNote}>
            This page shows recorded traceability information. It is not a guarantee of safety.
          </Text>
        </View>
      );
    }

    if (r.kind === 'PACK' && r.lot && r.lot.batch === 'LOT-S3-051226') {
      const L = r.lot;
      const martLine =
        r.status === 'RECALLED'
          ? `This pack was recalled on ${RECALL.date} — see the warning above`
          : r.martState === 'SOLD'
            ? 'Sold at this mart · 06 Dec 2026'
            : `Received ${L.martReceived} · ${L.martTime} · Receiving temperature ${L.martTemp} °C · This pack is in stock at this mart`;
      const steps: TraceStep[] = [
        {
          title: `Farm — ${L.farm}`,
          detail: `${L.farmPlace} · ${L.farmer} · Batch ${L.batch}\nRaised and grown at this farm · Sent to the plant for processing`,
        },
        {
          title: `Vet — ${L.vet}`,
          detail: `Health checks & vaccination at the farm · Certificate ${L.cert} · Flock cleared`,
        },
        {
          title: `Plant — ${L.plant} (${L.plantCode})`,
          detail: `Ante-mortem & post-mortem checks passed · Chilling ${L.chillTemp} °C · Packed at the plant · Dispatched ${L.dispatchDate} · Vehicle ${L.vehicle} · Driver ${L.driver}`,
        },
        {
          title: `Mart — ${L.mart}, ${L.martPlace}`,
          detail: martLine,
          red: r.status === 'RECALLED',
        },
      ];
      return (
        <View style={s.resultWrap}>
          {banner}
          {warn}
          <View style={s.detailCard}>
            <View style={s.qrBig}>
              <View style={s.qrFrame}>
                <QrPattern seed={r.code} size={148} />
              </View>
            </View>
            <KvRow label="Pack ID" value={r.code} />
            <KvRow label="Weight" value={`${L.weight} kg`} />
            <KvRow label="Batch" value={L.batch} />
            <KvRow label="Farm" value={L.farm} />
            <KvRow label="Sold at" value={`${L.mart} — ${L.martPlace}`} />
            <KvRow
              label="Scan result"
              value={BANNER_TITLE[r.status]}
              tone={r.status === 'VERIFIED' ? 'ok' : 'bad'}
            />
            <KvRow label="Scanned on" value={DEMO_TODAY} />
          </View>
          <View style={s.detailCard}>
            <Text style={s.cardHeading}>Trace — Farm to You</Text>
            <TraceTimeline steps={steps} />
          </View>
          <PrimaryButton title="Scan Another" onPress={backToScanner} />
          <Text style={s.guaranteeNote}>
            This page shows recorded traceability information. It is not a guarantee of safety.
          </Text>
        </View>
      );
    }

    if (r.kind === 'PACK' && r.lot) {
      const L = r.lot;
      const plantDetail =
        L.batch === 'LOT-S2-031226'
          ? 'Ante-mortem & post-mortem checks passed · Packed at the plant'
          : `Ante-mortem & post-mortem checks passed · Chilling ${L.chillTemp} °C · Packed at the plant`;
      const steps: TraceStep[] = [
        {
          title: `Farm — ${L.farm}`,
          detail: `${L.farmPlace} · ${L.farmer} · Batch ${L.batch}`,
        },
        {
          title: `Vet — ${L.vet}`,
          detail: `Health checks & vaccination at the farm · Certificate ${L.cert} · Flock cleared`,
        },
        {
          title: `Plant — ${L.plant} (${L.plantCode})`,
          detail: plantDetail,
        },
      ];
      return (
        <View style={s.resultWrap}>
          {banner}
          {warn}
          <View style={s.detailCard}>
            <View style={s.qrBig}>
              <View style={s.qrFrame}>
                <QrPattern seed={r.code} size={148} />
              </View>
            </View>
            <KvRow label="Pack ID" value={r.code} />
            <KvRow label="Weight" value={`${L.weight} kg`} />
            <KvRow label="Batch" value={L.batch} />
            <KvRow label="Farm" value={L.farm} />
            <KvRow label="Where it is" value={`Packed at ${L.plant}`} />
            <KvRow label="Scan result" value="VERIFIED" tone="ok" />
            <KvRow label="Scanned on" value={DEMO_TODAY} />
          </View>
          <View style={s.detailCard}>
            <Text style={s.cardHeading}>Trace — Farm to Plant</Text>
            <TraceTimeline steps={steps} />
          </View>
          <PrimaryButton title="Scan Another" onPress={backToScanner} />
          <Text style={s.guaranteeNote}>
            This page shows recorded traceability information. It is not a guarantee of safety.
          </Text>
        </View>
      );
    }

    // CAGE-C-01
    const steps: TraceStep[] = [
      {
        title: `Farm — ${CAGE.farm} (${CAGE.farmCode})`,
        detail: `${CAGE.farmPlace} · ${CAGE.farmer} · Batch ${CAGE.batch}\nRaised and grown at this farm · Cobb · Shed 2 · Sent to the shop as live birds`,
      },
      {
        title: `Vet — ${CAGE.vet}`,
        detail: `Health checks & vaccination at the farm · Certificate ${CAGE.cert} · Flock cleared`,
      },
      {
        title: 'Dispatched by Farm',
        detail: `Vehicle ${CAGE.vehicle} · Driver ${CAGE.driver}\n${CAGE.dispatchDate} · 08:15 AM`,
      },
      {
        title: `Shop — ${CAGE.shop}, ${CAGE.shopPlace}`,
        detail: `Received ${CAGE.receivedDate} · Kept in Cage C-01 · Live birds available at this shop`,
      },
    ];
    return (
      <View style={s.resultWrap}>
        {banner}
        {warn}
        <View style={s.detailCard}>
          <View style={s.qrBig}>
            <View style={s.qrFrame}>
              <QrPattern seed="CAGE-C-01" size={148} />
            </View>
          </View>
          <KvRow label="Cage" value="C-01" />
          <KvRow label="Batch" value={CAGE.batch} />
          <KvRow label="Farm" value={`${CAGE.farm} (${CAGE.farmCode})`} />
          <KvRow label="Shop" value={CAGE.shop} />
          <KvRow label="Cage" value="C-01 · Live birds at this shop" />
          <KvRow label="Scan result" value="VERIFIED" tone="ok" />
          <KvRow label="Scanned on" value={DEMO_TODAY} />
        </View>
        <View style={s.detailCard}>
          <Text style={s.cardHeading}>Trace — Farm to You</Text>
          <TraceTimeline steps={steps} />
        </View>
        <PrimaryButton title="Scan Another" onPress={backToScanner} />
        <Text style={s.guaranteeNote}>
          This page shows recorded traceability information. It is not a guarantee of safety.
        </Text>
      </View>
    );
  }
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    body: {
      flex: 1,
    },
    bodyContent: {
      paddingHorizontal: spacing.screenPaddingX,
      paddingTop: spacing.screenPaddingTop,
      paddingBottom: spacing.screenPaddingBottom,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
      marginBottom: spacing.lg,
    },
    scanFrame: {
      position: 'relative',
      borderRadius: 20,
      backgroundColor: colors.green950,
      height: 250,
      marginBottom: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    scanHero: {
      height: 308,
    },
    heroQr: {
      width: 152,
      height: 152,
      backgroundColor: lightColors.card,
      borderRadius: radius.md,
      padding: 11,
      opacity: 1,
    },
    scanHint: {
      position: 'absolute',
      bottom: 14,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: colors.green200,
      fontSize: fontSize.xs,
      fontFamily: fontFamily.bold,
    },
    scanButtonWrap: {
      marginBottom: spacing.lg,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.gap,
      marginTop: 2,
      marginBottom: spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.line,
    },
    dividerText: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.xs,
      letterSpacing: 0.72,
      textTransform: 'uppercase',
      color: colors.muted,
    },
    formError: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13,
      color: colors.red,
      marginBottom: spacing.md,
    },
    fieldLabel: {
      fontFamily: fontFamily.bold,
      fontSize: 13,
      color: colors.ink,
      marginBottom: spacing.labelMarginBottom,
    },
    input: {
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.input,
      paddingHorizontal: spacing.inputPaddingX,
      paddingVertical: spacing.inputPaddingY,
      minHeight: 44,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.input,
      color: colors.ink,
    },
    fieldHint: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.caption,
      color: colors.muted,
      marginTop: 6,
      marginBottom: spacing.lg,
    },
    resultWrap: {
      marginTop: spacing.lg,
    },
    statusBanner: {
      borderRadius: radius.card,
      padding: 20,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      marginBottom: 14,
      borderWidth: 1.5,
    },
    bannerVerified: {
      backgroundColor: colors.green50,
      borderColor: colors.green200,
    },
    bannerRecalled: {
      backgroundColor: colors.redBg,
      borderColor: colors.dangerBorderLight,
    },
    bannerUnknown: {
      backgroundColor: colors.grayBg,
      borderColor: colors.line,
    },
    bannerWithdrawn: {
      backgroundColor: colors.amberBg,
      borderColor: colors.amberBorder,
    },
    bannerIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    bannerTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 23,
      letterSpacing: 0.46,
      color: colors.ink,
      marginBottom: 4,
    },
    bannerSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.muted,
      textAlign: 'center',
    },
    warnBox: {
      flexDirection: 'row',
      gap: 11,
      backgroundColor: colors.redBg,
      borderWidth: 1,
      borderColor: colors.dangerBorderLight,
      borderRadius: radius.md,
      padding: 13,
      paddingHorizontal: 14,
      marginBottom: 14,
    },
    warnBody: {
      flex: 1,
    },
    warnTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      color: colors.red,
    },
    warnText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      lineHeight: 19,
      color: colors.red,
      opacity: 0.85,
      marginTop: 2,
    },
    detailCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginBottom: 14,
    },
    cardHeading: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      letterSpacing: 0.65,
      textTransform: 'uppercase',
      color: colors.green700,
      marginBottom: spacing.md,
    },
    qrBig: {
      alignItems: 'center',
      paddingTop: 4,
      paddingBottom: 14,
    },
    qrFrame: {
      width: 172,
      height: 172,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 14,
      padding: 12,
      backgroundColor: lightColors.card,
    },
    kv: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 14,
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    kvLabel: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.muted,
      flexShrink: 0,
    },
    kvValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      textAlign: 'right',
      flexShrink: 1,
    },
    unknownText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13,
      lineHeight: 20,
      color: colors.muted,
      marginTop: 10,
    },
    timeline: {
      position: 'relative',
    },
    timelineLine: {
      position: 'absolute',
      left: 15,
      top: 10,
      bottom: 10,
      width: 2,
      backgroundColor: colors.green200,
    },
    timelineItem: {
      position: 'relative',
      paddingLeft: 46,
      paddingBottom: 18,
    },
    timelineIcon: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.green,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timelineTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 14,
      color: colors.ink,
    },
    timelineDetail: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      lineHeight: 19,
      color: colors.muted,
    },
    guaranteeNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.caption,
      lineHeight: 19,
      color: colors.muted,
      textAlign: 'center',
      marginTop: spacing.lg,
    },
    camOverlay: {
      flex: 1,
      backgroundColor: colors.green950,
      padding: 18,
      paddingHorizontal: spacing.lg,
    },
    camTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.gap,
      marginBottom: spacing.lg,
    },
    camTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 18,
      color: colors.white,
    },
    camClose: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.25)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    camFrame: {
      flex: 1,
      minHeight: 300,
      position: 'relative',
      borderRadius: 20,
      backgroundColor: '#02180b',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.14)',
      marginBottom: 14,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    camQr: {
      width: 118,
      height: 118,
      backgroundColor: lightColors.card,
      borderRadius: radius.md,
      padding: 9,
      opacity: 0.92,
    },
    camNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13,
      lineHeight: 20,
      color: colors.green200,
      textAlign: 'center',
      marginBottom: 14,
    },
    camCancel: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: radius.button,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.buttonPaddingY,
    },
    camCancelText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.button,
      color: colors.white,
    },
  });
}
