import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ReservasPage from "./components/ReservasPage";
import AdminPage from "./components/AdminPage";
import LoginForm from "./components/LoginForm";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./hooks/useAuth";
import { ReservationProvider } from "./contexts/ReservationContext";

function App() {
  const { isAuthenticated, isInitializing } = useAuth();

  // Mostrar tela de loading enquanto está inicializando após o login
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <ReservationProvider>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/reserve/*" element={<Layout><Dashboard /></Layout>} />
              <Route path="/reservas" element={<Layout><ReservasPage /></Layout>} />
              <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
              <Route path="/" element={<Navigate to="/reserve" replace />} />
              <Route path="*" element={<Navigate to="/reserve" replace />} />
            </>
          ) : (
            <Route path="*" element={<LoginForm />} />
          )}
        </Routes>
      </ReservationProvider>
    </div>
  );
}

export default App;
