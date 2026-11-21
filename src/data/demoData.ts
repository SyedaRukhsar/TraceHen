// Demo seed data for TraceHen — copied exactly from the locked HTML modules.
// Document `file` values are asset keys from src/theme/assets.ts (verified by
// content hash against the bundled files); '' means no bundled asset exists.
// A fresh deep copy is returned on every createDemoData() call.

import type {
  ActivityItem,
  AppNotification,
  Application,
  AppUser,
  Batch,
  Cage,
  Certificate,
  ConsumerPack,
  Delivery,
  DemoData,
  Dispatch,
  FarmBatch,
  FarmEvent,
  Inspection,
  Lot,
  Organization,
  Pack,
  Role,
  ScanEntry,
  Shipment,
  StockItem,
} from '../types/models';

// Demo accounts (shell.js DEMO_IDENTITY; password 'demo1234' for all).
export const demoAccounts: AppUser[] = [
  { name: 'Demo Admin', email: 'admin@tracehen.pk', password: 'demo1234', role: 'admin', business: 'TraceHen Admin', license: '', mobile: '0300-0000000', status: 'ACTIVE', notifs: [] },
  { name: 'Haji Tariq', email: 'albarkatfarm@gmail.com', password: 'demo1234', role: 'farm', business: 'Al-Barkat Broiler Farm', license: 'LIC-2026-006', mobile: '0300-1234567', status: 'ACTIVE', notifs: [] },
  { name: 'Dr. Usman', email: 'drusman@usmanvet.pk', password: 'demo1234', role: 'vet', business: 'Usman Veterinary Clinic', license: 'LIC-2026-007', mobile: '0321-5550142', status: 'ACTIVE', notifs: [] },
  { name: 'Kashif', email: 'kashif@punjabfresh.pk', password: 'demo1234', role: 'plant', business: 'Punjab Fresh Abattoir', license: 'LIC-2026-008', mobile: '0333-6518870', status: 'ACTIVE', notifs: [] },
  { name: 'Zubair', email: 'zubair@madinachicken.pk', password: 'demo1234', role: 'shop', business: 'Madina Live Chicken Shop', license: 'LIC-2026-003', mobile: '0301-7772098', status: 'ACTIVE', notifs: [] },
  { name: 'Salman', email: 'salman@imtiazmart.pk', password: 'demo1234', role: 'mart', business: 'Imtiaz Mega Mart', license: 'LIC-2026-005', mobile: '0300-8641205', status: 'ACTIVE', notifs: [] },
  { name: 'Ayesha', email: 'ayesha.khan@gmail.com', password: 'demo1234', role: 'consumer', business: '', license: '', mobile: '0321-5550148', status: 'ACTIVE', notifs: [] },
];

// Admin applications (admin.js seedApplications).
const applications: Application[] = [
  { id: 'app1', person: 'Haji Muhammad Tariq', phone: '0300-1234567', phoneVerified: true,
    business: 'Al-Barkat Broiler Farm', role: 'Farm', district: 'Faisalabad', tehsil: 'Samundri',
    address: 'Chak 45 GB, Samundri Road', status: 'PENDING', createdVia: 'SELF_REGISTER', license: 'LIC-2026-001', submitted: '18 Nov 2026, 09:12',
    roleDetails: [['Sheds', '3'], ['Capacity', '15,000 birds'], ['License', 'LIC-2026-001']],
    documents: [
      { name: 'Farm license', type: 'pdf', file: 'farmLicenseApp1' },
      { name: 'Signboard photo', type: 'image', file: 'signboardFarm' },
      { name: 'CNIC', type: 'image', file: 'docCnic1' },
    ],
    sites: [{ name: 'Al-Barkat Broiler Farm — Primary Site', place: 'Samundri, Faisalabad' }],
    history: [{ t: 'Application submitted', s: '18 Nov 2026, 09:12', c: '' }] },
  { id: 'app2', person: 'Dr. Usman', phone: '0321-5550142', phoneVerified: true,
    business: 'Usman Veterinary Clinic', role: 'Vet', district: 'Faisalabad', tehsil: 'Faisalabad',
    address: 'Main Jaranwala Road, Faisalabad', status: 'PENDING', createdVia: 'SELF_REGISTER', license: 'LIC-2026-002', submitted: '18 Nov 2026, 09:40',
    roleDetails: [['Vet registration no.', 'PVMC-2841'], ['Service tehsils', 'Samundri, Jaranwala'], ['License', 'LIC-2026-002']],
    documents: [
      { name: 'Vet registration card', type: 'image', file: 'docCnic2' },
      { name: 'Clinic license', type: 'pdf', file: 'clinicLicenseShared' },
    ],
    sites: [{ name: 'Usman Veterinary Clinic — Main', place: 'Faisalabad' }],
    history: [{ t: 'Application submitted', s: '18 Nov 2026, 09:40', c: '' }] },
  { id: 'app3', person: 'Zubair', phone: '0301-7772098', phoneVerified: true,
    business: 'Madina Live Chicken Shop', role: 'Shop', district: 'Faisalabad', tehsil: 'Samanabad',
    address: 'Main Samanabad Road, Faisalabad', status: 'PENDING', createdVia: 'SELF_REGISTER', license: 'LIC-2026-003', submitted: '18 Nov 2026, 10:05',
    roleDetails: [['Shop type', 'Live chicken retail'], ['License', 'LIC-2026-003']],
    documents: [
      { name: 'Shop license', type: 'pdf', file: 'shopLicenseApp3' },
      { name: 'Shop signboard photo', type: 'image', file: 'docSignboard' },
    ],
    sites: [{ name: 'Madina Live Chicken Shop', place: 'Samanabad, Faisalabad' }],
    history: [{ t: 'Application submitted', s: '18 Nov 2026, 10:05', c: '' }] },
  { id: 'app4', person: 'Kashif', phone: '0333-6518870', phoneVerified: true,
    business: 'Punjab Fresh Abattoir', role: 'Slaughterhouse', district: 'Faisalabad', tehsil: 'Faisalabad',
    address: 'Industrial Area, Faisalabad', status: 'PENDING', createdVia: 'SELF_REGISTER', license: 'LIC-2026-004', submitted: '18 Nov 2026, 10:31',
    roleDetails: [['Daily capacity', '6,000 birds'], ['License', 'LIC-2026-004']],
    documents: [
      { name: 'Business license', type: 'pdf', file: 'businessLicenseApp4' },
      { name: 'Plant registration certificate', type: 'pdf', file: 'plantRegistrationCertificateShared' },
    ],
    sites: [{ name: 'Punjab Fresh Abattoir — Plant', place: 'Faisalabad' }],
    history: [{ t: 'Application submitted', s: '18 Nov 2026, 10:31', c: '' }] },
  { id: 'app5', person: 'Salman', phone: '0300-8641205', phoneVerified: true,
    business: 'Imtiaz Mega Mart', role: 'Mart', district: 'Faisalabad', tehsil: 'Faisalabad',
    address: 'Canal Road, Faisalabad', status: 'PENDING', createdVia: 'SELF_REGISTER', license: 'LIC-2026-005', submitted: '18 Nov 2026, 11:02',
    roleDetails: [['Sites applied', '2 — Faisalabad + Lahore'], ['License', 'LIC-2026-005']],
    documents: [
      { name: 'Business license', type: 'pdf', file: 'businessLicenseApp5' },
      { name: 'Business registration', type: 'pdf', file: 'businessRegistrationShared' },
    ],
    sites: [{ name: 'Imtiaz Mega Mart — Faisalabad', place: 'Canal Road, Faisalabad' }, { name: 'Imtiaz Mega Mart — Lahore', place: 'Gulberg, Lahore' }],
    history: [{ t: 'Application submitted', s: '18 Nov 2026, 11:02', c: '' }] },
];

