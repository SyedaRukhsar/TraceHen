// Per-role metadata: label, tagline, and home route.
// Screens read this — never hardcode role labels in individual screens.

import type { Role } from '../types/models';
import type { RootStackParamList } from '../navigation/types';

export interface RoleMeta {
  label: string;
  tagline: string;
  /** React Navigation route name of the role home screen. */
  homeRoute: keyof RootStackParamList;
}

export const ROLE_META: Record<Role, RoleMeta> = {
  admin: {
    label: 'Admin',
    tagline: 'Review applications, organizations and batches',
    homeRoute: 'AdminDashboard',
  },
  farm: {
    label: 'Farm',
    tagline: 'Batches, events and dispatches',
    homeRoute: 'FarmHome',
  },
  vet: {
    label: 'Vet',
    tagline: 'Inspections and certificates',
    homeRoute: 'VetHome',
  },
  plant: {
    label: 'Slaughterhouse',
    tagline: 'Lots, packs and dispatches',
    homeRoute: 'PlantHome',
  },
  shop: {
    label: 'Shop',
    tagline: 'Deliveries, cages and sales',
    homeRoute: 'ShopHome',
  },
  mart: {
    label: 'Mart',
    tagline: 'Shipments and stock',
    homeRoute: 'MartHome',
  },
  consumer: {
    label: 'Consumer',
    tagline: 'Scan a pack and see its full journey',
    homeRoute: 'ConsumerScan',
  },
};

/** Home route for a role (used after sign-in). */
export function homeRouteFor(role: Role): keyof RootStackParamList {
  return ROLE_META[role].homeRoute;
}
