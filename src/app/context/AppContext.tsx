import { createContext, useContext, useState, useCallback } from "react";
import type { Award, Transaction, Notification, AuditLog } from "../data/mockData";
import {
  awards as initAwards,
  transactions as initTx,
  notifications as initNotifs,
  auditLogs as initLogs,
} from "../data/mockData";

interface AppContextValue {
  // Awards
  awards: Award[];
  addAward: (a: Award) => void;
  updateAward: (id: string, updates: Partial<Award>) => void;
  // Transactions
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
  markNotifRead: (id: number) => void;
  markAllNotifRead: () => void;
  dismissNotif: (id: number) => void;
  unreadCount: number;
  // Audit logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void;
}

const AppContext = createContext<AppContextValue>(null!);

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [awards, setAwards] = useState<Award[]>(initAwards);
  const [transactions, setTransactions] = useState<Transaction[]>(initTx);
  const [notifications, setNotifications] = useState<Notification[]>(initNotifs);
  const [logs, setLogs] = useState<AuditLog[]>(initLogs);

  const addAward = useCallback((a: Award) => setAwards(p => [a, ...p]), []);
  const updateAward = useCallback((id: string, u: Partial<Award>) =>
    setAwards(p => p.map(a => a.id === id ? { ...a, ...u } : a)), []);

  const addTransaction = useCallback((t: Transaction) => setTransactions(p => [t, ...p]), []);
  const updateTransaction = useCallback((id: string, u: Partial<Transaction>) =>
    setTransactions(p => p.map(t => t.id === id ? { ...t, ...u } : t)), []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'read'>) =>
    setNotifications(p => [{ ...n, id: Date.now(), read: false }, ...p]), []);
  const markNotifRead = useCallback((id: number) =>
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllNotifRead = useCallback(() =>
    setNotifications(p => p.map(n => ({ ...n, read: true }))), []);
  const dismissNotif = useCallback((id: number) =>
    setNotifications(p => p.filter(n => n.id !== id)), []);

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id'>) =>
    setLogs(p => [{ ...log, id: Date.now() }, ...p]), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      awards, addAward, updateAward,
      transactions, addTransaction, updateTransaction,
      notifications, addNotification, markNotifRead, markAllNotifRead, dismissNotif, unreadCount,
      auditLogs: logs, addAuditLog,
    }}>
      {children}
    </AppContext.Provider>
  );
}