// Admin organizations (admin.js seedOrganizations).
const organizations: Organization[] = [
  { id: 'org-f12', name: 'Farm F12', type: 'Farm', owner: 'Farm F12 Owner', phone: '0300-1000012', tehsil: 'Samundri', district: 'Faisalabad', status: 'ACTIVE', createdVia: 'SELF_REGISTER', license: 'LIC-2026-006',
    sites: [{ name: 'Farm F12 — Primary Site', place: 'Samundri, Faisalabad' }],
    members: [{ name: 'Farm F12 Owner', role: 'Owner', status: 'ACTIVE' }, { name: 'Farm F12 Manager', role: 'Manager', status: 'ACTIVE' }],
    history: [{ t: 'Application approved by Demo Admin', s: '02 Nov 2026', c: '' }, { t: 'Organization created from application', s: '01 Nov 2026', c: 'gray' }] },
  { id: 'org-v3', name: 'Vet V3', type: 'Vet', owner: 'Dr. Vet V3', phone: '0300-1000003', tehsil: 'Faisalabad', district: 'Faisalabad', status: 'ACTIVE', createdVia: 'SELF_REGISTER', license: 'LIC-2026-007',
    sites: [{ name: 'Vet V3 Clinic', place: 'Faisalabad' }],
    members: [{ name: 'Dr. Vet V3', role: 'Owner', status: 'ACTIVE' }],
    history: [{ t: 'Application approved by Demo Admin', s: '03 Nov 2026', c: '' }, { t: 'Organization created from application', s: '02 Nov 2026', c: 'gray' }] },
  { id: 'org-s2', name: 'Plant S2', type: 'Slaughterhouse', owner: 'Plant S2 Manager', phone: '0300-1000002', tehsil: 'Faisalabad', district: 'Faisalabad', status: 'ACTIVE', createdVia: 'SELF_REGISTER', license: 'LIC-2026-008',
    sites: [{ name: 'Plant S2 — Slaughter Plant', place: 'Faisalabad' }],
    members: [{ name: 'Plant S2 Manager', role: 'Owner', status: 'ACTIVE' }, { name: 'Plant S2 Supervisor', role: 'Supervisor', status: 'ACTIVE' }],
    history: [{ t: 'Application approved by Demo Admin', s: '05 Nov 2026', c: '' }, { t: 'Organization created from application', s: '04 Nov 2026', c: 'gray' }] },
  { id: 'org-r1', name: 'Retailer R1', type: 'Shop', owner: 'Retailer R1 Owner', phone: '0300-1000001', tehsil: 'Lahore', district: 'Lahore', status: 'ACTIVE', createdVia: 'SELF_REGISTER', license: 'LIC-2026-009',
    sites: [{ name: 'Retailer R1 Shop', place: 'Lahore' }],
    members: [{ name: 'Retailer R1 Owner', role: 'Owner', status: 'ACTIVE' }],
    history: [{ t: 'Application approved by Demo Admin', s: '06 Nov 2026', c: '' }, { t: 'Organization created from application', s: '05 Nov 2026', c: 'gray' }] },
  { id: 'org-gv', name: 'Green Valley Farm', type: 'Farm', owner: 'Green Valley Owner', phone: '0300-2000015', tehsil: 'Jaranwala', district: 'Faisalabad', status: 'ACTIVE', createdVia: 'SELF_REGISTER', license: 'LIC-2026-010',
    sites: [{ name: 'Green Valley Farm — Primary Site', place: 'Jaranwala, Faisalabad' }],
    members: [{ name: 'Green Valley Owner', role: 'Owner', status: 'ACTIVE' }, { name: 'Green Valley Manager', role: 'Manager', status: 'ACTIVE' }, { name: 'Green Valley Worker', role: 'Worker', status: 'ACTIVE' }],
    history: [{ t: 'Application approved by Demo Admin', s: '08 Nov 2026', c: '' }, { t: 'Organization created from application', s: '07 Nov 2026', c: 'gray' }] },
  { id: 'org-cc', name: 'City Chicken Shop', type: 'Shop', owner: 'City Chicken Owner', phone: '0300-2000021', tehsil: 'Faisalabad', district: 'Faisalabad', status: 'ACTIVE', createdVia: 'SELF_REGISTER', license: 'LIC-2026-011',
    sites: [{ name: 'City Chicken Shop', place: 'Faisalabad' }],
    members: [{ name: 'City Chicken Owner', role: 'Owner', status: 'ACTIVE' }, { name: 'City Chicken Assistant', role: 'Assistant', status: 'ACTIVE' }],
    history: [{ t: 'Application approved by Demo Admin', s: '10 Nov 2026', c: '' }, { t: 'Organization created from application', s: '09 Nov 2026', c: 'gray' }] },
];

