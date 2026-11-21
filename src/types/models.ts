// Shared data models for TraceHen — typed shapes of the locked HTML seed data.
// No `any`, no dead code, English only.

export type Role =
  | 'admin'
  | 'farm'
  | 'vet'
  | 'plant'
  | 'shop'
  | 'mart'
  | 'consumer';

export type ApplicationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'NEEDS_INFO'
  | 'REJECTED';

export type OrgStatus = 'ACTIVE' | 'SUSPENDED';

// Role label exactly as stored on applications and organizations in the seeds.
export type ApplicationRole =
  | 'Farm'
  | 'Vet'
  | 'Slaughterhouse'
  | 'Shop'
  | 'Mart';

export interface DocumentFile {
  name: string;
  type: 'pdf' | 'image';
  // Asset key from src/theme/assets.ts (e.g. 'farmLicenseApp1'); '' when the
  // seed document has no bundled asset.
  file: string;
  size?: string;
}

export interface Site {
  name: string;
  place: string;
}

export interface HistoryItem {
  t: string;
  s: string;
  c: string;
}

export type RoleDetail = [string, string];

export interface Application {
  id: string;
  person: string;
  phone: string;
  phoneVerified: boolean;
  business: string;
  role: ApplicationRole;
  district: string;
  tehsil: string;
  address: string;
  status: ApplicationStatus;
  createdVia: string;
  license: string;
  submitted: string;
  roleDetails: RoleDetail[];
  documents: DocumentFile[];
  sites: Site[];
  history: HistoryItem[];
}

export interface OrgMember {
  name: string;
  role: string;
  status: OrgStatus;
}

export interface Organization {
  id: string;
  name: string;
  type: ApplicationRole;
  owner: string;
  phone: string;
  tehsil: string;
  district: string;
  status: OrgStatus;
  createdVia: string;
  license: string;
  sites: Site[];
  members: OrgMember[];
  history: HistoryItem[];
  appId?: string;
}

export interface TimelineStep {
  stage: string;
  title: string;
  detail: string;
  when: string;
}

export interface Batch {
  id: string;
  farm: string;
  plant: string;
  status: string;
  placed: number;
  doa: number;
  deaths: number;
  loaded: number;
  atPlant: number;
  packs: number;
  timeline: TimelineStep[];
}

export type FarmBatchStatus =
  | 'REARING'
  | 'VET_PENDING'
  | 'VET_APPROVED'
  | 'DISPATCHED';

export interface FarmEvent {
  type: string;
  title: string;
  sub: string;
  date: string;
  count?: number;
}

export interface FarmBatch {
  id: string;
  source: string;
  breed: string;
  shed: string;
  arrival: string;
  placed: number;
  doa: number;
  status: FarmBatchStatus;
  vetCert: string;
  vetBy: string;
  withdrawal: string;
  events: FarmEvent[];
  dispatches: string[];
}

export interface Dispatch {
  id: string;
  batch: string;
  route: 'Shop' | 'Slaughterhouse';
  receiver: string;
  birds: number;
  vehicle: string;
  driver: string;
  date: string;
  status: 'DISPATCHED' | 'RECEIVED';
  received: number;
  doa: number;
  rejects: number;
}

export interface VetDecision {
  date: string;
  time: string;
  location: string;
  finding: string;
  reason: string;
  recheck?: string;
  certNo: string;
}

export interface VetMed {
  name: string;
  sub: string;
}

export interface VetEvent {
  title: string;
  sub: string;
  date: string;
}

export type InspectionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'HOLD'
  | 'FOLLOWUP';

export interface Inspection {
  batch: string;
  farm: string;
  farmCode: string;
  farmer: string;
  place: string;
  breed: string;
  shed: string;
  arrival: string;
  placed: number;
  doa: number;
  deaths: number;
  ready: string;
  weight: string;
  notes: string;
  status: InspectionStatus;
  decision: VetDecision | null;
  meds: VetMed[];
  events: VetEvent[];
}

export interface Certificate {
  no: string;
  batch: string;
  farm: string;
  issued: string;
  fileName: string;
  // Bundled asset key when one exists; '' when the seed PDF was not extracted.
  url: string;
}

export interface Defect {
  type: string;
  count: number;
}

export interface LotReceipt {
  date: string;
  time: string;
  doa: number;
  rejects: number;
  defects: Defect[];
  disposition: string;
  accepted: number;
  inspector: string;
}

export interface LotSlaughter {
  date: string;
  time: string;
  by: string;
  byId: string;
  method: string;
}

export interface QcHold {
  reason: string;
  by: string;
  recheck: string;
  note: string;
}

