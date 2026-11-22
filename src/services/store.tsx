// TraceHen AppStore — the single source of truth for app state.
// Mirrors the locked HTML's shell bridge (__TH) + per-module state, in React.
// Session-only (in-memory): a reload resets to the demo accounts/data, exactly
// like the HTML demo. The real app (backend) will persist this.
// Business logic lives here; screens only render and call these actions.

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { getColors } from '../theme/colors';
import type { ThemeColors, ThemeName } from '../theme/colors';
import { createDemoData, demoAccounts } from '../data/demoData';
import type {
  ActivityItem,
  AppNotification,
  AppUser,
  Application,
  ApplicationRole,
  Batch,
  ConsumerPack,
  Delivery,
  DemoData,
  Dispatch,
  FarmBatch,
  Lot,
  Organization,
  Role,
  RoleDetail,
} from '../types/models';

// ---------- Types ----------

export interface SavedLogin {
  name: string;
  pass: string;
  role: Role;
}

export interface ForgotState {
  open: boolean;
  step: 1 | 2 | 3 | 4;
  email: string;
  code: string;
  codeExpiresAt: number;
  resendAt: number;
  accountName: string;
  error: string;
}

export interface PinPick {
  role: Role;
  label: string;
  address: string;
}

export interface AppContextValue {
  // Theme
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
  // Auth / registry
  currentUser: AppUser | null;
  users: AppUser[];
  signUp: (input: SignUpInput) => { ok: boolean; error?: string; status?: string };
  signIn: (username: string, password: string) => { ok: boolean; error?: string; user?: AppUser };
  signOut: () => void;
  changePassword: (currentPass: string, newPass: string, confirmPass: string) => { ok: boolean; error?: string };
  findUser: (nameOrEmail: string) => AppUser | undefined;
  findUserByEmail: (email: string) => AppUser | undefined;
  // Approval (Admin)
  applications: Application[];
  organizations: Organization[];
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string, reason: string) => void;
  requestMoreInfo: (appId: string, reason: string) => void;
  suspendOrganization: (orgId: string, reason?: string) => void;
  // Admin "New application alerts" setting (Settings toggle). When off, a new
  // application does not increase the Admin bell badge.
  adminAlertsEnabled: boolean;
  setAdminAlertsEnabled: (on: boolean) => void;
  // Data (shared system dataset + per-user scope)
  data: DemoData;
  scopeKey: string;
  // Notifications / activity (current user)
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationsRead: () => void;
  activity: ActivityItem[];
  // Forgot password
  forgot: ForgotState;
  startForgot: (email: string) => { ok: boolean; error?: string };
  verifyForgotCode: (code: string) => { ok: boolean; error?: string };
  resendForgotCode: () => { ok: boolean; error?: string };
  resetForgotPassword: (pass: string, pass2: string) => { ok: boolean; error?: string };
  closeForgot: () => void;
  // Remembered logins (session-only, per login form)
  remembered: Record<string, SavedLogin[]>;
  recordRemember: (formKey: string, login: SavedLogin, remember: boolean) => void;
  forgetRemembered: (formKey: string, name: string) => void;
  updateRememberedPassword: (name: string, pass: string) => void;
  // Map pin (sign-up site pin)
  pendingPin: PinPick | null;
  setPendingPin: (pin: PinPick) => void;
  clearPendingPin: () => void;
  // Chain actions (cross-role, entries only — never a gate/block)
  registerBatch: (batch: FarmBatch) => void;
  requestVet: (batchId: string, date: string) => void;
  createDispatch: (dispatch: Dispatch) => void;
  // Generic data + notification API (modules use these for their own flows,
  // e.g. a receipt flips a dispatch to RECEIVED and notifies the Farm).
  updateData: (updater: (prev: DemoData) => DemoData) => void;
  notify: (username: string, n: AppNotification) => void;
  logActivity: (username: string, a: ActivityItem) => void;
  // Admin batch sync
  adminBatches: Batch[];
  // Consumer scan
  lookupPack: (code: string) => ConsumerPack | undefined;
  // Demo helpers
  demoPassword: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: Role;
  business: string;
  address: string;
  district: string;
  license: string;
  regNumber: string;
  capacity: string;
  pinSet: boolean;
  docs: { name: string; type: 'pdf' | 'image'; file: string }[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}