// Admin batches (admin.js BATCHES).
const batches: Batch[] = [
  { id: 'LOT-S2-031226', farm: 'Farm F12 — Samundri', plant: 'Plant S2', status: 'Completed',
    placed: 5000, doa: 10, deaths: 120, loaded: 4870, atPlant: 4850, packs: 4800,
    timeline: [
      { stage: 'Farm', title: 'Farm F12 — Samundri', detail: '5,000 chicks placed · 10 dead on arrival · 4,990 started the cycle. 120 birds lost during grow-out.', when: '03 Dec 2026 · Placement & grow-out' },
      { stage: 'Vet', title: 'Vet V3 — Health checks', detail: 'Vaccination and health checks completed at the farm during the cycle. Flock cleared for dispatch.', when: 'During grow-out' },
      { stage: 'Transport', title: 'Transport — entered by Farm F12', detail: 'Farm entered the transport details at dispatch: hired truck, vehicle no. LEA-24-817. 4,870 birds loaded at the farm and sent to Plant S2.', when: 'Dispatch day · entered by farm' },
      { stage: 'Slaughter', title: 'Plant S2 — Slaughter & packing', detail: '4,850 birds received at the plant · 4,800 packs produced and sealed with QR codes.', when: 'Same day' },
      { stage: 'Shop / Mart', title: 'Retailer R1 & shops', detail: 'Packs delivered to retailers. A consumer scan on any pack shows this full history.', when: 'After packing' },
    ] },
  { id: 'LOT-S2-051226', farm: 'Green Valley Farm — Jaranwala', plant: 'Plant S2', status: 'Completed',
    placed: 3000, doa: 5, deaths: 65, loaded: 2930, atPlant: 2920, packs: 2900,
    timeline: [
      { stage: 'Farm', title: 'Green Valley Farm — Jaranwala', detail: '3,000 chicks placed · 5 dead on arrival · 2,995 started the cycle. 65 birds lost during grow-out.', when: '05 Dec 2026 · Placement & grow-out' },
      { stage: 'Vet', title: 'Vet V3 — Health checks', detail: 'Vaccination and health checks completed at the farm during the cycle. Flock cleared for dispatch.', when: 'During grow-out' },
      { stage: 'Transport', title: 'Transport — entered by Green Valley Farm', detail: 'Farm entered the transport details at dispatch: hired truck, vehicle no. LES-19-342. 2,930 birds loaded at the farm and sent to Plant S2.', when: 'Dispatch day · entered by farm' },
      { stage: 'Slaughter', title: 'Plant S2 — Slaughter & packing', detail: '2,920 birds received at the plant · 2,900 packs produced and sealed with QR codes.', when: 'Same day' },
      { stage: 'Shop / Mart', title: 'City Chicken Shop', detail: 'Packs delivered to the shop. A consumer scan on any pack shows this full history.', when: 'After packing' },
    ] },
];

// Farm batches (farm.js batches).
const farmBatches: FarmBatch[] = [
  { id: 'LOT-S2-031226', source: 'Sabir Hatchery, Faisalabad', breed: 'Cobb', shed: 'Shed 2', arrival: '03 Dec 2026',
    placed: 5000, doa: 10, status: 'VET_APPROVED', vetCert: 'CERT-V3-011226', vetBy: 'Dr. Usman · Vet V3',
    withdrawal: 'Enrofloxacin · ends 29 Oct 2026',
    events: [
      { type: 'Arrival', title: 'Chicks Placed', sub: '5,000 chicks · 10 dead on arrival', date: '03 Dec 2026' },
      { type: 'Vaccination', title: 'ND+IB Vaccine', sub: 'Vaccination · Day 7', date: '10 Dec 2026' },
      { type: 'Vaccination', title: 'Gumboro Vaccine', sub: 'Vaccination · Day 14', date: '17 Dec 2026' },
      { type: 'Medication', title: 'Enrofloxacin', sub: 'Medication · Day 22 · Withdrawal 7 days', date: '25 Dec 2026' },
      { type: 'Mortality', title: 'Mortality', sub: '120 birds — grow-out losses', count: 120, date: 'During grow-out' },
      { type: 'Vet', title: 'Vet Inspection Approved', sub: 'CERT-V3-011226 · Dr. Usman · Vet V3', date: 'Before dispatch' },
    ],
    dispatches: ['DISP-101A', 'DISP-101B'] },
  { id: 'LOT-S2-051226', source: 'Sabir Hatchery, Faisalabad', breed: 'Ross', shed: 'Shed 1', arrival: '05 Dec 2026',
    placed: 3000, doa: 5, status: 'REARING', vetCert: '', vetBy: '',
    withdrawal: '',
    events: [
      { type: 'Arrival', title: 'Chicks Placed', sub: '3,000 chicks · 5 dead on arrival', date: '05 Dec 2026' },
      { type: 'Vaccination', title: 'ND+IB Vaccine', sub: 'Vaccination · Day 7', date: '12 Dec 2026' },
      { type: 'Mortality', title: 'Mortality', sub: '65 birds — grow-out losses', count: 65, date: 'During grow-out' },
    ],
    dispatches: [] },
];

// Farm dispatches (farm.js dispatches).
const farmDispatches: Dispatch[] = [
  { id: 'DISP-101A', batch: 'LOT-S2-031226', route: 'Shop', receiver: 'Madina Live Chicken Shop', birds: 500,
    vehicle: 'FDN-4411', driver: 'Riaz', date: 'Dispatch day', status: 'RECEIVED', received: 496, doa: 4, rejects: 0 },
  { id: 'DISP-101B', batch: 'LOT-S2-031226', route: 'Slaughterhouse', receiver: 'Punjab Fresh Abattoir', birds: 2000,
    vehicle: 'LES-9900', driver: 'Abid', date: 'Dispatch day', status: 'RECEIVED', received: 1980, doa: 15, rejects: 5 },
];

