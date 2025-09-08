import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';


export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const Validate = () => {
    const token = localStorage.getItem("token");
    if (token) navigate('/dashboard');
  }

  useEffect(() => {
    Validate();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Email or phone no. validation
    if (!identifier) {
      newErrors.identifier = "Email or phone no. is required!";
    } else {
      const trimmedIdentifier = identifier.trim();

      const isEmail = /^(?![.-])[a-zA-Z0-9.-]+@(gmail|yahoo|hotmail)\.com(?<![.-])$/.test(trimmedIdentifier);
      const isPhone = /^\d{10}$/.test(trimmedIdentifier);
      const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(trimmedIdentifier);

      if (!isEmail && !isPhone && !isUsername) {
        newErrors.identifier = "Enter a valid email, phone number, or username.";
      }
    }

    if (!password) {
      newErrors.password = "Password is required!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const res = await axios.post("https://todo-backend-5m3x.onrender.com/users/login", {
        identifier: identifier.trim(),
        password,
      });

      localStorage.setItem("token", res.data.jwtToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful!");
      navigate("/dashboard");

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login Failed!";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-md w-full bg-white p-8 rounded-2xl shadow">
        <div className="relative flex items-center max-w-md w-full mb-7">
          <ArrowLeftIcon
            className="w-5 h-5 text-[#1a7dc3] hover:text-[#166ca9] active:text-[#1a7dc3] cursor-pointer duration-200"
            onClick={() => navigate("/")}
          />
          <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2" style={{color: "#1a7dc3"}}>
            Login
          </h1>
        </div>

        {/* Email */}
        <input
          type="text"
          name="identifier"
          placeholder="Email, Phone no. or Username"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setErrors((prev) => ({ ...prev, identifier: "" }));
          }}
          className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.identifier ? "border-red-500 mb-0.5" : "border-gray-300"
            }`}
          autoComplete="identifier"
        />
        {errors.identifier && <p className="w-full text-left text-red-500 text-sm mb-4" >{errors.identifier}</p>}

        {/* Password */}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.password ? "border-red-500 mb-0" : "border-gray-300"
              }`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm focus:outline-none ${errors.password ? "top-1/3 -translate-y-2/3" : ""}`}
            style={{color: "#1a7dc3"}}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="w-full text-left text-red-500 text-sm mb-4" >{errors.password}</p>}
        </div>


        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#1a7dc3] hover:bg-[#166ca9] active:bg-[#1a7dc3] text-white font-semibold p-2 rounded transition duration-200"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#1a7dc3] hover:text-[#166ca9] active:text-[#1a7dc3] hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
