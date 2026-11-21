// Root stack navigator — every screen in the app, registered by its
// canonical route name (see src/navigation/types.ts). The native header
// is hidden everywhere: entry screens render their own back links and the
// module screens render AppHeader inside ScreenLayout.
// Initial route is Splash.
//
// NOTE: the module screens (admin / farm / vet / plant / shop / mart /
// consumer) are built by parallel module agents; their imports below point
// at the final paths from the conversion spec §13 and resolve at integration.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

// ---- Entry (shell) ----
import SplashScreen from '../screens/entry/Splash';
import OnboardingScreen from '../screens/entry/Onboarding';
import LandingScreen from '../screens/entry/Landing';
import SignInScreen from '../screens/entry/SignIn';
import SignUpScreen from '../screens/entry/SignUp';
import PendingScreen from '../screens/entry/Pending';
import ForgotPasswordScreen from '../screens/entry/ForgotPassword';
import MapPickerScreen from '../screens/entry/MapPickerScreen';

// ---- Admin ----
import AdminDashboardScreen from '../screens/admin/Dashboard';
import AdminApplicationsScreen from '../screens/admin/Applications';
import AdminApplicationDetailScreen from '../screens/admin/ApplicationDetail';
import AdminBatchesScreen from '../screens/admin/Batches';
import AdminBatchDetailScreen from '../screens/admin/BatchDetail';
import AdminOrganizationsScreen from '../screens/admin/Organizations';
import AdminOrganizationDetailScreen from '../screens/admin/OrganizationDetail';
import AdminDocumentScreen from '../screens/admin/Document';
import AdminNotificationsScreen from '../screens/admin/Notifications';
import AdminSettingsScreen from '../screens/admin/Settings';
import AdminProfileScreen from '../screens/admin/Profile';
import AdminChangePasswordScreen from '../screens/admin/ChangePassword';

// ---- Farm ----
import FarmHomeScreen from '../screens/farm/Home';
import FarmBatchesScreen from '../screens/farm/Batches';
import FarmBatchDetailScreen from '../screens/farm/BatchDetail';
import FarmNewBatchScreen from '../screens/farm/NewBatch';
import FarmNewEventScreen from '../screens/farm/NewEvent';
import FarmNewVetScreen from '../screens/farm/NewVet';
import FarmDispatchScreen from '../screens/farm/Dispatch';
import FarmNewDispatchScreen from '../screens/farm/NewDispatch';
import FarmDispatchDetailScreen from '../screens/farm/DispatchDetail';
import FarmDocumentScreen from '../screens/farm/Document';
import FarmMapScreen from '../screens/farm/Map';
import FarmNotificationsScreen from '../screens/farm/Notifications';
import FarmSettingsScreen from '../screens/farm/Settings';
import FarmProfileScreen from '../screens/farm/Profile';
import FarmChangePasswordScreen from '../screens/farm/ChangePassword';

// ---- Vet ----
import VetHomeScreen from '../screens/vet/Home';
import VetInspectionsScreen from '../screens/vet/Inspections';
import VetInspectionDetailScreen from '../screens/vet/InspectionDetail';
import VetCertificatesScreen from '../screens/vet/Certificates';
import VetCertificateDetailScreen from '../screens/vet/CertificateDetail';
import VetDocumentScreen from '../screens/vet/Document';
import VetNotificationsScreen from '../screens/vet/Notifications';
import VetSettingsScreen from '../screens/vet/Settings';
import VetProfileScreen from '../screens/vet/Profile';
import VetChangePasswordScreen from '../screens/vet/ChangePassword';

// ---- Slaughterhouse (Plant) ----
import PlantHomeScreen from '../screens/plant/Home';
import PlantLotsScreen from '../screens/plant/Lots';
import PlantLotDetailScreen from '../screens/plant/LotDetail';
import PlantReceiptScreen from '../screens/plant/Receipt';
import PlantSlaughterScreen from '../screens/plant/Slaughter';
import PlantQCScreen from '../screens/plant/QC';
import PlantCreatePacksScreen from '../screens/plant/CreatePacks';
import PlantPacksScreen from '../screens/plant/Packs';
import PlantPackDetailScreen from '../screens/plant/PackDetail';
import PlantDispatchScreen from '../screens/plant/Dispatch';
import PlantDocumentScreen from '../screens/plant/Document';
import PlantMapScreen from '../screens/plant/Map';
import PlantNotificationsScreen from '../screens/plant/Notifications';
import PlantSettingsScreen from '../screens/plant/Settings';
import PlantProfileScreen from '../screens/plant/Profile';
import PlantChangePasswordScreen from '../screens/plant/ChangePassword';