// Farm events (the events of the farm batches above, in seed order).
const farmEvents: FarmEvent[] = farmBatches.flatMap(b => b.events);

// Vet inspections (vet.js inspections).
const inspections: Inspection[] = [
  { batch: 'LOT-S2-031226', farm: 'Al-Barkat Broiler Farm', farmCode: 'F12', farmer: 'Haji Tariq', place: 'Samundri',
    breed: 'Cobb', shed: 'Shed 2', arrival: '03 Dec 2026', placed: 5000, doa: 10, deaths: 120,
    ready: '01 Dec 2026', weight: '2.1 kg', notes: 'Birds active and feeding well.', status: 'PENDING', decision: null,
    meds: [{ name: 'Enrofloxacin', sub: 'Day 22 · Withdrawal 7 days · Ended 29 Oct 2026' }],
    events: [
      { title: 'Chicks Placed', sub: '5,000 chicks · 10 dead on arrival', date: '03 Dec 2026' },
      { title: 'ND+IB Vaccine', sub: 'Vaccination · Day 7', date: '10 Dec 2026' },
      { title: 'Gumboro Vaccine', sub: 'Vaccination · Day 14', date: '17 Dec 2026' },
      { title: 'Enrofloxacin', sub: 'Medication · Day 22 · Withdrawal 7 days', date: '25 Dec 2026' },
      { title: 'Mortality', sub: '120 birds — grow-out losses', date: 'During grow-out' },
      { title: 'Vet Inspection Requested', sub: 'In-person visit · Avg 2.1 kg', date: 'Requested' },
    ] },
  { batch: 'LOT-G1-241126', farm: 'Green Valley Farm', farmCode: '', farmer: 'Muhammad Aslam', place: 'Jaranwala',
    breed: 'Ross', shed: 'Shed 1', arrival: '24 Nov 2026', placed: 4000, doa: 8, deaths: 95,
    ready: '03 Dec 2026', weight: '1.9 kg', notes: '', status: 'PENDING', decision: null,
    meds: [],
    events: [
      { title: 'Chicks Placed', sub: '4,000 chicks · 8 dead on arrival', date: '24 Nov 2026' },
      { title: 'ND+IB Vaccine', sub: 'Vaccination · Day 7', date: '01 Dec 2026' },
      { title: 'Mortality', sub: '95 birds — grow-out losses', date: 'During grow-out' },
      { title: 'Vet Inspection Requested', sub: 'In-person visit · Avg 1.9 kg', date: 'Requested' },
    ] },
  { batch: 'LOT-G1-101126', farm: 'Green Valley Farm', farmCode: '', farmer: 'Muhammad Aslam', place: 'Jaranwala',
    breed: 'Cobb', shed: 'Shed 2', arrival: '10 Nov 2026', placed: 3500, doa: 6, deaths: 74,
    ready: '24 Nov 2026', weight: '2.2 kg', notes: '', status: 'APPROVED',
    decision: { date: '24 Nov 2026', time: '10:30 AM', location: 'Green Valley Farm, Jaranwala', finding: 'Flock clinically healthy. No signs of disease found.', reason: '', certNo: 'CERT-V3-241126' },
    meds: [],
    events: [
      { title: 'Chicks Placed', sub: '3,500 chicks · 6 dead on arrival', date: '10 Nov 2026' },
      { title: 'ND+IB Vaccine', sub: 'Vaccination · Day 7', date: '17 Nov 2026' },
      { title: 'Mortality', sub: '74 birds — grow-out losses', date: 'During grow-out' },
    ] },
  { batch: 'LOT-S3-151126', farm: 'Al-Barkat Broiler Farm', farmCode: 'F12', farmer: 'Haji Tariq', place: 'Samundri',
    breed: 'Ross', shed: 'Shed 3', arrival: '15 Nov 2026', placed: 2500, doa: 4, deaths: 60,
    ready: '27 Nov 2026', weight: '1.8 kg', notes: '', status: 'HOLD',
    decision: { date: '27 Nov 2026', time: '11:00 AM', location: 'Al-Barkat Broiler Farm, Samundri', finding: 'Mortality rising in the last week.', reason: 'Recheck after 3 days before any decision.', recheck: '30 Nov 2026', certNo: '' },
    meds: [],
    events: [
      { title: 'Chicks Placed', sub: '2,500 chicks · 4 dead on arrival', date: '15 Nov 2026' },
      { title: 'ND+IB Vaccine', sub: 'Vaccination · Day 7', date: '22 Nov 2026' },
      { title: 'Mortality', sub: '60 birds — grow-out losses', date: 'During grow-out' },
    ] },
  { batch: 'LOT-S3-021126', farm: 'Al-Barkat Broiler Farm', farmCode: 'F12', farmer: 'Haji Tariq', place: 'Samundri',
    breed: 'Cobb', shed: 'Shed 3', arrival: '02 Nov 2026', placed: 2600, doa: 5, deaths: 210,
    ready: '20 Nov 2026', weight: '1.6 kg', notes: '', status: 'REJECTED',
    decision: { date: '20 Nov 2026', time: '09:15 AM', location: 'Al-Barkat Broiler Farm, Samundri', finding: 'Sick birds found across the shed.', reason: 'Flock not fit for dispatch.', certNo: '' },
    meds: [],
    events: [
      { title: 'Chicks Placed', sub: '2,600 chicks · 5 dead on arrival', date: '02 Nov 2026' },
      { title: 'Mortality', sub: '210 birds — grow-out losses', date: 'During grow-out' },
    ] },
];

// Vet certificates (vet.js certificates; the seed PDF has no bundled asset).
const certificates: Certificate[] = [
  { no: 'CERT-V3-241126', batch: 'LOT-G1-101126', farm: 'Green Valley Farm', issued: '24 Nov 2026', fileName: 'certificate-241126.pdf', url: '' },
];

