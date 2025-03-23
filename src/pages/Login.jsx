import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/login", formData, { withCredentials: true });
      console.log(data)

      // Store token, email, and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);


      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <Input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <Input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <Button text="Login" />
        <p className="text-center mt-4 text-sm">
          Not registered?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Click here to register
          </Link>
        </p>
      </form>
    </div>
  );
}
