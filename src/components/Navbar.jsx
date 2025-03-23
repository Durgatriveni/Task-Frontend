import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/images/image1.png"; // Adjust the path based on your project structure

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      alert("Logged out successfully!");
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      alert("Logout failed");
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-purple-600 text-white">
      {/* Logo on the left */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-2 w-full" /> {/* Adjust path if needed */}
        <span className="text-xl font-bold">Tasks</span> {/* Optional text next to the logo */}
      </div>

      {/* Logout button on the right */}
      <button
  onClick={handleLogout}
  className=" text-purple-600 border border-purple-600 hover:bg-purple-100 px-4 py-2 rounded-md bg-gray-100"
>
  Logout
</button>

    </nav>
  );
}
