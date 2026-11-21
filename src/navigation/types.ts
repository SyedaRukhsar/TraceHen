// React Navigation route map for the TraceHen stack (locked v51 app).
// Every screen route name is canonical — screens and the BottomNav all use
// these exact names. Never navigate by a path string; never add a route
// without adding it here AND in RootNavigator.tsx AND making it reachable.

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Role = 'admin' | 'farm' | 'vet' | 'plant' | 'shop' | 'mart' | 'consumer';

export interface DocumentParams {
  docName: string;
  docType: 'pdf' | 'image';
  /** Asset key from src/theme/assets.ts (documents map / images map). */
  docFile: string;
}

export interface MapParams {
  title: string;
  subtitle?: string;
}

export type RootStackParamList = {
  // ---- Shell / entry ----
  Splash: undefined;
  Onboarding: undefined;
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Pending: undefined;
  Forgot: undefined;
  MapPicker: { role: Role };

  // ---- Admin (3 top-level screens + details) ----
  AdminDashboard: undefined;
  AdminApplications: undefined;
  AdminApplicationDetail: { id: string };
  AdminBatches: undefined;
  AdminBatchDetail: { id: string };
  AdminOrganizations: undefined;
  AdminOrganizationDetail: { id: string };
  AdminDocument: DocumentParams;
  AdminNotifications: undefined;
  AdminSettings: undefined;
  AdminProfile: undefined;
  AdminChangePassword: undefined;

  // ---- Farm ----
  FarmHome: undefined;
  FarmBatches: undefined;
  FarmBatchDetail: { id: string };
  FarmNewBatch: undefined;
  FarmNewEvent: { batchId: string };
  FarmNewVet: { batchId: string };
  FarmDispatch: undefined;
  FarmNewDispatch: { batchId: string };
  FarmDispatchDetail: { id: string };
  FarmDocument: DocumentParams;
  FarmMap: MapParams;
  FarmNotifications: undefined;
  FarmSettings: undefined;
  FarmProfile: undefined;
  FarmChangePassword: undefined;

  // ---- Vet ----
  VetHome: undefined;
  VetInspections: undefined;
  VetInspectionDetail: { id: string };
  VetCertificates: undefined;
  VetCertificateDetail: { id: string };
  VetDocument: DocumentParams;
  VetNotifications: undefined;
  VetSettings: undefined;
  VetProfile: undefined;
  VetChangePassword: undefined;

  // ---- Slaughterhouse (Plant) ----
  PlantHome: undefined;
  PlantLots: undefined;
  PlantLotDetail: { id: string };
  PlantReceipt: { lotId: string };
  PlantSlaughter: { lotId: string };
  PlantQC: { lotId: string };
  PlantCreatePacks: { lotId: string };
  PlantPacks: undefined;
  PlantPackDetail: { id: string };
  PlantDispatch: { lotId: string };
  PlantDocument: DocumentParams;
  PlantMap: MapParams;
  PlantNotifications: undefined;
  PlantSettings: undefined;
  PlantProfile: undefined;
  PlantChangePassword: undefined;

  // ---- Shop ----
  ShopHome: undefined;
  ShopDeliveries: undefined;
  ShopDeliveryDetail: { id: string };
  ShopReceipt: { deliveryId: string };
  ShopStock: undefined;
  ShopCageDetail: { id: string };
  ShopSale: { cageId: string };
  ShopRemoval: { cageId: string };
  ShopDocument: DocumentParams;
  ShopMap: MapParams;
  ShopNotifications: undefined;
  ShopSettings: undefined;
  ShopProfile: undefined;
  ShopChangePassword: undefined;

  // ---- Mart ----
  MartHome: undefined;
  MartShipments: undefined;
  MartShipmentDetail: { id: string };
  MartReceipt: { shipmentId: string };
  MartStock: undefined;
  MartPackDetail: { id: string };
  MartWithdraw: { packId: string };
  MartDocument: DocumentParams;
  MartMap: MapParams;
  MartNotifications: undefined;
  MartSettings: undefined;
  MartProfile: undefined;
  MartChangePassword: undefined;

  // ---- Consumer (scan + settings only; no dashboard) ----
  ConsumerScan: undefined;
  ConsumerNotifications: undefined;
  ConsumerSettings: undefined;
  ConsumerProfile: undefined;
  ConsumerChangePassword: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type RouteName = keyof RootStackParamList;
