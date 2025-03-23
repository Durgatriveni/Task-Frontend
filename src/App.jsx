import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      
        
      </Routes>
    </div>
  );
}

export default App;
