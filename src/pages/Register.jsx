import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", formData);
      alert("Registration successful!");
      navigate("/");  // Redirect to login or home page
    } catch (error) {
      // Check for error response from the backend
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);  // Display the backend error message
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

         {/* Role Dropdown */}
         <div className="mt-2 mb-3">
          <label htmlFor="role" className="block mb-2 text-gray-700">Select Role</label>
          <select
            id="role"
            className="border p-2 w-full"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Input type="text" placeholder="Enter your Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
        <Input type="email" placeholder="Enter your Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <Input type="password" placeholder="Enter your Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        
        {/* Role Dropdown */}
        {/* <select className="border p-2 w-full mt-2" onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> */}
        <div className="mt-3">
        <Button text="Register" />


        </div>
         {/* Back to Login Button */}
         <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 "
            onClick={() => navigate("/")}  // Navigate to login page
          >
            Back to Login
          </button>
        </div>

      </form>
    </div>
  );
}
