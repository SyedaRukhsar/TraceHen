// QR code — a REAL QR that encodes the code (react-native-qrcode-svg).
// DEVIATION from the locked HTML: the HTML's `qrSVG` generator draws a
// decorative pseudo-QR that does not encode anything, so a real scanner
// cannot read it. The RN app uses a real QR so the vision-camera scanner
// actually works. Foreground = ink (light #14231a / dark #f5f5f5),
// background white, quiet zone 0 (the HTML has no quiet zone on the QR).
import React from 'react';
import QRCodeSVG from 'react-native-qrcode-svg';
import { useApp } from '../services/store';

export interface QRCodeProps {
  value: string;
  size?: number;
}

export function QRCode({ value, size = 120 }: QRCodeProps) {
  const { colors } = useApp();

  return <QRCodeSVG value={value} size={size} color={colors.ink} backgroundColor="#ffffff" quietZone={0} />;
}
