// Shop Map — site map view (shop.html shop-view-map). Map image + the
// "Pin set by the shop at application." attribution line.

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, StyleSheet, Text } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { images } from '../../theme/assets';
import { fontFamily } from '../../theme/typography';
import { PageSub, PageTitle, ShopLayout } from './ui';

export default function ShopMapScreen() {
  const { colors } = useApp();
  const route = useRoute<RouteProp<RootStackParamList, 'ShopMap'>>();
  const title = route.params.title;
  const subtitle =
    route.params.subtitle ?? 'Madina Live Chicken Shop · Samanabad, Faisalabad';

  return (
    <ShopLayout title={title} activeTab="settings">
      <PageTitle>Location</PageTitle>
      <PageSub>{subtitle}</PageSub>
      <Image
        source={images.map}
        style={[styles.map, { borderColor: colors.line }]}
        resizeMode="cover"
      />
      <Text style={[styles.attr, { color: colors.muted }]}>
        Pin set by the shop at application.
      </Text>
    </ShopLayout>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 320, borderRadius: 12, borderWidth: 1 },
  attr: { fontSize: 11, fontFamily: fontFamily.semiBold, marginTop: 8 },
});
