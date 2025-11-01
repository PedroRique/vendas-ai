import "./App.css";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">{isAuthenticated ? <Dashboard /> : <LoginForm />}</div>
  );
}

export default App;