// ---- Shop ----
import ShopHomeScreen from '../screens/shop/Home';
import ShopDeliveriesScreen from '../screens/shop/Deliveries';
import ShopDeliveryDetailScreen from '../screens/shop/DeliveryDetail';
import ShopReceiptScreen from '../screens/shop/Receipt';
import ShopStockScreen from '../screens/shop/Stock';
import ShopCageDetailScreen from '../screens/shop/CageDetail';
import ShopSaleScreen from '../screens/shop/Sale';
import ShopRemovalScreen from '../screens/shop/Removal';
import ShopDocumentScreen from '../screens/shop/Document';
import ShopMapScreen from '../screens/shop/Map';
import ShopNotificationsScreen from '../screens/shop/Notifications';
import ShopSettingsScreen from '../screens/shop/Settings';
import ShopProfileScreen from '../screens/shop/Profile';
import ShopChangePasswordScreen from '../screens/shop/ChangePassword';

// ---- Mart ----
import MartHomeScreen from '../screens/mart/Home';
import MartShipmentsScreen from '../screens/mart/Shipments';
import MartShipmentDetailScreen from '../screens/mart/ShipmentDetail';
import MartReceiptScreen from '../screens/mart/Receipt';
import MartStockScreen from '../screens/mart/Stock';
import MartPackDetailScreen from '../screens/mart/PackDetail';
import MartWithdrawScreen from '../screens/mart/Withdraw';
import MartDocumentScreen from '../screens/mart/Document';
import MartMapScreen from '../screens/mart/Map';
import MartNotificationsScreen from '../screens/mart/Notifications';
import MartSettingsScreen from '../screens/mart/Settings';
import MartProfileScreen from '../screens/mart/Profile';
import MartChangePasswordScreen from '../screens/mart/ChangePassword';

