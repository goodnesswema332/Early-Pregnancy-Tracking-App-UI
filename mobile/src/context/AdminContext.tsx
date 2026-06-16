import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";

export type AdminRole = "super" | "admin" | "agent";
export type AdminStatus = "active" | "pending" | "banned";

export type AdminPrivileges = {
  canChat: boolean;
  canCreateContent: boolean;
  canManageUsers: boolean;
  canManageAdmins: boolean;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  available: boolean;
  privileges: AdminPrivileges;
  createdAt: number;
  lastLoginAt?: number;
};

export type GameItem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  completed?: boolean;
  score?: number;
  color: string;
  category: string;
  icon?: string;
  protected?: boolean;
};

export type ServiceItem = {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  hours?: string;
  lat?: number;
  lng?: number;
  services?: string[];
  protected?: boolean;
};

export type VideoItem = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  protected?: boolean;
};

export type Message = {
  id: string;
  text: string;
  sender: "user" | "support" | "system";
  timestamp: number;
  status?: "pending" | "sent" | "failed";
  attempts?: number;
};

export type ChatSession = {
  id: string;
  userLabel?: string;
  createdAt: number;
  status: "waiting" | "assigned" | "active" | "closed";
  assignedTo?: string;
  messages: Message[];
};

type AdminContextType = {
  // Admin State
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  pendingAdmins: AdminUser[];

  // Authentication
  adminLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  adminRegister: (
    name: string,
    email: string,
    password: string,
    role?: AdminRole,
  ) => Promise<{ success: boolean; message: string }>;
  signOutAdmin: () => void;

  // Super Admin Management
  approveAdmin: (adminId: string) => boolean;
  rejectAdmin: (adminId: string) => boolean;
  banAdmin: (adminId: string) => boolean;
  unbanAdmin: (adminId: string) => boolean;
  updateAdminRole: (adminId: string, newRole: AdminRole) => boolean;
  updateAdminPrivileges: (
    adminId: string,
    privileges: Partial<AdminPrivileges>,
  ) => boolean;
  removeAdmin: (adminId: string) => boolean;

  // Admin Utilities
  setAdminAvailability: (adminId: string, available: boolean) => void;
  hasPrivilege: (privilege: keyof AdminPrivileges) => boolean;
  canAccessAdminPanel: () => boolean;

  // Content Management
  games: GameItem[];
  addGame: (game: Omit<GameItem, "id">) => GameItem;
  removeGame: (gameId: string) => boolean;
  updateGameResult: (gameId: string, score: number, total?: number) => boolean;

  services: ServiceItem[];
  addService: (s: Omit<ServiceItem, "id">) => ServiceItem;
  removeService: (id: string) => boolean;
  findNearestServices: (
    lat: number,
    lng: number,
    limit?: number,
  ) => ServiceItem[];

  videos: VideoItem[];
  addVideo: (v: Omit<VideoItem, "id">) => Promise<VideoItem>;
  removeVideo: (id: string) => Promise<boolean>;

  // Chat Queue
  chatSessions: ChatSession[];
  createChatSession: (label?: string) => Promise<ChatSession>;
  sendMessageToSession: (
    sessionId: string,
    text: string,
    sender: Message["sender"],
  ) => Promise<Message | null>;
  retryMessage: (sessionId: string, messageId: string) => Promise<boolean>;
  assignSessionToAdmin: (
    sessionId: string,
    adminId?: string,
  ) => Promise<boolean>;
  autoAssignSession: (sessionId: string) => Promise<boolean>;
  closeSession: (sessionId: string) => Promise<boolean>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const now = () => Date.now();
const STORAGE_KEY = "EPTA:admin_state_v2";
const CURRENT_ADMIN_KEY = "EPTA:current_admin";

// Password Validation
export const validatePassword = (
  password: string,
): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one numeric digit",
    };
  }
  // Check for at least one non-word, non-space character (special char)
  if (!/[^\w\s]/.test(password)) {
    return {
      valid: false,
      message:
        "Password must contain at least one special character (e.g. !@#$%^&*)",
    };
  }
  return { valid: true, message: "Password is valid" };
};