// Slaughterhouse lots (plant.js lots).
const lots: Lot[] = [
  { id: 'LOT-S2-031226', disp: 'DISP-101B', batch: 'LOT-S2-031226', farm: 'Al-Barkat Broiler Farm', farmCode: 'F12', farmer: 'Haji Tariq',
    vehicle: 'LES-9900', driver: 'Abid', cert: 'CERT-V3-011226', received: 2000, status: 'AWAITING',
    receipt: null, slaughter: null, qc: null, packsCreated: false, packWeight: 1.2, dispatch: null },
  { id: 'LOT-S2-281126', disp: 'DISP-099A', batch: 'LOT-S2-281126', farm: 'Green Valley Farm', farmCode: '', farmer: 'Muhammad Aslam',
    vehicle: 'LES-19-342', driver: 'Naveed', cert: 'CERT-V3-261126', received: 1500, status: 'PACKED',
    receipt: { date: '28 Nov 2026', time: '07:40 AM', doa: 8, rejects: 2, defects: [{ type: 'Weak / sick', count: 2 }], disposition: 'Culled / destroyed', accepted: 1490, inspector: 'Dr. Imran Sheikh' },
    slaughter: { date: '28 Nov 2026', time: '09:05 AM', by: 'Muhammad Rafiq', byId: 'SL-014', method: 'Manual' },
    qc: { outcome: 'RELEASED', rejects: 12, reason: 'Bruising found', disposition: 'Condemned parts removed', chillStart: '28 Nov 2026 · 10:20 AM', chillEnd: '28 Nov 2026 · 02:20 PM', temp: '3.5', inspector: 'Dr. Imran Sheikh' },
    qcDone: true, packsCreated: true, packWeight: 1.2, dispatch: null },
  { id: 'LOT-S3-051226', disp: 'DISP-102A', batch: 'LOT-S3-051226', farm: 'Green Valley Farm', farmCode: '', farmer: 'Muhammad Aslam',
    vehicle: 'LES-19-342', driver: 'Naveed', cert: 'CERT-V3-021226', received: 2930, status: 'SENT',
    receipt: { date: '05 Dec 2026', time: '06:50 AM', doa: 6, rejects: 4, defects: [{ type: 'Weak / sick', count: 4 }], disposition: 'Culled / destroyed', accepted: 2920, inspector: 'Dr. Imran Sheikh' },
    slaughter: { date: '05 Dec 2026', time: '08:30 AM', by: 'Muhammad Rafiq', byId: 'SL-014', method: 'Manual' },
    qc: { outcome: 'RELEASED', rejects: 20, reason: 'Bruising found', disposition: 'Condemned parts removed', chillStart: '05 Dec 2026 · 09:45 AM', chillEnd: '05 Dec 2026 · 01:45 PM', temp: '3.8', inspector: 'Dr. Imran Sheikh' },
    qcDone: true, packsCreated: true, packWeight: 1.2,
    dispatch: { receiver: 'Imtiaz Mega Mart', packs: 2900, vehicle: 'LEB-2210', driver: 'Shahid', date: '05 Dec 2026' } },
  { id: 'LOT-S2-021226', disp: 'DISP-100C', batch: 'LOT-S2-021226', farm: 'Green Valley Farm', farmCode: '', farmer: 'Muhammad Aslam',
    vehicle: 'LES-19-342', driver: 'Naveed', cert: 'CERT-V3-301126', received: 1800, status: 'QC_HOLD',
    receipt: { date: '02 Dec 2026', time: '07:15 AM', doa: 10, rejects: 6, defects: [{ type: 'Weak / sick', count: 6 }], disposition: 'Culled / destroyed', accepted: 1784, inspector: 'Dr. Imran Sheikh' },
    slaughter: { date: '02 Dec 2026', time: '08:50 AM', by: 'Muhammad Rafiq', byId: 'SL-014', method: 'Manual' },
    qc: { outcome: 'HOLD', rejects: 18, reason: 'Bruising found', disposition: 'Condemned parts removed', chillStart: '02 Dec 2026 · 10:40 AM', chillEnd: '02 Dec 2026 · 02:40 PM', temp: '3.9', inspector: 'Dr. Imran Sheikh',
      hold: { reason: 'Chilling temperature variation', by: 'Dr. Imran Sheikh', recheck: '04 Dec 2026', note: 'In chiller till temperature settles.' } },
    qcDone: false, packsCreated: false, packWeight: 1.2, dispatch: null },
  { id: 'LOT-S2-041226', disp: 'DISP-103C', batch: 'LOT-S2-041226', farm: 'Green Valley Farm', farmCode: '', farmer: 'Muhammad Aslam',
    vehicle: 'LES-19-342', driver: 'Naveed', cert: 'CERT-V3-031226', received: 1600, status: 'IN_PROCESS',
    receipt: { date: '04 Dec 2026', time: '07:30 AM', doa: 10, rejects: 4, defects: [{ type: 'Weak / sick', count: 4 }], disposition: 'Culled / destroyed', accepted: 1586, inspector: 'Dr. Imran Sheikh' },
    slaughter: { date: '04 Dec 2026', time: '09:10 AM', by: 'Muhammad Rafiq', byId: 'SL-014', method: 'Manual' },
    qc: { outcome: 'RELEASED', rejects: 16, reason: 'Bruising found', disposition: 'Condemned parts removed', chillStart: '04 Dec 2026 · 10:15 AM', chillEnd: '04 Dec 2026 · 02:15 PM', temp: '3.4', inspector: 'Dr. Imran Sheikh' },
    qcDone: true, packsCreated: false, packWeight: 1.2, dispatch: null },
];

// Packs (plant.js allPacks: the first 8 packs of each packed lot, as rendered).
const packs: Pack[] = [
  ...['0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008'].map(n => ({ id: `PACK-S2-281126-${n}`, lotId: 'LOT-S2-281126', code: `PACK-S2-281126-${n}`, weight: 1.2, status: 'Packed' })),
  ...['0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008'].map(n => ({ id: `PACK-S3-051226-${n}`, lotId: 'LOT-S3-051226', code: `PACK-S3-051226-${n}`, weight: 1.2, status: 'Sent to Mart' })),
];