export interface LotQc {
  outcome: 'RELEASED' | 'HOLD';
  rejects: number;
  reason: string;
  disposition: string;
  chillStart: string;
  chillEnd: string;
  temp: string;
  inspector: string;
  hold?: QcHold | null;
}

export interface LotDispatch {
  receiver: string;
  packs: number;
  vehicle: string;
  driver: string;
  date: string;
}

export type LotStatus =
  | 'AWAITING'
  | 'IN_PROCESS'
  | 'QC_HOLD'
  | 'PACKED'
  | 'SENT';

export interface Lot {
  id: string;
  disp: string;
  batch: string;
  farm: string;
  farmCode: string;
  farmer: string;
  vehicle: string;
  driver: string;
  cert: string;
  received: number;
  status: LotStatus;
  receipt: LotReceipt | null;
  slaughter: LotSlaughter | null;
  qc: LotQc | null;
  qcDone?: boolean;
  packsCreated: boolean;
  packWeight: number;
  dispatch: LotDispatch | null;
}

export interface Pack {
  id: string;
  lotId: string;
  code: string;
  weight: number;
  status: string;
  created?: string;
}

export interface ShopReceipt {
  received: number;
  doa: number;
  cage: string;
  date: string;
  time: string;
  by: string;
}

export interface Delivery {
  id: string;
  batch: string;
  farm: string;
  farmCode: string;
  farmLicense: string;
  farmPlace: string;
  farmer: string;
  cert: string;
  vet: string;
  birdsSent: number;
  vehicle: string;
  driver: string;
  dispatchDate: string;
  dispatchTime: string;
  status: 'AWAITING' | 'RECEIVED';
  farmDetail: string;
  receipt: ShopReceipt | null;
}

export interface CageRemoval {
  count: number;
  reason: string;
  date: string;
}

export interface Cage {
  id: string;
  delivery: string;
  batch: string;
  received: number;
  sold: number;
  removals: CageRemoval[];
  receivedDate: string;
}

export interface MartReceipt {
  received: number;
  damaged: number;
  reason: string;
  temp: string;
  date: string;
  time: string;
  by: string;
  evidence: string;
  outcome: string;
}

export interface Shipment {
  id: string;
  lot: string;
  batch: string;
  from: string;
  plantCode: string;
  plantLicense: string;
  farm: string;
  farmPlace: string;
  farmer: string;
  cert: string;
  packsSent: number;
  vehicle: string;
  driver: string;
  dispatchDate: string;
  dispatchTime: string;
  status: 'AWAITING' | 'RECEIVED';
  farmDetail: string;
  plantDetail: string;
  receipt: MartReceipt | null;
}

export interface StockItem {
  id: string;
  lotId: string;
  packs: number;
  available: number;
  sold: number;
  withdrawn: number;
  price?: number;
}

export interface TraceStep {
  stage: string;
  title: string;
  detail: string;
  when: string;
}

export interface RecallInfo {
  by: string;
  date: string;
  reason: string;
}

export type ConsumerPackStatus =
  | 'VERIFIED'
  | 'RECALLED'
  | 'UNKNOWN'
  | 'WITHDRAWN';

export interface ConsumerPack {
  code: string;
  status: ConsumerPackStatus;
  trace: TraceStep[];
  recall?: RecallInfo;
  withdrawnReason?: string;
}

export interface AppNotification {
  t: string;
  s: string;
  c: string;
  read?: boolean;
}

export interface ActivityItem {
  t: string;
  s: string;
  c: string;
}

export type AppUserStatus = 'ACTIVE' | 'PENDING' | 'NEEDS_INFO' | 'REJECTED';

export interface AppUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  business: string;
  license: string;
  status: AppUserStatus;
  mobile?: string;
  appId?: string;
  notifs: AppNotification[];
  statusNote?: string;
}

export interface ScanEntry {
  code: string;
  status: string;
  label: string;
  date: string;
}

// One shared dataset: every seed record from the locked HTML modules.
export interface DemoData {
  applications: Application[];
  organizations: Organization[];
  batches: Batch[];
  adminBatches: Batch[];
  farmBatches: FarmBatch[];
  farmDispatches: Dispatch[];
  dispatches: Dispatch[];
  farmEvents: FarmEvent[];
  inspections: Inspection[];
  certificates: Certificate[];
  lots: Lot[];
  packs: Pack[];
  deliveries: Delivery[];
  cages: Cage[];
  shipments: Shipment[];
  stock: StockItem[];
  consumerPacks: ConsumerPack[];
  scans: ScanEntry[];
  activity: Record<Role, ActivityItem[]>;
  notifications: Record<Role, AppNotification[]>;
  adminActivity: ActivityItem[];
  adminNotifications: AppNotification[];
}
