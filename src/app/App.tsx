import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import { AppRoutes } from "./routes/index";

export interface NavState {
  grantCallId?: string;
  grantCallTitle?: string;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