// Shop deliveries (shop.js deliveries).
const deliveries: Delivery[] = [
  { id: 'DISP-101A', batch: 'LOT-S2-031226',
    farm: 'Al-Barkat Broiler Farm', farmCode: 'F12', farmLicense: 'LIC-2026-006',
    farmPlace: 'Samundri, Faisalabad', farmer: 'Haji Tariq',
    cert: 'CERT-V3-011226', vet: 'Dr. Usman · Vet V3',
    birdsSent: 500, vehicle: 'FDN-4411', driver: 'Riaz', dispatchDate: '04 Dec 2026', dispatchTime: '08:15 AM',
    status: 'RECEIVED',
    farmDetail: '5,000 chicks placed · Cobb · Shed 2 · 500 birds loaded for the shop',
    receipt: { received: 500, doa: 4, cage: 'C-01', date: '04 Dec 2026', time: '10:05 AM', by: 'Zubair' } },
  { id: 'DISP-104A', batch: 'LOT-S2-101226',
    farm: 'Al-Barkat Broiler Farm', farmCode: 'F12', farmLicense: 'LIC-2026-006',
    farmPlace: 'Samundri, Faisalabad', farmer: 'Haji Tariq',
    cert: 'CERT-V3-091226', vet: 'Dr. Usman · Vet V3',
    birdsSent: 300, vehicle: 'FDN-4411', driver: 'Riaz', dispatchDate: '09 Dec 2026', dispatchTime: '07:40 AM',
    status: 'AWAITING',
    farmDetail: '300 birds loaded for the shop',
    receipt: null },
];

// Shop cages (shop.js cages).
const cages: Cage[] = [
  { id: 'C-01', delivery: 'DISP-101A', batch: 'LOT-S2-031226', received: 496, sold: 180,
    removals: [{ count: 2, reason: 'Died in cage', date: '06 Dec 2026' }], receivedDate: '04 Dec 2026' },
];

// Mart shipments (mart.js shipments).
const shipments: Shipment[] = [
  { id: 'DISP-102A', lot: 'LOT-S3-051226', batch: 'LOT-S3-051226',
    from: 'Punjab Fresh Abattoir', plantCode: 'S2', plantLicense: 'LIC-2026-008',
    farm: 'Green Valley Farm', farmPlace: 'Jaranwala, Faisalabad', farmer: 'Muhammad Aslam', cert: 'CERT-V3-021226',
    packsSent: 2900, vehicle: 'LEB-2210', driver: 'Shahid', dispatchDate: '05 Dec 2026', dispatchTime: '11:30 AM',
    status: 'RECEIVED',
    farmDetail: '3,000 chicks placed · 2,930 birds loaded for the plant',
    plantDetail: '2,930 birds received · 2,920 accepted after checks · 2,900 packs created · Dispatched 05 Dec 2026 · LEB-2210 · Driver Shahid',
    receipt: { received: 2900, damaged: 0, reason: '', temp: '3.6', date: '05 Dec 2026', time: '02:40 PM', by: 'Salman', evidence: '', outcome: 'RECEIVED' } },
  { id: 'DISP-103A', lot: 'LOT-S2-091226', batch: 'LOT-S2-091226',
    from: 'Punjab Fresh Abattoir', plantCode: 'S2', plantLicense: 'LIC-2026-008',
    farm: 'Green Valley Farm', farmPlace: 'Jaranwala, Faisalabad', farmer: 'Muhammad Aslam', cert: 'CERT-V3-081226',
    packsSent: 1500, vehicle: 'LEB-2210', driver: 'Shahid', dispatchDate: '08 Dec 2026', dispatchTime: '10:15 AM',
    status: 'AWAITING',
    farmDetail: 'Birds loaded for the plant',
    plantDetail: 'Packs created · Dispatched 08 Dec 2026 · LEB-2210 · Driver Shahid',
    receipt: null },
];

// Mart stock (mart.js packState rules for DISP-102A: 120 sold, 3 withdrawn, 2,777 available).
const stock: StockItem[] = [
  { id: 'DISP-102A', lotId: 'LOT-S3-051226', packs: 2900, available: 2777, sold: 120, withdrawn: 3 },
];

