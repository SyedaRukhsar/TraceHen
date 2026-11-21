// TraceHen sign-up map picker (locked v51 shell).
// The MapPicker component renders the whole screen: "← Cancel" + per-role
// title ("Set farm location" / "Set clinic location" / "Set plant location" /
// "Set shop location" / "Set mart location"), the map image with a draggable
// pin, the address label, and [Confirm location]. Confirm stores the pin and
// goes back to SignUp; Cancel goes back without setting the pin.

import type { RouteProp } from '@react-navigation/native';
import { MapPicker } from '../../components/MapPicker';
import { useApp } from '../../services/store';
import type {
  Role,
  RootStackNavigationProp,
  RootStackParamList,
} from '../../navigation/types';

const TITLES: Record<string, string> = {
  farm: 'Set farm location',
  vet: 'Set clinic location',
  plant: 'Set plant location',
  shop: 'Set shop location',
  mart: 'Set mart location',
};

// Default place label per role, from shell.js PIN_PLACE.
const PLACES: Record<string, string> = {
  farm: 'Samundri, Faisalabad',
  vet: 'Faisalabad',
  plant: 'Faisalabad',
  shop: 'Samanabad, Faisalabad',
  mart: 'Faisalabad',
};

interface MapPickerScreenProps {
  navigation: RootStackNavigationProp;
  route: RouteProp<RootStackParamList, 'MapPicker'>;
}

export default function MapPickerScreen({ navigation, route }: MapPickerScreenProps) {
  const { setPendingPin } = useApp();
  const role: Role = route.params.role;

  return (
    <MapPicker
      initialLabel={TITLES[role] ?? 'Set location'}
      initialAddress={PLACES[role] ?? 'Faisalabad'}
      onConfirm={pick => {
        setPendingPin({ role, label: pick.label, address: pick.address });
        navigation.goBack();
      }}
      onCancel={() => navigation.goBack()}
    />
  );
}