// Email Validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Default Privileges by Role
const getDefaultPrivileges = (role: AdminRole): AdminPrivileges => {
  switch (role) {
    case "super":
      return {
        canChat: true,
        canCreateContent: true,
        canManageUsers: true,
        canManageAdmins: true,
      };
    case "admin":
      return {
        canChat: true,
        canCreateContent: true,
        canManageUsers: true,
        canManageAdmins: false,
      };
    case "agent":
      return {
        canChat: true,
        canCreateContent: false,
        canManageUsers: false,
        canManageAdmins: false,
      };
    default:
      return {
        canChat: false,
        canCreateContent: false,
        canManageUsers: false,
        canManageAdmins: false,
      };
  }
};

// Sample Super Admin (pre-approved)
const createSampleSuperAdmin = (): AdminUser => ({
  id: "super-1",
  name: "Super Admin",
  email: "superadmin@system.com",
  role: "super",
  status: "active",
  available: true,
  privileges: getDefaultPrivileges("super"),
  createdAt: now(),
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [pendingAdmins, setPendingAdmins] = useState<AdminUser[]>([]);

  const [games, setGames] = useState<GameItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: "svc-1",
      name: "Kiambu Youth Friendly Clinic",
      type: "Youth Health Center",
      address: "Kiambu Town, Market Street",
      phone: "0700123456",
      hours: "Mon-Fri: 8AM-5PM",
      lat: -1.1611,
      lng: 36.8349,
      services: ["Reproductive Health Counseling", "Health Education"],
    },
    {
      id: "svc-2",
      name: "Kiambu County Referral Hospital",
      type: "Public Hospital",
      address: "Hospital Road, Kiambu",
      phone: "0722234567",
      hours: "24/7",
      lat: -1.1668,
      lng: 36.8222,
      services: ["Emergency Care", "Counseling Services"],
    },
  ]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const { user: authUser } = useAuth();
  const socketRef = React.useRef<Socket | null>(null);
  const pendingAckTimeoutsRef = React.useRef<Record<string, number | null>>({});
  const retryCountsRef = React.useRef<Record<string, number>>({});

  // Load persisted state on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const currentRaw = await AsyncStorage.getItem(CURRENT_ADMIN_KEY);

        if (raw) {
          const parsed = JSON.parse(raw);
          if (!mounted) return;

          const allAdmins = parsed.admins || [];
          // Ensure at least one super admin exists
          if (!allAdmins.some((a: AdminUser) => a.role === "super")) {
            allAdmins.push(createSampleSuperAdmin());
          }

          setAdmins(allAdmins.filter((a: AdminUser) => a.status !== "pending"));
          setPendingAdmins(
            allAdmins.filter((a: AdminUser) => a.status === "pending"),
          );

          if (parsed.games) setGames(parsed.games);
          if (parsed.services) setServices(parsed.services);
          if (parsed.videos) setVideos(parsed.videos);
          if (parsed.chatSessions) setChatSessions(parsed.chatSessions);
        } else {
          // Initialize with sample super admin
          const superAdmin = createSampleSuperAdmin();
          setAdmins([superAdmin]);
        }

        if (currentRaw) {
          const current = JSON.parse(currentRaw);
          if (current && current.status === "active") {
            setCurrentAdmin(current);
          }
        }
      } catch (_err) {
        // Initialize with sample super admin on error
        const superAdmin = createSampleSuperAdmin();
        setAdmins([superAdmin]);
      }
    };
    load();

    // Fetch server data
    const fetchServerData = async () => {
      try {
        const resp = await api.get("/education/videos");
        if (resp?.data?.data) setVideos(resp.data.data);
      } catch (_err) {
        // ignore network errors
      }
      try {
        const resp2 = await api.get("/chat/sessions");
        if (resp2?.data?.data) {
          const mapped = (resp2.data.data || []).map(
            (s: any) =>
              ({
                id: s._id,
                userLabel: s.userLabel,
                createdAt: new Date(s.createdAt).getTime(),
                status: s.status,
                assignedTo: s.assignedTo
                  ? s.assignedTo._id || s.assignedTo
                  : undefined,
                messages: [],
              }) as ChatSession,
          );
          setChatSessions(mapped);
        }
      } catch (_err) {
        // ignore
      }
    };
    fetchServerData();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist state on changes
  useEffect(() => {
    const save = async () => {
      try {
        const payload = JSON.stringify({
          admins: [...admins, ...pendingAdmins],
          games,
          services,
          videos,
          chatSessions,
        });
        await AsyncStorage.setItem(STORAGE_KEY, payload);
        if (currentAdmin) {
          await AsyncStorage.setItem(
            CURRENT_ADMIN_KEY,
            JSON.stringify(currentAdmin),
          );
        } else {
          await AsyncStorage.removeItem(CURRENT_ADMIN_KEY);
        }
      } catch (_err) {
        // ignore
      }
    };
    save();
  }, [
    admins,
    pendingAdmins,
    games,
    services,
    videos,
    chatSessions,
    currentAdmin,
  ]);

  // Socket setup for real-time updates
  useEffect(() => {
    let mounted = true;
    const setup = async () => {
      try {
        const base =
          (api.defaults.baseURL as string) || "http://localhost:5000/api";
        const socketUrl = base.replace(/\/api\/?$/, "");
        const token = await AsyncStorage.getItem("authToken");
        const socket = io(socketUrl, { auth: { token } });
        socketRef.current = socket;

        const mapSession = (s: any): ChatSession => ({
          id: s._id,
          userLabel: s.userLabel,
          createdAt: new Date(s.createdAt).getTime(),
          status: s.status,
          assignedTo: s.assignedTo
            ? s.assignedTo._id || s.assignedTo
            : undefined,
          messages: [],
        });

        socket.on("connect", () => {
          if (currentAdmin) socket.emit("joinAdmins");
        });

        socket.on("session:created", (s: any) => {
          const sess = mapSession(s);
          setChatSessions((cur) => [
            sess,
            ...cur.filter((x) => x.id !== sess.id),
          ]);
        });

        socket.on("message:created", (m: any) => {
          const msg = mapServerMessage(m);
          setChatSessions((cur) =>
            cur.map((s) =>
              s.id === (m.sessionId || m.session)
                ? { ...s, messages: [...s.messages, msg] }
                : s,
            ),
          );
        });

        socket.on("session:message", (payload: any) => {
          const { sessionId, message } = payload;
          const msg = mapServerMessage(message);
          setChatSessions((cur) =>
            cur.map((s) =>
              s.id === sessionId ? { ...s, messages: [...s.messages, msg] } : s,
            ),
          );
        });

        socket.on("session:updated", (s: any) => {
          setChatSessions((cur) =>
            cur.map((x) =>
              x.id === s._id
                ? {
                    ...x,
                    status: s.status,
                    assignedTo: s.assignedTo
                      ? s.assignedTo._id || s.assignedTo
                      : undefined,
                  }
                : x,
            ),
          );
        });
      } catch (_e) {
        // ignore
      }
    };
    setup();
    return () => {
      mounted = false;
      try {
        socketRef.current?.disconnect();
      } catch (_e) {}
    };
  }, [currentAdmin]);

  // Authentication Methods
  const adminLogin = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    // Validate email format
    if (!validateEmail(email)) {
      return { success: false, message: "Please enter a valid email address" };
    }

    // In production, this would validate against the backend
    // For now, we check against local state
    const allAdmins = [...admins, ...pendingAdmins];
    const found = allAdmins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );

    if (!found) {
      return { success: false, message: "Invalid email or password" };
    }

    // Check status
    if (found.status === "pending") {
      return {
        success: false,
        message:
          "Your account is pending approval. Please wait for a Super Admin to approve your account.",
      };
    }

    if (found.status === "banned") {
      return {
        success: false,
        message:
          "Your account has been suspended. Please contact a Super Admin for assistance.",
      };
    }

    // In production, verify password hash here
    // For demo purposes, we accept any password for the super admin sample account
    // In a real app, use bcrypt or similar

    setCurrentAdmin({ ...found, lastLoginAt: now() });
    return { success: true, message: "Login successful" };
  };

  const adminRegister = async (
    name: string,
    email: string,
    password: string,
    role: AdminRole = "agent",
  ): Promise<{ success: boolean; message: string }> => {
    // Validate inputs
    if (!name.trim()) {
      return { success: false, message: "Name is required" };
    }

    if (!validateEmail(email)) {
      return { success: false, message: "Please enter a valid email address" };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message };
    }

    // Check if email already exists
    const allAdmins = [...admins, ...pendingAdmins];
    if (allAdmins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return {
        success: false,
        message: "An account with this email already exists",
      };
    }

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      status: "pending", // Default to pending
      available: true,
      privileges: getDefaultPrivileges(role),
      createdAt: now(),
    };

    setPendingAdmins((prev) => [newAdmin, ...prev]);

    return {
      success: true,
      message:
        "Registration submitted. Your account is pending approval from a Super Admin.",
    };
  };

  const signOutAdmin = () => {
    setCurrentAdmin(null);
  };

  // Privilege Checks
  const hasPrivilege = (privilege: keyof AdminPrivileges): boolean => {
    if (!currentAdmin) return false;
    return currentAdmin.privileges[privilege] === true;
  };

  const canAccessAdminPanel = (): boolean => {
    if (!currentAdmin) return false;
    return (
      currentAdmin.status === "active" &&
      (currentAdmin.role === "super" ||
        currentAdmin.role === "admin" ||
        currentAdmin.role === "agent")
    );
  };

  // Super Admin Management Methods
  const approveAdmin = (adminId: string): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;

    const pendingAdmin = pendingAdmins.find((a) => a.id === adminId);
    if (!pendingAdmin) return false;

    const approvedAdmin = { ...pendingAdmin, status: "active" as AdminStatus };
    setPendingAdmins((prev) => prev.filter((a) => a.id !== adminId));
    setAdmins((prev) => [approvedAdmin, ...prev]);
    return true;
  };

  const rejectAdmin = (adminId: string): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;
    setPendingAdmins((prev) => prev.filter((a) => a.id !== adminId));
    return true;
  };

  const banAdmin = (adminId: string): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;
    if (currentAdmin.id === adminId) return false; // Can't ban yourself

    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, status: "banned" } : a)),
    );
    return true;
  };

  const unbanAdmin = (adminId: string): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;

    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, status: "active" } : a)),
    );
    return true;
  };

  const updateAdminRole = (adminId: string, newRole: AdminRole): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;
    if (currentAdmin.id === adminId && newRole !== "super") return false; // Can't demote yourself from super

    setAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? { ...a, role: newRole, privileges: getDefaultPrivileges(newRole) }
          : a,
      ),
    );
    setPendingAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? { ...a, role: newRole, privileges: getDefaultPrivileges(newRole) }
          : a,
      ),
    );
    return true;
  };

  const updateAdminPrivileges = (
    adminId: string,
    privileges: Partial<AdminPrivileges>,
  ): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;

    setAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? { ...a, privileges: { ...a.privileges, ...privileges } }
          : a,
      ),
    );
    setPendingAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? { ...a, privileges: { ...a.privileges, ...privileges } }
          : a,
      ),
    );
    return true;
  };

  const removeAdmin = (adminId: string): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;
    if (currentAdmin.id === adminId) return false; // Can't remove yourself

    setAdmins((prev) => prev.filter((a) => a.id !== adminId));
    setPendingAdmins((prev) => prev.filter((a) => a.id !== adminId));

    if (currentAdmin?.id === adminId) {
      setCurrentAdmin(null);
    }
    return true;
  };

  const setAdminAvailability = (adminId: string, available: boolean) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, available } : a)),
    );
    setPendingAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, available } : a)),
    );
  };

  // Content Management
  const addGame = (game: Omit<GameItem, "id">) => {
    if (!currentAdmin || !hasPrivilege("canCreateContent"))
      throw new Error("Not authorized");
    const newGame: GameItem = { id: `game-${Date.now()}`, ...game };
    setGames((s) => [newGame, ...s]);
    return newGame;
  };

  const removeGame = (gameId: string) => {
    const g = games.find((x) => x.id === gameId);
    if (!g) return false;
    if (g.protected && currentAdmin?.role !== "super") return false;
    if (!currentAdmin || !hasPrivilege("canCreateContent")) return false;
    setGames((s) => s.filter((x) => x.id !== gameId));
    return true;
  };

  const updateGameResult = (gameId: string, score: number, _total?: number) => {
    setGames((s) =>
      s.map((g) => (g.id === gameId ? { ...g, completed: true, score } : g)),
    );
    return true;
  };

  const addService = (s: Omit<ServiceItem, "id">) => {
    if (!currentAdmin || !hasPrivilege("canCreateContent"))
      throw new Error("Not authorized");
    const newSvc: ServiceItem = { id: `svc-${Date.now()}`, ...s };
    setServices((cur) => [newSvc, ...cur]);
    return newSvc;
  };

  const removeService = (id: string) => {
    const svc = services.find((x) => x.id === id);
    if (!svc) return false;
    if (svc.protected && currentAdmin?.role !== "super") return false;
    if (!currentAdmin || !hasPrivilege("canCreateContent")) return false;
    setServices((s) => s.filter((x) => x.id !== id));
    return true;
  };

  const addVideo = async (v: Omit<VideoItem, "id">) => {
    if (!currentAdmin || !hasPrivilege("canCreateContent"))
      throw new Error("Not authorized");

    try {
      let thumbUrl = v.thumbnail;
      if (typeof v.thumbnail === "string" && v.thumbnail.startsWith("data:")) {
        const extMatch = v.thumbnail.match(/data:image\/(\w+);base64,/);
        const ext = extMatch ? extMatch[1] : "jpg";
        const uploadResp = await api.post(
          "/education/videos/upload-thumbnail",
          {
            data: v.thumbnail.replace(/^data:\w+\/\w+;base64,/, ""),
            ext,
          },
        );
        if (uploadResp?.data?.data?.url) thumbUrl = uploadResp.data.data.url;
      }

      const payload: any = {
        title: v.title,
        description: v.description,
        url: v.url,
        thumbnail: thumbUrl,
      };
      const resp = await api.post("/education/videos", payload);
      if (resp?.data?.data) {
        setVideos((s) => [resp.data.data, ...s]);
        return resp.data.data as VideoItem;
      }
    } catch (_err) {
      // fallback to local-only
    }

    const newV: VideoItem = { id: `vid-${Date.now()}`, ...v };
    setVideos((s) => [newV, ...s]);
    return newV;
  };

  const removeVideo = async (id: string) => {
    const vid = videos.find((x) => x.id === id);
    if (!vid) return false;
    if (vid.protected && currentAdmin?.role !== "super") return false;
    if (!currentAdmin || !hasPrivilege("canCreateContent")) return false;

    try {
      await api.delete(`/education/videos/${id}`);
    } catch (_err) {
      // ignore
    }
    setVideos((s) => s.filter((x) => x.id !== id));
    return true;
  };

  // Chat Management
  const mapServerMessage = (m: any): Message => ({
    id: m._id || m.id || `m-${Date.now()}`,
    text: m.message || m.text,
    sender: m.sender === "support" ? "support" : "user",
    timestamp: new Date(m.timestamp || m.createdAt || Date.now()).getTime(),
  });

  const createChatSession = async (label?: string) => {
    try {
      const resp = await api.post("/chat/sessions", { userLabel: label });
      if (resp?.data?.data) {
        const s = resp.data.data;
        const session: ChatSession = {
          id: s._id,
          userLabel: s.userLabel,
          createdAt: new Date(s.createdAt).getTime(),
          status: s.status,
          assignedTo: s.assignedTo
            ? s.assignedTo._id || s.assignedTo
            : undefined,
          messages: [],
        };
        setChatSessions((cur) => [session, ...cur]);
        setTimeout(() => autoAssignSession(session.id), 300);
        try {
          socketRef.current?.emit("joinSession", { sessionId: session.id });
        } catch (_e) {}
        return session;
      }
    } catch (_err) {
      // fallback to local
    }

    const session: ChatSession = {
      id: `chat-${Date.now()}`,
      userLabel: label ?? `Anon-${Date.now()}`,
      createdAt: now(),
      status: "waiting",
      messages: [],
    };
    setChatSessions((s) => [session, ...s]);
    setTimeout(() => autoAssignSession(session.id), 300);
    try {
      socketRef.current?.emit("joinSession", { sessionId: session.id });
    } catch (_e) {}
    return session;
  };

  const sendMessageToSession = async (
    sessionId: string,
    text: string,
    sender: Message["sender"],
  ) => {
    const localId = `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const localMsg: Message = {
      id: localId,
      text,
      sender,
      timestamp: now(),
      status: "pending",
      attempts: 0,
    };

    setChatSessions((sessions) =>
      sessions.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, localMsg] } : s,
      ),
    );

    const socket = socketRef.current;

    const markMessage = (status: Message["status"], replacement?: Message) => {
      setChatSessions((sessions) =>
        sessions.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === localId ? replacement || { ...m, status } : m,
            ),
          };
        }),
      );
    };

    if (socket && socket.connected) {
      return new Promise<Message | null>((resolve) => {
        let settled = false;
        const cleanup = () => {
          settled = true;
          const t = pendingAckTimeoutsRef.current[localId];
          if (t) {
            clearTimeout(t as any);
            pendingAckTimeoutsRef.current[localId] = null;
          }
        };

        const payload = { sessionId, message: text, sender };

        socket.emit("sendMessage", payload, (ack: any) => {
          cleanup();
          if (ack && ack.success && ack.data) {
            const serverMsg = mapServerMessage(ack.data);
            setChatSessions((sessions) =>
              sessions.map((s) =>
                s.id === sessionId
                  ? {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === localId ? serverMsg : m,
                      ),
                    }
                  : s,
              ),
            );
            resolve(serverMsg);
          } else {
            markMessage("failed");
            resolve({ ...localMsg, status: "failed" });
          }
        });

        pendingAckTimeoutsRef.current[localId] = setTimeout(() => {
          if (!settled) {
            markMessage("failed");
            resolve({ ...localMsg, status: "failed" });
          }
        }, 5000) as unknown as number;
      });
    }

    // Fallback to REST
    try {
      if (sender === "user") {
        await api.post(`/chat/sessions/${sessionId}/messages`, {
          message: text,
        });
      } else if (sender === "support") {
        await api.post(`/chat/sessions/${sessionId}/messages/admin`, {
          message: text,
        });
      }

      try {
        const resp = await api.get(`/chat/sessions/${sessionId}/messages`);
        if (resp?.data?.data) {
          const msgs = resp.data.data.map((m: any) => mapServerMessage(m));
          setChatSessions((sessions) =>
            sessions.map((s) =>
              s.id === sessionId ? { ...s, messages: msgs } : s,
            ),
          );
          return msgs[msgs.length - 1] || localMsg;
        }
      } catch (_e) {
        // ignore
      }
    } catch (_err) {
      markMessage("failed");
    }

    return { ...localMsg, status: "failed" };
  };

  const retryMessage = async (sessionId: string, messageId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (!session) return false;
    const msg = session.messages.find((m) => m.id === messageId);
    if (!msg) return false;

    const attempts = (msg.attempts || 0) + 1;
    retryCountsRef.current[messageId] = attempts;
    setChatSessions((sessions) =>
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === messageId ? { ...m, status: "pending", attempts } : m,
              ),
            }
          : s,
      ),
    );

    const socket = socketRef.current;
    if (socket && socket.connected) {
      return new Promise<boolean>((resolve) => {
        let settled = false;
        const cleanup = () => {
          settled = true;
          const t = pendingAckTimeoutsRef.current[messageId];
          if (t) {
            clearTimeout(t as any);
            pendingAckTimeoutsRef.current[messageId] = null;
          }
        };

        const payload = { sessionId, message: msg.text, sender: msg.sender };
        socket.emit("sendMessage", payload, (ack: any) => {
          cleanup();
          if (ack && ack.success && ack.data) {
            const serverMsg = mapServerMessage(ack.data);
            setChatSessions((sessions) =>
              sessions.map((s) =>
                s.id === sessionId
                  ? {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === messageId ? serverMsg : m,
                      ),
                    }
                  : s,
              ),
            );
            resolve(true);
          } else {
            setChatSessions((sessions) =>
              sessions.map((s) =>
                s.id === sessionId
                  ? {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === messageId ? { ...m, status: "failed" } : m,
                      ),
                    }
                  : s,
              ),
            );
            resolve(false);
          }
        });

        pendingAckTimeoutsRef.current[messageId] = setTimeout(() => {
          if (!settled) {
            setChatSessions((sessions) =>
              sessions.map((s) =>
                s.id === sessionId
                  ? {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === messageId ? { ...m, status: "failed" } : m,
                      ),
                    }
                  : s,
              ),
            );
            resolve(false);
          }
        }, 5000) as unknown as number;
      });
    }

    // Fallback: attempt REST resend
    try {
      if (msg.sender === "user") {
        await api.post(`/chat/sessions/${sessionId}/messages`, {
          message: msg.text,
        });
      } else if (msg.sender === "support") {
        await api.post(`/chat/sessions/${sessionId}/messages/admin`, {
          message: msg.text,
        });
      }
      const resp = await api.get(`/chat/sessions/${sessionId}/messages`);
      if (resp?.data?.data) {
        const msgs = resp.data.data.map((m: any) => mapServerMessage(m));
        setChatSessions((sessions) =>
          sessions.map((s) =>
            s.id === sessionId ? { ...s, messages: msgs } : s,
          ),
        );
        return true;
      }
    } catch (_e) {
      // ignore
    }

    setChatSessions((sessions) =>
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === messageId ? { ...m, status: "failed" } : m,
              ),
            }
          : s,
      ),
    );
    return false;
  };

  const assignSessionToAdmin = async (sessionId: string, adminId?: string) => {
    try {
      const resp = await api.put(
        `/chat/sessions/${sessionId}/assign`,
        adminId ? { adminId } : {},
      );
      if (resp?.data?.data) {
        const s = resp.data.data;
        setChatSessions((cur) =>
          cur.map((x) =>
            x.id === sessionId
              ? {
                  ...x,
                  assignedTo: s.assignedTo
                    ? s.assignedTo._id || s.assignedTo
                    : undefined,
                  status: s.status,
                }
              : x,
          ),
        );
        return true;
      }
    } catch (_err) {
      // fallback to local
    }

    const admin =
      admins.find((a) => a.id === adminId && a.available) ||
      admins.find((a) => a.available);
    if (!admin) return false;
    setChatSessions((sessions) =>
      sessions.map((s) =>
        s.id === sessionId
          ? { ...s, assignedTo: admin.id, status: "assigned" }
          : s,
      ),
    );
    setAdminAvailability(admin.id, false);
    return true;
  };

  const autoAssignSession = async (sessionId: string) => {
    try {
      await api.put(`/chat/sessions/${sessionId}/assign`);
      return true;
    } catch (_err) {
      // fallback to local
    }

    const free = admins.find((a) => a.available);
    if (!free) return false;
    return assignSessionToAdmin(sessionId, free.id);
  };

  const closeSession = async (sessionId: string) => {
    try {
      const resp = await api.put(`/chat/sessions/${sessionId}/close`);
      if (resp?.data?.data) {
        const s = resp.data.data;
        setChatSessions((cur) =>
          cur.map((x) => (x.id === sessionId ? { ...x, status: s.status } : x)),
        );
        return true;
      }
    } catch (_err) {
      // fallback to local
    }

    const session = chatSessions.find((s) => s.id === sessionId);
    if (!session) return false;
    if (session.assignedTo) setAdminAvailability(session.assignedTo, true);
    setChatSessions((s) =>
      s.map((x) => (x.id === sessionId ? { ...x, status: "closed" } : x)),
    );
    return true;
  };

  const findNearestServices = (lat: number, lng: number, limit: number = 5) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const haversine = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const withDist = services
      .map((s) => ({
        s,
        dist:
          s.lat && s.lng ? haversine(lat, lng, s.lat, s.lng) : Number.MAX_VALUE,
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit)
      .map(
        (x) =>
          ({
            ...x.s,
            distanceKm: Math.round((x.dist + Number.EPSILON) * 100) / 100,
          }) as any,
      );

    return withDist as ServiceItem[];
  };

  const value: AdminContextType = {
    admins,
    currentAdmin,
    pendingAdmins,
    adminLogin,
    adminRegister,
    signOutAdmin,
    approveAdmin,
    rejectAdmin,
    banAdmin,
    unbanAdmin,
    updateAdminRole,
    updateAdminPrivileges,
    removeAdmin,
    setAdminAvailability,
    hasPrivilege,
    canAccessAdminPanel,
    games,
    addGame,
    removeGame,
    updateGameResult,
    services,
    addService,
    removeService,
    findNearestServices,
    videos,
    addVideo,
    removeVideo,
    chatSessions,
    createChatSession,
    sendMessageToSession,
    retryMessage,
    assignSessionToAdmin,
    autoAssignSession,
    closeSession,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
};

export default AdminContext;