// Demo account names (exact demo identity — these users see the demo data).
const DEMO_NAMES = new Set(demoAccounts.map(a => a.name.toLowerCase()));

function scopeFor(user: AppUser | null): string {
  if (!user) {
    return '__demo__';
  }
  return DEMO_NAMES.has(user.name.toLowerCase()) ? '__demo__' : `u:${user.name}`;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

// Lowercase route role -> the capitalized role label stored on applications
// and organizations in the seeds ('Farm', 'Vet', 'Slaughterhouse', ...).
function roleLabel(role: Role): ApplicationRole {
  switch (role) {
    case 'farm':
      return 'Farm';
    case 'vet':
      return 'Vet';
    case 'plant':
      return 'Slaughterhouse';
    case 'shop':
      return 'Shop';
    case 'mart':
      return 'Mart';
    default:
      return 'Farm';
  }
}

// Deaths for a farm batch are computed from its death events (the seed does
// not store deaths/live as fields); live = placed - DOA - deaths.
function batchDeaths(batch: FarmBatch): number {
  return (batch.events ?? [])
    .filter(e => e.type === 'death' || e.type === 'deaths' || e.title.toLowerCase().includes('death'))
    .reduce((sum, e) => sum + (e.count ?? 0), 0);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('light');
  const colors = useMemo(() => getColors(theme), [theme]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- Registry (users) ----
  const [users, setUsers] = useState<AppUser[]>(() => clone(demoAccounts));
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // ---- Shared system dataset (demo seeds; the "world") ----
  const [systemData, setSystemData] = useState<DemoData>(() => createDemoData());

  // ---- Per-user data stores (new users start EMPTY; demo users use systemData) ----
  const [userStores, setUserStores] = useState<Record<string, Partial<DemoData>>>({});

  // ---- Admin applications / organizations (shared console) ----
  const [applications, setApplications] = useState<Application[]>(() => clone(systemData.applications));
  const [organizations, setOrganizations] = useState<Organization[]>(() => clone(systemData.organizations));

  // ---- Notifications + activity (keyed by username, lowercased) ----
  // Seeded from the demo data's per-role lists (so each demo account opens
  // with its own notifications/activity, exactly as the HTML shows). A newly
  // registered user starts with empty lists (their own key is added on sign-up).
  const [notifMap, setNotifMap] = useState<Record<string, AppNotification[]>>(() => {
    const m: Record<string, AppNotification[]> = {};
    demoAccounts.forEach(u => {
      m[u.name.toLowerCase()] = clone(systemData.notifications[u.role] ?? []);
    });
    return m;
  });
  const [activityMap, setActivityMap] = useState<Record<string, ActivityItem[]>>(() => {
    const m: Record<string, ActivityItem[]> = {};
    demoAccounts.forEach(u => {
      m[u.name.toLowerCase()] = clone(systemData.activity[u.role] ?? []);
    });
    return m;
  });

  // ---- Remembered logins (session-only, per login form key) ----
  const [remembered, setRemembered] = useState<Record<string, SavedLogin[]>>({});

  // ---- Forgot password ----
  const [forgot, setForgot] = useState<ForgotState>({
    open: false,
    step: 1,
    email: '',
    code: '',
    codeExpiresAt: 0,
    resendAt: 0,
    accountName: '',
    error: '',
  });

  // ---- Map pin (pending, for the sign-up form) ----
  const [pendingPin, setPendingPinState] = useState<PinPick | null>(null);

  // ---- Admin "New application alerts" setting (default on) ----
  const [adminAlertsEnabled, setAdminAlertsEnabled] = useState<boolean>(true);

  const scopeKey = scopeFor(currentUser);

  // The data the current user sees for their role: demo users see the system
  // dataset; a new (non-demo) user sees their own store (empty at first).
  const data: DemoData = useMemo(() => {
    if (scopeKey === '__demo__' || !currentUser) {
      return systemData;
    }
    const own = userStores[scopeKey];
    if (!own) {
      return systemData;
    }
    return { ...systemData, ...own } as DemoData;
  }, [scopeKey, currentUser, systemData, userStores]);

  // ---------- Theme ----------
  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
  }, []);
  const toggleTheme = useCallback(() => {
    setThemeState(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  // ---------- Toast ----------
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 3400);
  }, []);

  // ---------- Auth helpers ----------
  const findUser = useCallback(
    (nameOrEmail: string): AppUser | undefined => {
      const key = nameOrEmail.trim().toLowerCase();
      return users.find(
        u => u.name.toLowerCase() === key || (u.email && u.email.toLowerCase() === key),
      );
    },
    [users],
  );

  const findUserByEmail = useCallback(
    (email: string): AppUser | undefined => {
      const key = email.trim().toLowerCase();
      return users.find(u => u.email && u.email.toLowerCase() === key);
    },
    [users],
  );

  const pushNotif = useCallback((username: string, n: AppNotification) => {
    const key = username.toLowerCase();
    setNotifMap(prev => ({
      ...prev,
      [key]: [{ ...n, read: false }, ...(prev[key] ?? [])],
    }));
  }, []);

  const pushActivityFor = useCallback((username: string, a: ActivityItem) => {
    const key = username.toLowerCase();
    setActivityMap(prev => ({
      ...prev,
      [key]: [{ ...a }, ...(prev[key] ?? [])].slice(0, 6),
    }));
  }, []);

  const notifications: AppNotification[] = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    return notifMap[currentUser.name.toLowerCase()] ?? [];
  }, [currentUser, notifMap]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );

  const activity: ActivityItem[] = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    return activityMap[currentUser.name.toLowerCase()] ?? [];
  }, [currentUser, activityMap]);

  const markNotificationsRead = useCallback(() => {
    if (!currentUser) {
      return;
    }
    const key = currentUser.name.toLowerCase();
    setNotifMap(prev => ({
      ...prev,
      [key]: (prev[key] ?? []).map(n => ({ ...n, read: true })),
    }));
  }, [currentUser]);

  // ---------- Sign up ----------
  const signUp = useCallback(
    (input: SignUpInput): { ok: boolean; error?: string; status?: string } => {
      if (!input.name.trim()) {
        return { ok: false, error: 'Please enter your full name.' };
      }
      if (!input.email.trim() || !/^\S+@\S+\.\S+$/.test(input.email.trim())) {
        return { ok: false, error: 'Please enter a valid email address.' };
      }
      if (input.password.length < 8) {
        return { ok: false, error: 'Password must be at least 8 characters.' };
      }
      if (!input.role) {
        return { ok: false, error: 'Please select your role.' };
      }
      if (findUser(input.name) || findUserByEmail(input.email)) {
        return { ok: false, error: 'An account with this name or email already exists.' };
      }
      if (input.role === 'consumer') {
        // Consumer: immediately ACTIVE, no Admin approval, no application.
        const user: AppUser = {
          name: input.name.trim(),
          email: input.email.trim(),
          password: input.password,
          role: 'consumer',
          business: input.name.trim(),
          license: '',
          status: 'ACTIVE',
          appId: '',
          notifs: [],
        };
        setUsers(prev => [...prev, user]);
        setCurrentUser(user);
        return { ok: true, status: 'ACTIVE' };
      }
      // Business role: create a PENDING application for Admin review.
      // Role details, exactly as the locked HTML sign-up builds them:
      // farm: License only; vet: Vet registration no. + License;
      // plant: Daily capacity + License; shop: none. (Sheds/Capacity are
      // NOT collected at farm sign-up — demo seed data only.)
      const appId = `app-${Date.now()}`;
      const roleDetails: RoleDetail[] =
        input.role === 'vet'
          ? [
              ['Vet registration no.', input.regNumber.trim()],
              ['License', input.license.trim()],
            ]
          : input.role === 'plant'
            ? [
                ['Daily capacity', input.capacity.trim()],
                ['License', input.license.trim()],
              ]
            : input.role === 'shop'
              ? []
              : [['License', input.license.trim()]];
      const app: Application = {
        id: appId,
        person: input.name.trim(),
        phone: input.mobile.trim(),
        phoneVerified: true,
        business: input.business.trim(),
        role: roleLabel(input.role),
        district: input.district.trim(),
        tehsil: input.district.trim(),
        address: input.address.trim(),
        status: 'PENDING',
        createdVia: 'SELF_REGISTER',
        license: input.license.trim(),
        submitted: 'Just now',
        roleDetails,
        documents: input.docs,
        sites: [{ name: input.business.trim(), place: input.address.trim() }],
        history: [{ t: 'Application submitted', s: 'Just now', c: '' }],
      };
      const user: AppUser = {
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
        role: input.role,
        business: input.business.trim(),
        license: input.license.trim(),
        status: 'PENDING',
        appId,
        notifs: [],
      };
      setApplications(prev => [app, ...prev]);
      setUsers(prev => [...prev, user]);
      // Admin bell: new application received (the ONLY Admin notification).
      // Gated by the Admin's "New application alerts" setting.
      if (adminAlertsEnabled) {
        pushNotif('Demo Admin', {
          t: 'New application received',
          s: `${input.business.trim()} · ${roleLabel(input.role)} · Just now`,
          c: 'amber',
          read: false,
        });
      }
      pushActivityFor('Demo Admin', {
        t: 'New application received',
        s: `${input.business.trim()} · ${input.role}`,
        c: 'amber',
      });
      return { ok: true, status: 'PENDING' };
    },
    [findUser, findUserByEmail, pushNotif, pushActivityFor, adminAlertsEnabled],
  );

  // ---------- Sign in ----------
  const signIn = useCallback(
    (username: string, password: string): { ok: boolean; error?: string; user?: AppUser } => {
      const user = findUser(username);
      if (!user) {
        // Demo-permissive fallback (as in the HTML): an unknown name signs in
        // by routing to the role implied by the name is NOT done here — the
        // HTML routes unknown names permissively. Keep the registry as the
        // source of truth; unknown names are rejected with a clear error.
        return { ok: false, error: 'No account found with this username or email.' };
      }
      if (user.password !== password) {
        return { ok: false, error: 'Incorrect password.' };
      }
      if (user.status === 'PENDING') {
        return { ok: false, error: 'Account pending — Admin has not approved it yet.' };
      }
      if (user.status === 'NEEDS_INFO') {
        return { ok: false, error: 'Admin requested more information. Please check your application.' };
      }
      if (user.status === 'REJECTED') {
        return { ok: false, error: 'Your application was rejected by Admin.' };
      }
      setCurrentUser(user);
      // Queue the approval notification (if any) as a toast on first sign-in.
      const queued = (user.notifs ?? []).filter(n => !n.read);
      if (queued.length > 0) {
        showToast(queued[0].t);
        setUsers(prev =>
          prev.map(u =>
            u.name === user.name ? { ...u, notifs: (u.notifs ?? []).map(n => ({ ...n, read: true })) } : u,
          ),
        );
      }
      return { ok: true, user };
    },
    [findUser, showToast],
  );

  const signOut = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // ---------- Remembered logins (session-only) ----------
  const recordRemember = useCallback((formKey: string, login: SavedLogin, remember: boolean) => {
    setRemembered(prev => {
      const list = [...(prev[formKey] ?? [])];
      const idx = list.findIndex(l => l.name.toLowerCase() === login.name.toLowerCase());
      if (remember) {
        if (idx >= 0) {
          list[idx] = login;
        } else {
          list.push(login);
        }
      } else if (idx >= 0) {
        list.splice(idx, 1);
      }
      return { ...prev, [formKey]: list };
    });
  }, []);

  const forgetRemembered = useCallback((formKey: string, name: string) => {
    setRemembered(prev => ({
      ...prev,
      [formKey]: (prev[formKey] ?? []).filter(l => l.name.toLowerCase() !== name.toLowerCase()),
    }));
  }, []);

  const updateRememberedPassword = useCallback((name: string, pass: string) => {
    setRemembered(prev => {
      const next: Record<string, SavedLogin[]> = {};
      Object.keys(prev).forEach(k => {
        next[k] = prev[k].map(l => (l.name.toLowerCase() === name.toLowerCase() ? { ...l, pass } : l));
      });
      return next;
    });
  }, []);

  // ---------- Change password (Settings) ----------
  const changePassword = useCallback(
    (currentPass: string, newPass: string, confirmPass: string): { ok: boolean; error?: string } => {
      if (!currentUser) {
        return { ok: false, error: 'Please sign in first.' };
      }
      if (currentUser.password !== currentPass) {
        return { ok: false, error: 'Current password is wrong.' };
      }
      if (newPass.length < 8) {
        return { ok: false, error: 'New password must be at least 8 characters.' };
      }
      if (newPass === currentPass) {
        return { ok: false, error: 'New password must be different from the old one.' };
      }
      if (newPass !== confirmPass) {
        return { ok: false, error: 'Passwords do not match.' };
      }
      setUsers(prev => prev.map(u => (u.name === currentUser.name ? { ...u, password: newPass } : u)));
      setCurrentUser({ ...currentUser, password: newPass });
      updateRememberedPassword(currentUser.name, newPass);
      return { ok: true };
    },
    [currentUser, updateRememberedPassword],
  );

  // ---------- Approval (Admin) ----------
  const syncUserFromAdmin = useCallback((appId: string, status: AppUser['status'], note: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.appId !== appId) {
          return u;
        }
        const updated: AppUser = { ...u, status, notifs: [...(u.notifs ?? [])] };
        if (note) {
          updated.notifs = [
            { t: note, s: 'From Admin · Just now', c: status === 'ACTIVE' ? '' : 'amber', read: false },
            ...updated.notifs,
          ];
        }
        return updated;
      }),
    );
    // If the applicant is signed in, push to their own bell too.
    setUsers(prev => prev);
  }, []);

  const approveApplication = useCallback(
    (appId: string) => {
      const app = applications.find(a => a.id === appId);
      if (!app) {
        return;
      }
      setApplications(prev =>
        prev.map(a =>
          a.id === appId
            ? {
                ...a,
                status: 'APPROVED',
                history: [{ t: 'Application approved by Demo Admin', s: 'Just now', c: '' }, ...a.history],
              }
            : a,
        ),
      );
      // Create the live organization from the application.
      const org: Organization = {
        id: `org-${appId}`,
        name: app.business,
        type: app.role,
        owner: app.person,
        phone: app.phone,
        tehsil: app.tehsil,
        district: app.district,
        status: 'ACTIVE',
        createdVia: 'SELF_REGISTER',
        license: app.license,
        sites: app.sites,
        members: [{ name: app.person, role: 'Owner', status: 'ACTIVE' }],
        history: [{ t: 'Application approved by Demo Admin', s: 'Just now', c: '' }],
        appId,
      };
      setOrganizations(prev => [org, ...prev]);
      syncUserFromAdmin(appId, 'ACTIVE', 'Your application has been approved');
      // Notify the applicant's own bell (queued if not signed in).
      pushNotif(app.person, {
        t: 'Your application has been approved',
        s: `${app.business} · you can now sign in`,
        c: '',
        read: false,
      });
      pushActivityFor('Demo Admin', {
        t: `${app.business} approved`,
        s: 'Just now · by Demo Admin',
        c: '',
      });
    },
    [applications, syncUserFromAdmin, pushNotif, pushActivityFor],
  );

  const rejectApplication = useCallback(
    (appId: string, reason: string) => {
      const app = applications.find(a => a.id === appId);
      if (!app) {
        return;
      }
      setApplications(prev =>
        prev.map(a =>
          a.id === appId
            ? {
                ...a,
                status: 'REJECTED',
                history: [{ t: `Application rejected by Demo Admin: ${reason}`, s: 'Just now', c: 'red' }, ...a.history],
              }
            : a,
        ),
      );
      syncUserFromAdmin(appId, 'REJECTED', `Your application was rejected: ${reason}`);
      pushNotif(app.person, {
        t: 'Your application was rejected',
        s: reason,
        c: 'red',
        read: false,
      });
      pushActivityFor('Demo Admin', { t: `${app.business} rejected`, s: 'Just now · by Demo Admin', c: 'red' });
    },
    [applications, syncUserFromAdmin, pushNotif, pushActivityFor],
  );

  const requestMoreInfo = useCallback(
    (appId: string, reason: string) => {
      const app = applications.find(a => a.id === appId);
      if (!app) {
        return;
      }
      setApplications(prev =>
        prev.map(a =>
          a.id === appId
            ? {
                ...a,
                status: 'NEEDS_INFO',
                history: [{ t: `More information requested by Demo Admin: ${reason}`, s: 'Just now', c: 'amber' }, ...a.history],
              }
            : a,
        ),
      );
      syncUserFromAdmin(appId, 'NEEDS_INFO', `Admin requested more information: ${reason}`);
      pushNotif(app.person, {
        t: 'Admin requested more information',
        s: reason,
        c: 'amber',
        read: false,
      });
      pushActivityFor('Demo Admin', {
        t: `${app.business} — more info requested`,
        s: 'Just now · by Demo Admin',
        c: 'amber',
      });
    },
    [applications, syncUserFromAdmin, pushNotif, pushActivityFor],
  );

  const suspendOrganization = useCallback(
    (orgId: string, reason?: string) => {
      const org = organizations.find(o => o.id === orgId);
      if (!org) {
        return;
      }
      const suspending = org.status !== 'SUSPENDED';
      const historyText = suspending
        ? `Organization suspended by Demo Admin${reason ? `: ${reason}` : ''}`
        : 'Organization re-activated by Demo Admin';
      setOrganizations(prev =>
        prev.map(o =>
          o.id === orgId
            ? {
                ...o,
                status: suspending ? 'SUSPENDED' : 'ACTIVE',
                history: [
                  { t: historyText, s: 'Just now', c: suspending ? 'red' : '' },
                  ...o.history,
                ],
              }
            : o,
        ),
      );
      pushNotif(org.owner, {
        t: suspending ? 'Your organization was suspended' : 'Your organization was re-activated',
        s: `${org.name} · by Demo Admin${suspending && reason ? ` · ${reason}` : ''}`,
        c: suspending ? 'red' : '',
        read: false,
      });
      pushActivityFor('Demo Admin', {
        t: `${org.name} ${suspending ? 'suspended' : 're-activated'}`,
        s: `Just now · by Demo Admin${suspending && reason ? ` · ${reason}` : ''}`,
        c: suspending ? 'red' : '',
      });
    },
    [organizations, pushNotif, pushActivityFor],
  );

  // ---------- Forgot password ----------
  const startForgot = useCallback(
    (email: string): { ok: boolean; error?: string } => {
      const user = findUserByEmail(email);
      if (!user) {
        return { ok: false, error: 'No account found with this email address.' };
      }
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setForgot({
        open: true,
        step: 2,
        email: email.trim(),
        code,
        codeExpiresAt: Date.now() + 10 * 60 * 1000,
        resendAt: Date.now() + 30 * 1000,
        accountName: user.name,
        error: '',
      });
      return { ok: true };
    },
    [findUserByEmail],
  );

  const verifyForgotCode = useCallback(
    (code: string): { ok: boolean; error?: string } => {
      if (Date.now() > forgot.codeExpiresAt) {
        setForgot(f => ({ ...f, error: 'This code has expired. Please request a new one.' }));
        return { ok: false, error: 'This code has expired. Please request a new one.' };
      }
      if (code.trim() !== forgot.code) {
        setForgot(f => ({ ...f, error: 'Incorrect code. Please try again.' }));
        return { ok: false, error: 'Incorrect code. Please try again.' };
      }
      setForgot(f => ({ ...f, step: 3, error: '' }));
      return { ok: true };
    },
    [forgot.code, forgot.codeExpiresAt],
  );

  const resendForgotCode = useCallback((): { ok: boolean; error?: string } => {
    if (Date.now() < forgot.resendAt) {
      return { ok: false, error: 'Please wait before requesting a new code.' };
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setForgot(f => ({
      ...f,
      code,
      codeExpiresAt: Date.now() + 10 * 60 * 1000,
      resendAt: Date.now() + 30 * 1000,
      error: '',
    }));
    return { ok: true };
  }, [forgot.resendAt]);

  const resetForgotPassword = useCallback(
    (pass: string, pass2: string): { ok: boolean; error?: string } => {
      if (pass.length < 8) {
        setForgot(f => ({ ...f, error: 'Password must be at least 8 characters.' }));
        return { ok: false, error: 'Password must be at least 8 characters.' };
      }
      if (pass !== pass2) {
        setForgot(f => ({ ...f, error: 'Passwords do not match.' }));
        return { ok: false, error: 'Passwords do not match.' };
      }
      const user = findUserByEmail(forgot.email);
      if (!user) {
        return { ok: false, error: 'Account not found.' };
      }
      if (user.password === pass) {
        setForgot(f => ({ ...f, error: 'New password must be different from the old one.' }));
        return { ok: false, error: 'New password must be different from the old one.' };
      }
      setUsers(prev => prev.map(u => (u.name === user.name ? { ...u, password: pass } : u)));
      updateRememberedPassword(user.name, pass);
      setForgot(f => ({ ...f, step: 4, error: '' }));
      return { ok: true };
    },
    [findUserByEmail, forgot.email, updateRememberedPassword],
  );

  const closeForgot = useCallback(() => {
    setForgot({
      open: false,
      step: 1,
      email: '',
      code: '',
      codeExpiresAt: 0,
      resendAt: 0,
      accountName: '',
      error: '',
    });
  }, []);

  // ---------- Map pin ----------
  const setPendingPin = useCallback((pin: PinPick) => {
    setPendingPinState(pin);
  }, []);
  const clearPendingPin = useCallback(() => {
    setPendingPinState(null);
  }, []);

  // ---------- Chain actions (entries only — never a gate/block) ----------
  // registerBatch / requestVet / createDispatch are the main cross-role entry
  // points (they update the data AND notify the right role). For a module's own
  // flow (e.g. a receipt flips a dispatch to RECEIVED), the module calls
  // updateData (data) + notify (the other role's bell) directly.
  const registerBatch = useCallback(
    (batch: FarmBatch) => {
      // A new batch goes to the current user's own store (new users start
      // empty) and is mirrored to Admin (batch count + list + detail).
      setUserStores(prev => {
        const own = clone(prev[scopeKey] ?? {}) as Partial<DemoData>;
        const list = [...(own.farmBatches ?? []), batch];
        return { ...prev, [scopeKey]: { ...own, farmBatches: list } };
      });
      setSystemData(prev => {
        const deaths = batchDeaths(batch);
        const live = batch.placed - batch.doa - deaths;
        return {
          ...prev,
          farmBatches: [...prev.farmBatches, batch],
          adminBatches: [
            ...prev.adminBatches,
            {
              id: batch.id,
              farm: currentUser?.business ?? '',
              plant: '',
              status: 'Active',
              placed: batch.placed,
              doa: batch.doa,
              deaths,
              loaded: live,
              atPlant: 0,
              packs: 0,
              timeline: [],
            } as Batch,
          ],
        };
      });
      pushActivityFor(currentUser?.name ?? '', {
        t: `Batch ${batch.id} registered`,
        s: `${batch.placed.toLocaleString('en-US')} chicks placed`,
        c: '',
      });
    },
    [scopeKey, currentUser, pushActivityFor],
  );

  const requestVet = useCallback(
    (batchId: string, date: string) => {
      // Farm inspection request -> Vet gets the inspection + bell notification.
      const vetName = 'Dr. Usman';
      pushNotif(vetName, {
        t: 'Vet inspection requested',
        s: `Batch ${batchId} · preferred visit ${date}`,
        c: '',
        read: false,
      });
      pushActivityFor(currentUser?.name ?? '', {
        t: `Vet inspection requested for ${batchId}`,
        s: `Preferred visit ${date}`,
        c: '',
      });
    },
    [currentUser, pushNotif, pushActivityFor],
  );

  const createDispatch = useCallback(
    (dispatch: Dispatch) => {
      // The dispatch itself + the receiver's awaiting record, so the cross-role
      // flow works for a newly registered farm too (not just the demo seeds):
      // a Slaughterhouse dispatch creates an AWAITING lot at the Plant; a Shop
      // dispatch creates an AWAITING delivery at the Shop.
      setSystemData(prev => {
        const next: DemoData = { ...prev, dispatches: [...prev.dispatches, dispatch] };
        const batch = prev.farmBatches.find(b => b.id === dispatch.batch);
        if (dispatch.route === 'Slaughterhouse') {
          const lotId = prev.lots.some(l => l.id === dispatch.batch)
            ? `${dispatch.batch}-${dispatch.id}`
            : dispatch.batch;
          const lot: Lot = {
            id: lotId,
            disp: dispatch.id,
            batch: dispatch.batch,
            farm: currentUser?.business ?? '',
            farmCode: '',
            farmer: currentUser?.name ?? '',
            vehicle: dispatch.vehicle,
            driver: dispatch.driver,
            cert: batch?.vetCert ?? '',
            received: dispatch.birds,
            status: 'AWAITING',
            receipt: null,
            slaughter: null,
            qc: null,
            packsCreated: false,
            packWeight: 1.2,
            dispatch: null,
          };
          next.lots = [...prev.lots, lot];
        } else {
          const delivery: Delivery = {
            id: dispatch.id,
            batch: dispatch.batch,
            farm: currentUser?.business ?? '',
            farmCode: '',
            farmLicense: currentUser?.license ?? '',
            farmPlace: '',
            farmer: currentUser?.name ?? '',
            cert: batch?.vetCert ?? '',
            vet: batch?.vetBy ?? '',
            birdsSent: dispatch.birds,
            vehicle: dispatch.vehicle,
            driver: dispatch.driver,
            dispatchDate: dispatch.date,
            dispatchTime: '',
            status: 'AWAITING',
            farmDetail: '',
            receipt: null,
          };
          next.deliveries = [...prev.deliveries, delivery];
        }
        return next;
      });
      // Farm dispatch -> Shop/Plant get the delivery/lot + notification.
      const receiver = dispatch.receiver;
      pushNotif(receiver, {
        t: 'New dispatch received',
        s: `${dispatch.id} · ${dispatch.birds.toLocaleString('en-US')} birds`,
        c: '',
        read: false,
      });
      pushActivityFor(currentUser?.name ?? '', {
        t: `Dispatch ${dispatch.id} created`,
        s: `${dispatch.birds.toLocaleString('en-US')} birds → ${dispatch.receiver}`,
        c: '',
      });
    },
    [currentUser, pushNotif, pushActivityFor],
  );

  // Generic data + notification API (for a module's own flow).
  const updateData = useCallback((updater: (prev: DemoData) => DemoData) => {
    setSystemData(prev => updater(clone(prev)));
  }, []);

  const notify = useCallback(
    (username: string, n: AppNotification) => {
      pushNotif(username, n);
    },
    [pushNotif],
  );

  const logActivity = useCallback(
    (username: string, a: ActivityItem) => {
      pushActivityFor(username, a);
    },
    [pushActivityFor],
  );

  const adminBatches: Batch[] = useMemo(() => systemData.adminBatches, [systemData]);

  const lookupPack = useCallback(
    (code: string): ConsumerPack | undefined => {
      const key = code.trim().toUpperCase();
      return systemData.consumerPacks.find(p => p.code.toUpperCase() === key);
    },
    [systemData],
  );

  const value: AppContextValue = {
    theme,
    colors,
    setTheme,
    toggleTheme,
    toast,
    showToast,
    currentUser,
    users,
    signUp,
    signIn,
    signOut,
    changePassword,
    findUser,
    findUserByEmail,
    applications,
    organizations,
    approveApplication,
    rejectApplication,
    requestMoreInfo,
    suspendOrganization,
    adminAlertsEnabled,
    setAdminAlertsEnabled,
    data,
    scopeKey,
    notifications,
    unreadCount,
    markNotificationsRead,
    activity,
    forgot,
    startForgot,
    verifyForgotCode,
    resendForgotCode,
    resetForgotPassword,
    closeForgot,
    remembered,
    recordRemember,
    forgetRemembered,
    updateRememberedPassword,
    pendingPin,
    setPendingPin,
    clearPendingPin,
    registerBatch,
    requestVet,
    createDispatch,
    updateData,
    notify,
    logActivity,
    adminBatches,
    lookupPack,
    demoPassword: 'demo1234',
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
