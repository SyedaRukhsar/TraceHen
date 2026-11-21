// Mart Map (MartMap {title, subtitle?}) — site map view: the map image
// with its pin, plus "Pin set by the mart at application." The title is
// "Location" (mart.html mart-view-map). NOTE: the only bundled map asset
// is images.map (the Samundri map with its pin baked in), so the Lahore
// site currently shows that same map; a separate Lahore/Gulberg map asset
// still needs to be bundled before the Lahore pin can show its own map
// (locked-in issue 3 in fyp-mart-module-decisions.md).

import { Image, StyleSheet, Text } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { images } from '../../theme/assets';
import { MartShell, PageSub, PageTitle } from './martUi';
import { fontFamily } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

export default function MartMapScreen() {
  const { colors } = useApp();
  const route = useRoute<RouteProp<RootStackParamList, 'MartMap'>>();
  const { title, subtitle } = route.params;
  const styles = StyleSheet.create({
    map: {
      width: '100%',
      aspectRatio: 1.5,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.line,
    },
    attr: {
      color: colors.muted,
      fontFamily: fontFamily.semiBold,
      fontSize: 11,
      marginTop: spacing.sm,
    },
  });
  return (
    <MartShell title={title} activeTab="settings" showBack>
      <PageTitle>{title}</PageTitle>
      {subtitle ? <PageSub>{subtitle}</PageSub> : null}
      <Image source={images.map} style={styles.map} resizeMode="cover" />
      <Text style={styles.attr}>Pin set by the mart at application.</Text>
    </MartShell>
  );
}
