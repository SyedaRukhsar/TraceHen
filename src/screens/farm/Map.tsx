// Farm Map — site map view (farm.html #farm-view-map).
// Map image + pin at the farm's location; read-only view of the site pin.

import { Image, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Path } from 'react-native-svg';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { images } from '../../theme/assets';
import { fontFamily } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { FarmScreen } from './FarmChrome';
import { PageTitle } from './farmUI';
import { farmIdentity } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmMap'>;

export default function FarmMap({ route }: Props) {
  const { colors, currentUser, scopeKey, applications } = useApp();
  const identity = farmIdentity(currentUser, scopeKey, applications);
  const subtitle =
    route.params.subtitle ??
    `${identity.farmName} · ${identity.place}`;

  return (
    <FarmScreen subtitle="Location" activeTab="settings">
      <PageTitle title={route.params.title || 'Location'} sub={subtitle} />
      <View style={styles.mapWrap}>
        <Image
          source={images.map}
          style={[styles.map, { borderColor: colors.line }]}
          resizeMode="cover"
        />
        <View style={styles.pin} pointerEvents="none">
          <Svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="#dc2626"
            stroke="#ffffff"
            strokeWidth={1}
            strokeLinejoin="round"
          >
            <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <Circle cx={12} cy={10} r={3.2} fill="#ffffff" stroke="none" />
          </Svg>
        </View>
      </View>
      <Text style={[styles.attr, { color: colors.muted }]}>
        Pin set by the farm at application.
      </Text>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    position: 'relative',
  } as ViewStyle,
  map: {
    width: '100%',
    height: 320,
    borderRadius: radius.input,
    borderWidth: 1,
  },
  pin: {
    position: 'absolute',
    left: '50%',
    top: '46%',
    marginLeft: -20,
    marginTop: -40,
  } as ViewStyle,
  attr: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    marginTop: spacing.sm,
  } as TextStyle,
});