// ---- Consumer ----
import ConsumerScanScreen from '../screens/consumer/Scan';
import ConsumerNotificationsScreen from '../screens/consumer/Notifications';
import ConsumerSettingsScreen from '../screens/consumer/Settings';
import ConsumerProfileScreen from '../screens/consumer/Profile';
import ConsumerChangePasswordScreen from '../screens/consumer/ChangePassword';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Pending" component={PendingScreen} />
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="MapPicker" component={MapPickerScreen} />

      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminApplications" component={AdminApplicationsScreen} />
      <Stack.Screen
        name="AdminApplicationDetail"
        component={AdminApplicationDetailScreen}
      />
      <Stack.Screen name="AdminBatches" component={AdminBatchesScreen} />
      <Stack.Screen name="AdminBatchDetail" component={AdminBatchDetailScreen} />
      <Stack.Screen name="AdminOrganizations" component={AdminOrganizationsScreen} />
      <Stack.Screen
        name="AdminOrganizationDetail"
        component={AdminOrganizationDetailScreen}
      />
      <Stack.Screen name="AdminDocument" component={AdminDocumentScreen} />
      <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
      <Stack.Screen
        name="AdminChangePassword"
        component={AdminChangePasswordScreen}
      />

      <Stack.Screen name="FarmHome" component={FarmHomeScreen} />
      <Stack.Screen name="FarmBatches" component={FarmBatchesScreen} />
      <Stack.Screen name="FarmBatchDetail" component={FarmBatchDetailScreen} />
      <Stack.Screen name="FarmNewBatch" component={FarmNewBatchScreen} />
      <Stack.Screen name="FarmNewEvent" component={FarmNewEventScreen} />
      <Stack.Screen name="FarmNewVet" component={FarmNewVetScreen} />
      <Stack.Screen name="FarmDispatch" component={FarmDispatchScreen} />
      <Stack.Screen name="FarmNewDispatch" component={FarmNewDispatchScreen} />
      <Stack.Screen name="FarmDispatchDetail" component={FarmDispatchDetailScreen} />
      <Stack.Screen name="FarmDocument" component={FarmDocumentScreen} />
      <Stack.Screen name="FarmMap" component={FarmMapScreen} />
      <Stack.Screen name="FarmNotifications" component={FarmNotificationsScreen} />
      <Stack.Screen name="FarmSettings" component={FarmSettingsScreen} />
      <Stack.Screen name="FarmProfile" component={FarmProfileScreen} />
      <Stack.Screen name="FarmChangePassword" component={FarmChangePasswordScreen} />

      <Stack.Screen name="VetHome" component={VetHomeScreen} />
      <Stack.Screen name="VetInspections" component={VetInspectionsScreen} />
      <Stack.Screen
        name="VetInspectionDetail"
        component={VetInspectionDetailScreen}
      />
      <Stack.Screen name="VetCertificates" component={VetCertificatesScreen} />
      <Stack.Screen
        name="VetCertificateDetail"
        component={VetCertificateDetailScreen}
      />
      <Stack.Screen name="VetDocument" component={VetDocumentScreen} />
      <Stack.Screen name="VetNotifications" component={VetNotificationsScreen} />
      <Stack.Screen name="VetSettings" component={VetSettingsScreen} />
      <Stack.Screen name="VetProfile" component={VetProfileScreen} />
      <Stack.Screen name="VetChangePassword" component={VetChangePasswordScreen} />

      <Stack.Screen name="PlantHome" component={PlantHomeScreen} />
      <Stack.Screen name="PlantLots" component={PlantLotsScreen} />
      <Stack.Screen name="PlantLotDetail" component={PlantLotDetailScreen} />
      <Stack.Screen name="PlantReceipt" component={PlantReceiptScreen} />
      <Stack.Screen name="PlantSlaughter" component={PlantSlaughterScreen} />
      <Stack.Screen name="PlantQC" component={PlantQCScreen} />
      <Stack.Screen name="PlantCreatePacks" component={PlantCreatePacksScreen} />
      <Stack.Screen name="PlantPacks" component={PlantPacksScreen} />
      <Stack.Screen name="PlantPackDetail" component={PlantPackDetailScreen} />
      <Stack.Screen name="PlantDispatch" component={PlantDispatchScreen} />
      <Stack.Screen name="PlantDocument" component={PlantDocumentScreen} />
      <Stack.Screen name="PlantMap" component={PlantMapScreen} />
      <Stack.Screen name="PlantNotifications" component={PlantNotificationsScreen} />
      <Stack.Screen name="PlantSettings" component={PlantSettingsScreen} />
      <Stack.Screen name="PlantProfile" component={PlantProfileScreen} />
      <Stack.Screen
        name="PlantChangePassword"
        component={PlantChangePasswordScreen}
      />

      <Stack.Screen name="ShopHome" component={ShopHomeScreen} />
      <Stack.Screen name="ShopDeliveries" component={ShopDeliveriesScreen} />
      <Stack.Screen name="ShopDeliveryDetail" component={ShopDeliveryDetailScreen} />
      <Stack.Screen name="ShopReceipt" component={ShopReceiptScreen} />
      <Stack.Screen name="ShopStock" component={ShopStockScreen} />
      <Stack.Screen name="ShopCageDetail" component={ShopCageDetailScreen} />
      <Stack.Screen name="ShopSale" component={ShopSaleScreen} />
      <Stack.Screen name="ShopRemoval" component={ShopRemovalScreen} />
      <Stack.Screen name="ShopDocument" component={ShopDocumentScreen} />
      <Stack.Screen name="ShopMap" component={ShopMapScreen} />
      <Stack.Screen name="ShopNotifications" component={ShopNotificationsScreen} />
      <Stack.Screen name="ShopSettings" component={ShopSettingsScreen} />
      <Stack.Screen name="ShopProfile" component={ShopProfileScreen} />
      <Stack.Screen name="ShopChangePassword" component={ShopChangePasswordScreen} />

      <Stack.Screen name="MartHome" component={MartHomeScreen} />
      <Stack.Screen name="MartShipments" component={MartShipmentsScreen} />
      <Stack.Screen name="MartShipmentDetail" component={MartShipmentDetailScreen} />
      <Stack.Screen name="MartReceipt" component={MartReceiptScreen} />
      <Stack.Screen name="MartStock" component={MartStockScreen} />
      <Stack.Screen name="MartPackDetail" component={MartPackDetailScreen} />
      <Stack.Screen name="MartWithdraw" component={MartWithdrawScreen} />
      <Stack.Screen name="MartDocument" component={MartDocumentScreen} />
      <Stack.Screen name="MartMap" component={MartMapScreen} />
      <Stack.Screen name="MartNotifications" component={MartNotificationsScreen} />
      <Stack.Screen name="MartSettings" component={MartSettingsScreen} />
      <Stack.Screen name="MartProfile" component={MartProfileScreen} />
      <Stack.Screen name="MartChangePassword" component={MartChangePasswordScreen} />

      <Stack.Screen name="ConsumerScan" component={ConsumerScanScreen} />
      <Stack.Screen
        name="ConsumerNotifications"
        component={ConsumerNotificationsScreen}
      />
      <Stack.Screen name="ConsumerSettings" component={ConsumerSettingsScreen} />
      <Stack.Screen name="ConsumerProfile" component={ConsumerProfileScreen} />
      <Stack.Screen
        name="ConsumerChangePassword"
        component={ConsumerChangePasswordScreen}
      />
    </Stack.Navigator>
  );
}
