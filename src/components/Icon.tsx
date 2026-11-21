// Shared icon component — every glyph in the locked HTML (modules/icons.txt)
// maps to a lucide-react-native component with the SAME path data, except for
// the three custom glyphs rendered with react-native-svg below:
//  - 'chicken'     — the TraceHen hen logo mark (icons.txt #10, NOT a Lucide icon)
//  - 'mapPinWhite' — red pin with a white dot (icons.txt #21; the map-picker pin)
//  - 'organization'— house-with-baseline glyph (icons.txt #27, Organizations tab);
//                    no lucide-react-native equivalent exists for this path data.
import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  Box,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock,
  Cross,
  Eye,
  EyeOff,
  File,
  FileCheck,
  FilePlus,
  FileText,
  Grid2x2,
  House,
  Image,
  Info,
  List,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  Map,
  MapPin,
  Moon,
  Package,
  PackageCheck,
  PauseCircle,
  Phone,
  Plus,
  ScanLine,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  Sun,
  Thermometer,
  Trash2,
  Truck,
  User,
  Users,
  Wheat,
  X,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { lightColors } from '../theme/colors';

export type IconName =
  | 'search'
  | 'pause'
  | 'info'
  | 'clock'
  | 'settings'
  | 'sun'
  | 'award'
  | 'cross'
  | 'moon'
  | 'plus'
  | 'file'
  | 'filePlus'
  | 'fileCheck'
  | 'camera'
  | 'users'
  | 'x'
  | 'arrowLeft'
  | 'user'
  | 'mapPin'
  | 'check'
  | 'loader'
  | 'package'
  | 'shieldCheck'
  | 'truck'
  | 'house'
  | 'trash'
  | 'scan'
  | 'grid'
  | 'arrowRight'
  | 'bell'
  | 'list'
  | 'logOut'
  | 'image'
  | 'eye'
  | 'eyeOff'
  | 'chevronRight'
  | 'checkCircle'
  | 'alert'
  | 'building'
  | 'store'
  | 'packageCheck'
  | 'thermometer'
  | 'clipboard'
  | 'fileText'
  | 'calendar'
  | 'phone'
  | 'mail'
  | 'map'
  | 'shield'
  | 'wheat'
  | 'box'
  | 'lock'
  | 'helpCircle'
  | 'shoppingBag'
  | 'organization'
  | 'chicken'
  | 'mapPinWhite';

type LucideName = Exclude<IconName, 'chicken' | 'mapPinWhite' | 'organization'>;

const LUCIDE_MAP: Record<LucideName, LucideIcon> = {
  search: Search,
  pause: PauseCircle,
  info: Info,
  clock: Clock,
  settings: Settings,
  sun: Sun,
  award: Award,
  cross: Cross,
  moon: Moon,
  plus: Plus,
  file: File,
  filePlus: FilePlus,
  fileCheck: FileCheck,
  camera: Camera,
  users: Users,
  x: X,
  arrowLeft: ArrowLeft,
  user: User,
  mapPin: MapPin,
  check: Check,
  loader: LoaderCircle,
  package: Package,
  shieldCheck: ShieldCheck,
  truck: Truck,
  house: House,
  trash: Trash2,
  scan: ScanLine,
  grid: Grid2x2,
  arrowRight: ArrowRight,
  bell: Bell,
  list: List,
  logOut: LogOut,
  image: Image,
  eye: Eye,
  eyeOff: EyeOff,
  chevronRight: ChevronRight,
  checkCircle: CheckCircle2,
  alert: AlertTriangle,
  building: Building2,
  store: Store,
  packageCheck: PackageCheck,
  thermometer: Thermometer,
  clipboard: ClipboardList,
  fileText: FileText,
  calendar: Calendar,
  phone: Phone,
  mail: Mail,
  map: Map,
  shield: Shield,
  wheat: Wheat,
  box: Box,
  lock: Lock,
  helpCircle: CircleHelp,
  shoppingBag: ShoppingBag,
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** Stroke width; 2 in the HTML, 2.4 for the landing arrow and the
   *  pending/forgot check icons. */
  strokeWidth?: number;
}

const SVG_PROPS = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** TraceHen hen logo mark — exact path data from CONVERSION-SPEC §5 / icons.txt #10. */
const CHICKEN_PATHS = [
  'M12 3v3',
  'M12 6c-3.5 0-6 2.8-6 6.2 0 1.2.3 2.3.9 3.3L5 21l3.4-1.4A7.4 7.4 0 0 0 12 20.5c3.9 0 6-3 6-6.8 0-1-.2-2-.6-2.9.8-.4 1.6-1.3 1.6-2.8-1 .2-1.9 0-2.6-.6A5.9 5.9 0 0 0 12 6Z',
];

/** Organizations glyph — exact path data from icons.txt #27. */
const ORGANIZATION_PATHS = ['M3 21h18', 'M5 21V7l7-4 7 4v14', 'M9 21v-6h6v6'];

const MAP_PIN_PATH = 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z';

export function Icon({ name, size = 20, color = lightColors.ink, strokeWidth = 2 }: IconProps) {
  if (name === 'chicken') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} {...SVG_PROPS}>
        {CHICKEN_PATHS.map(d => (
          <Path key={d} d={d} />
        ))}
      </Svg>
    );
  }
  if (name === 'organization') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} {...SVG_PROPS}>
        {ORGANIZATION_PATHS.map(d => (
          <Path key={d} d={d} />
        ))}
      </Svg>
    );
  }
  if (name === 'mapPinWhite') {
    // Red pin with a white dot — exact path data from CONVERSION-SPEC §5 /
    // icons.txt #21 (the map-picker pin in shell.html also strokes the pin
    // outline white, stroke-width 1).
    const pinColor = color === lightColors.ink ? '#dc2626' : color;
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={pinColor} stroke="#fff" strokeWidth={1} strokeLinejoin="round">
        <Path d={MAP_PIN_PATH} />
        <Circle cx="12" cy="10" r="3.2" fill="#fff" stroke="none" />
      </Svg>
    );
  }
  const Component = LUCIDE_MAP[name];
  return <Component size={size} color={color} strokeWidth={strokeWidth} />;
}