// Consumer packs (consumer.js lookup: LOT_S3, LOT_S2, CAGE, RECALL, WITHDRAWN_AT_MART).
const consumerPacks: ConsumerPack[] = [
  { code: 'PACK-S3-051226-0001', status: 'VERIFIED',
    trace: [
      { stage: 'Farm', title: 'Farm — Green Valley Farm', detail: 'Jaranwala, Faisalabad · Muhammad Aslam · Batch LOT-S3-051226\nRaised and grown at this farm · Sent to the plant for processing', when: '' },
      { stage: 'Vet', title: 'Vet — Dr. Usman · Vet V3', detail: 'Health checks & vaccination at the farm · Certificate CERT-V3-021226 · Flock cleared', when: '' },
      { stage: 'Plant', title: 'Plant — Punjab Fresh Abattoir (S2)', detail: 'Ante-mortem & post-mortem checks passed · Chilling 3.8 °C · Packed at the plant · Dispatched 05 Dec 2026 · Vehicle LEB-2210 · Driver Shahid', when: '05 Dec 2026' },
      { stage: 'Mart', title: 'Mart — Imtiaz Mega Mart, Faisalabad', detail: 'Received 05 Dec 2026 · 02:40 PM · Receiving temperature 3.6 °C · This pack is in stock at this mart', when: '05 Dec 2026' },
    ] },
  { code: 'PACK-S3-051226-2750', status: 'RECALLED',
    recall: { by: 'Punjab Fresh Abattoir (S2)', date: '07 Dec 2026', reason: 'Cold-chain break found in one dispatch compartment — this pack was recalled as a precaution.' },
    trace: [
      { stage: 'Farm', title: 'Farm — Green Valley Farm', detail: 'Jaranwala, Faisalabad · Muhammad Aslam · Batch LOT-S3-051226\nRaised and grown at this farm · Sent to the plant for processing', when: '' },
      { stage: 'Vet', title: 'Vet — Dr. Usman · Vet V3', detail: 'Health checks & vaccination at the farm · Certificate CERT-V3-021226 · Flock cleared', when: '' },
      { stage: 'Plant', title: 'Plant — Punjab Fresh Abattoir (S2)', detail: 'Ante-mortem & post-mortem checks passed · Chilling 3.8 °C · Packed at the plant · Dispatched 05 Dec 2026 · Vehicle LEB-2210 · Driver Shahid', when: '05 Dec 2026' },
      { stage: 'Mart', title: 'Mart — Imtiaz Mega Mart, Faisalabad', detail: 'This pack was recalled on 07 Dec 2026 — see the warning above', when: '07 Dec 2026' },
    ] },
  { code: 'PACK-S3-051226-1000', status: 'WITHDRAWN', withdrawnReason: 'Damaged',
    trace: [
      { stage: 'Farm', title: 'Farm — Green Valley Farm', detail: 'Jaranwala, Faisalabad · Muhammad Aslam · Batch LOT-S3-051226\nRaised and grown at this farm · Sent to the plant for processing', when: '' },
      { stage: 'Vet', title: 'Vet — Dr. Usman · Vet V3', detail: 'Health checks & vaccination at the farm · Certificate CERT-V3-021226 · Flock cleared', when: '' },
      { stage: 'Plant', title: 'Plant — Punjab Fresh Abattoir (S2)', detail: 'Ante-mortem & post-mortem checks passed · Chilling 3.8 °C · Packed at the plant · Dispatched 05 Dec 2026 · Vehicle LEB-2210 · Driver Shahid', when: '05 Dec 2026' },
      { stage: 'Mart', title: 'Mart — Imtiaz Mega Mart, Faisalabad', detail: 'Received 05 Dec 2026 · 02:40 PM · Receiving temperature 3.6 °C · This pack is in stock at this mart', when: '05 Dec 2026' },
    ] },
  { code: 'PACK-S2-281126-0001', status: 'VERIFIED',
    trace: [
      { stage: 'Farm', title: 'Farm — Green Valley Farm', detail: 'Jaranwala, Faisalabad · Muhammad Aslam · Batch LOT-S2-281126', when: '' },
      { stage: 'Vet', title: 'Vet — Dr. Usman · Vet V3', detail: 'Health checks & vaccination at the farm · Certificate CERT-V3-261126 · Flock cleared', when: '' },
      { stage: 'Plant', title: 'Plant — Punjab Fresh Abattoir (S2)', detail: 'Ante-mortem & post-mortem checks passed · Chilling 3.5 °C · Packed at the plant', when: '' },
    ] },
  { code: 'CAGE-C-01', status: 'VERIFIED',
    trace: [
      { stage: 'Farm', title: 'Farm — Al-Barkat Broiler Farm (F12)', detail: 'Samundri, Faisalabad · Haji Tariq · Batch LOT-S2-031226\nRaised and grown at this farm · Cobb · Shed 2 · Sent to the shop as live birds', when: '' },
      { stage: 'Vet', title: 'Vet — Dr. Usman · Vet V3', detail: 'Health checks & vaccination at the farm · Certificate CERT-V3-011226 · Flock cleared', when: '' },
      { stage: 'Transport', title: 'Dispatched by Farm', detail: 'Vehicle FDN-4411 · Driver Riaz\n04 Dec 2026 · 08:15 AM', when: '04 Dec 2026' },
      { stage: 'Shop', title: 'Shop — Madina Live Chicken Shop, Samanabad, Faisalabad', detail: 'Received 04 Dec 2026 · Kept in Cage C-01 · Live birds available at this shop', when: '04 Dec 2026' },
    ] },
];

// Consumer demo scans (consumer.js scans).
const scans: ScanEntry[] = [
  { code: 'PACK-S3-051226-2750', status: 'RECALLED', label: 'Mart pack · Green Valley Farm', date: '08 Dec 2026' },
  { code: 'PACK-S3-051226-0001', status: 'VERIFIED', label: 'Mart pack · Green Valley Farm', date: '08 Dec 2026' },
  { code: 'CAGE-C-01', status: 'VERIFIED', label: 'Live birds · Madina Live Chicken Shop', date: '05 Dec 2026' },
];

// Latest activity per role (each module's activity seed).
const activity: Record<Role, ActivityItem[]> = {
  admin: [
    { t: '5 applications received', s: 'Today · latest: Imtiaz Mega Mart, 11:02', c: 'amber' },
    { t: 'Batch LOT-S2-051226 completed', s: 'Green Valley Farm → Plant S2 · 2,900 packs', c: '' },
    { t: 'City Chicken Shop approved', s: '10 Nov 2026 · by Demo Admin', c: 'gray' },
  ],
  farm: [
    { t: 'Vet inspection approved — LOT-S2-031226', s: 'CERT-V3-011226 · Dr. Usman · Vet V3', c: '' },
    { t: 'Dispatch DISP-101B received — 1,980 birds', s: 'Punjab Fresh Abattoir · LES-9900', c: '' },
    { t: 'Dispatch DISP-101A received — 496 birds', s: 'Madina Live Chicken Shop · FDN-4411', c: '' },
    { t: 'Batch registered — LOT-S2-051226', s: '3,000 chicks · Ross · Shed 1', c: 'gray' },
    { t: 'Batch registered — LOT-S2-031226', s: '5,000 chicks · Cobb · Shed 2', c: 'gray' },
  ],
  vet: [
    { t: 'Inspection requested — LOT-S2-031226', s: 'Al-Barkat Broiler Farm · F12 · 4,870 live', c: 'amber' },
    { t: 'Inspection requested — LOT-G1-241126', s: 'Green Valley Farm · Jaranwala · 3,897 live', c: 'amber' },
    { t: 'Batch placed on hold — LOT-S3-151126', s: 'Al-Barkat Broiler Farm · F12 · Recheck after 3 days', c: 'amber' },
    { t: 'Certificate issued — CERT-V3-241126', s: 'LOT-G1-101126 · Green Valley Farm', c: '' },
    { t: 'Batch rejected — LOT-S3-021126', s: 'Al-Barkat Broiler Farm · F12 · Flock not fit for dispatch', c: 'red' },
  ],
  plant: [
    { t: 'QC recorded — LOT-S2-041226', s: 'Released to packaging · 1,570 birds ready for packs', c: '' },
    { t: 'Packs dispatched to Mart — LOT-S3-051226', s: '2,900 packs · Imtiaz Mega Mart · LEB-2210', c: '' },
    { t: 'Packs created — LOT-S3-051226', s: '2,900 packs · PACK-S3-051226-0001 onward', c: '' },
    { t: 'Receipt confirmed — DISP-102A', s: 'Green Valley Farm · 2,920 accepted', c: '' },
    { t: 'New dispatch arrived — DISP-101B', s: 'Al-Barkat Broiler Farm · F12 · 2,000 birds · LES-9900', c: 'amber' },
    { t: 'Lot put on QC Hold — LOT-S2-021226', s: 'Chilling temperature variation · Re-check 04 Dec 2026', c: 'amber' },
  ],
  shop: [
    { t: 'Delivery dispatched — DISP-104A', s: 'Al-Barkat Broiler Farm (F12) · 300 birds · FDN-4411', c: 'amber' },
    { t: '2 birds removed — Cage C-01', s: 'Died in cage · 06 Dec 2026', c: 'amber' },
    { t: '180 birds sold', s: 'Cage C-01 · Madina Live Chicken Shop', c: '' },
    { t: 'Delivery received — DISP-101A', s: '496 birds into Cage C-01 · Al-Barkat Broiler Farm (F12) · FDN-4411', c: '' },
  ],
  mart: [
    { t: 'Shipment dispatched — DISP-103A', s: 'Punjab Fresh Abattoir · 1,500 packs · LEB-2210', c: 'amber' },
    { t: 'Pack withdrawn — PACK-S3-051226-2899', s: 'Damaged · Removed from stock', c: 'amber' },
    { t: '120 packs sold', s: 'Imtiaz Mega Mart — Faisalabad', c: '' },
    { t: 'Shipment received — DISP-102A', s: '2,900 packs · Punjab Fresh Abattoir (S2) · LEB-2210', c: '' },
  ],
  consumer: [],
};

