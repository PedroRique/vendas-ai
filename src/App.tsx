import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated, isInitializing } = useAuth();

  // Mostrar tela de loading enquanto está inicializando após o login
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/reservas" element={<Dashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/reserve/*" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/reserve" replace />} />
            <Route path="*" element={<Navigate to="/reserve" replace />} />
          </>
        ) : (
          <Route path="*" element={<LoginForm />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
