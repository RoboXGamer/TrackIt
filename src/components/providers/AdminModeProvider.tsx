import { createContext, useContext, useState } from "react";

type AdminMode = "ON" | "OFF";

type AdminModeProviderProps = {
  children: React.ReactNode;
  defaultMode?: AdminMode;
  storageKey?: string;
};

type AdminModeProviderState = {
  mode: AdminMode;
  setMode: (mode: AdminMode) => void;
};

const initialState: AdminModeProviderState = {
  mode: "OFF",
  setMode: () => null,
};

const AdminModeProviderContext =
  createContext<AdminModeProviderState>(initialState);

export function AdminModeProvider({
  children,
  defaultMode = "OFF",
  storageKey = "vite-ui-admin-mode",
  ...props
}: AdminModeProviderProps) {
  const [mode, setMode] = useState<AdminMode>(
    () => (localStorage.getItem(storageKey) as AdminMode) || defaultMode,
  );

  const value = {
    mode,
    setMode: (mode: AdminMode) => {
      localStorage.setItem(storageKey, mode);
      setMode(mode);
    },
  };

  return (
    <AdminModeProviderContext.Provider {...props} value={value}>
      {children}
    </AdminModeProviderContext.Provider>
  );
}

export const useAdminMode = () => {
  const context = useContext(AdminModeProviderContext);

  if (context === undefined)
    throw new Error("useAdminMode must be used within a AdminModeProvider");

  return context;
};
