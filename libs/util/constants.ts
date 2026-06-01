import { LocationInfo } from './types';

export const initialViewState = {
  latitude: 10.776889,
  longitude: 106.700806,
  zoom: 11.5,
};

export const majorCitiesLocationInfo: LocationInfo[] = [
  {
    placeName: 'Chennai, Tamil Nadu, India',
    latLng: [13.0827, 80.2707],
  },
  {
    placeName: 'Ho Chi Minh City, Vietnam',
    latLng: [10.776889, 106.700806],
  },
  {
    placeName: 'London, Greater London, England, United Kingdom',
    latLng: [51.5074, -0.1278],
  },
  {
    placeName: 'Paris, France',
    latLng: [48.8566, 2.3522],
  },
  {
    placeName: 'Berlin, Germany',
    latLng: [52.52, 13.405],
  },
  {
    placeName: 'Sydney, New South Wales, Australia',
    latLng: [-33.8688, 151.2093],
  },
  {
    placeName: 'Rio de Janeiro, Brazil',
    latLng: [-22.9068, -43.1729],
  },
  {
    placeName: 'Cape Town, Western Cape, South Africa',
    latLng: [-33.9249, 18.4241],
  },
  {
    placeName: 'Moscow, Russia',
    latLng: [55.7558, 37.6176],
  },
  {
    placeName: 'Beijing, China',
    latLng: [39.9042, 116.4074],
  },
];

export const VALET_CHARGE_PER_METER = 0.005;

export const TAKE_COUNT = 12;

export const DEMO_SEED_PASSWORD = 'Password@123';

export type DemoPortalAudience = 'client' | 'admin' | 'manager' | 'valet';

export type DemoPortalAccess = {
  audience: DemoPortalAudience;
  title: string;
  description: string;
  url: string;
  account: string;
  email: string;
  password: string;
};

export const DEMO_PORTAL_ACCESS: DemoPortalAccess[] = [
  {
    audience: 'admin',
    title: 'Admin portal',
    description: 'Approve garages and manage verification workflows.',
    url: 'https://autospace-web-admin-u3k8.onrender.com',
    account: 'admin-001',
    email: 'admin-001@autospace.dev',
    password: DEMO_SEED_PASSWORD,
  },
  {
    audience: 'manager',
    title: 'Manager portal',
    description: 'Manage garages, valets, and operational bookings.',
    url: 'https://autospace-web-manager-1.onrender.com',
    account: 'manager-001',
    email: 'manager-001@autospace.dev',
    password: DEMO_SEED_PASSWORD,
  },
  {
    audience: 'valet',
    title: 'Valet portal',
    description: 'Handle pickup and drop-off trips from one place.',
    url: 'https://autospace-web-valet-56gr.onrender.com',
    account: 'valet-001',
    email: 'valet-001@autospace.dev',
    password: DEMO_SEED_PASSWORD,
  },
  {
    audience: 'client',
    title: 'Client portal',
    description: 'Search garages, book slots, and track your trips.',
    url: 'https://autospace-web-client.onrender.com',
    account: 'customer-001',
    email: 'customer-001@autospace.dev',
    password: DEMO_SEED_PASSWORD,
  },
];