// Notifications per role (each module's notifications seed).
const notifications: Record<Role, AppNotification[]> = {
  admin: [
    { t: 'New application received', s: 'Imtiaz Mega Mart · Mart · 18 Nov 2026, 11:02', c: 'amber' },
    { t: 'New application received', s: 'Punjab Fresh Abattoir · Slaughterhouse · 18 Nov 2026, 10:31', c: 'amber' },
    { t: 'New application received', s: 'Madina Live Chicken Shop · Shop · 18 Nov 2026, 10:05', c: 'amber' },
    { t: 'New application received', s: 'Usman Veterinary Clinic · Vet · 18 Nov 2026, 09:40', c: 'amber' },
    { t: 'New application received', s: 'Al-Barkat Broiler Farm · Farm · 18 Nov 2026, 09:12', c: 'amber' },
  ],
  farm: [
    { t: 'Vet inspection approved', s: 'LOT-S2-031226 · CERT-V3-011226 · Dr. Usman', c: '' },
    { t: 'Dispatch received', s: 'DISP-101B · Punjab Fresh Abattoir · 1,980 received', c: '' },
    { t: 'Dispatch received', s: 'DISP-101A · Madina Live Chicken Shop · 496 received', c: '' },
    { t: 'Withdrawal period recorded', s: 'Enrofloxacin · LOT-S2-031226 · ends 29 Oct 2026', c: 'amber' },
  ],
  vet: [
    { t: 'New inspection request', s: 'LOT-S2-031226 · Al-Barkat Broiler Farm · F12', c: 'amber' },
    { t: 'New inspection request', s: 'LOT-G1-241126 · Green Valley Farm · Jaranwala', c: 'amber' },
    { t: 'Certificate issued', s: 'CERT-V3-241126 · LOT-G1-101126 · Green Valley Farm', c: '' },
  ],
  plant: [
    { t: 'New dispatch arrived', s: 'DISP-101B · Al-Barkat Broiler Farm · 2,000 birds', c: 'amber' },
    { t: 'Packs dispatched to Mart', s: 'LOT-S3-051226 · 2,900 packs · Imtiaz Mega Mart', c: '' },
    { t: 'QC completed', s: 'LOT-S3-051226 · Released · Chilling 3.8 °C', c: '' },
    { t: 'Lot put on QC Hold', s: 'LOT-S2-021226 · Chilling temperature variation · Re-check 04 Dec 2026', c: 'amber' },
  ],
  shop: [
    { t: 'New delivery dispatched', s: 'DISP-104A · Al-Barkat Broiler Farm (F12) · 300 birds · FDN-4411', c: 'amber' },
    { t: 'Delivery received', s: 'DISP-101A · 496 birds accepted into Cage C-01 · 4 DOA', c: '' },
  ],
  mart: [
    { t: 'New shipment dispatched', s: 'DISP-103A · Punjab Fresh Abattoir · 1,500 packs · LEB-2210', c: 'amber' },
    { t: 'Shipment received', s: 'DISP-102A · 2,900 packs accepted · Receiving temperature 3.6 °C', c: '' },
    { t: 'Pack withdrawn', s: 'PACK-S3-051226-2899 · Damaged', c: 'amber' },
  ],
  consumer: [
    { t: 'Recall alert', s: 'PACK-S3-051226-2750 · Recalled 07 Dec 2026 · Do not eat — return it to Imtiaz Mega Mart', c: 'red' },
    { t: 'Pack verified', s: 'PACK-S3-051226-0001 · Green Valley Farm · Imtiaz Mega Mart, Faisalabad', c: '' },
    { t: 'Welcome to TraceHen', s: 'Scan any pack or cage QR to see where your chicken came from', c: '' },
  ],
};

// One shared dataset (adminBatches/dispatches/adminActivity/adminNotifications
// are the same seed collections under the names the store reads).
const demoDataSeed: DemoData = {
  applications,
  organizations,
  batches,
  adminBatches: batches,
  farmBatches,
  farmDispatches,
  dispatches: farmDispatches,
  farmEvents,
  inspections,
  certificates,
  lots,
  packs,
  deliveries,
  cages,
  shipments,
  stock,
  consumerPacks,
  scans,
  activity,
  notifications,
  adminActivity: activity.admin,
  adminNotifications: notifications.admin,
};

// Fresh deep copy of the whole dataset on every call.
export function createDemoData(): DemoData {
  return JSON.parse(JSON.stringify(demoDataSeed)) as DemoData;
}
