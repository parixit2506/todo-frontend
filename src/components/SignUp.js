import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';


export default function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();
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

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name field is required!";
    } else if (name.length < 3 || name.length > 20) {
      newErrors.name = "Name must be between 3 and 20 characters long!";
    } else {
      const nameValidation = /^[a-zA-Z\s'-]+$/;
      if (!nameValidation.test(name.trim())) {
        newErrors.name = "Name can only contain letters, spaces, apostrophes, or hyphens!";
      }
    }

    if (!username.trim()) {
      newErrors.username = "Username is required!";
    } else {
      const usernameValidation = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameValidation.test(username)) {
        newErrors.username = "Username must be 3–20 characters and only contain letters, numbers, or underscores.";
      }
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email fields are required!";
    } else {
      const emailValidation = /^\s*(?![.-])[a-zA-Z0-9.-]+@(gmail|yahoo|hotmail)\.com(?<![.-])\s*$/;
      if (!emailValidation.test(email)) {
        newErrors.email = "Invalid email format!";
      }
    }

    // Phone Validation
    if (!phone) {
      newErrors.phone = "Phone number is required!";
    } else {
      const phoneValidation = /^\d{10}$/;
      if (!phoneValidation.test(phone)) {
        newErrors.phone = "Invalid phone number. Must be a 10-digit number."
      }
    }

    //Password validation
    if (!password) {
      newErrors.password = "Password fields are required!";
    } else {
      const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordValidation.test(password)) {
        newErrors.password = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password!";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    // Profile image Validation
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!profileImage) {
      newErrors.profileImage = "Please upload a profile image!";
    } else if (!allowedImageTypes.includes(profileImage.type)) {
      newErrors.profileImage = "Only JPG, JPEG, PNG, or WEBP images are allowed!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; 
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("username", username.trim());
      formData.append("email", email.trim());
      formData.append("phoneNo", phone.trim());
      formData.append("password", password);
      formData.append("profile_image", profileImage);

      const res = await axios.post("https://todo-backend-5m3x.onrender.com/users/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Sign Up Successful!");

      setName("");
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setProfileImage(null);
      setErrors({});
      fileInputRef.current.value = null;

      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Sign Up Failed";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center max-w-md w-full bg-white p-8 rounded-2xl shadow"
      >

        <div className="relative flex items-center max-w-md w-full mb-7">
          <ArrowLeftIcon
            className="w-5 h-5 text-[#1a7dc3] hover:text-[#166ca9] active:text-[#1a7dc3] cursor-pointer duration-200"
            onClick={() => navigate("/")}
          />
          <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2" style={{color: "#1a7dc3"}}>
            Sign Up
          </h1>
        </div>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.name ? "border-red-500 mb-0.5" : "border-gray-300"
            }`} />
        {errors.name && <p className="w-full text-left text-red-500 text-sm mb-4">{errors.name}</p>}

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prev) => ({ ...prev, username: "" }));
          }}
          className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.username ? "border-red-500 mb-0.5" : "border-gray-300"
            }`}
        />
        {errors.username && (
          <p className="w-full text-left text-red-500 text-sm mb-4">
            {errors.username}
          </p>
        )}

        {/* Email */}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.email ? "border-red-500 mb-0.5" : "border-gray-300"
            }`} />
        {errors.email && <p className="w-full text-left text-red-500 text-sm mb-4">{errors.email}</p>}

        {/* Phone */}
        <input
          type="tel"
          name="phoneNo"
          size={10}
          placeholder="Phone No."
          maxLength={10}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.phone ? "border-red-500 mb-0.5" : "border-gray-300"
            }`}
        />
        {errors.phone && <p className="w-full text-left text-red-500 text-sm mb-4">{errors.phone}</p>}

        {/* Password */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.password ? "border-red-500 mb-0.5" : "border-gray-300"
              }`}
            autoComplete="password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-2 top-1/3 transform -translate-y-1/3 text-sm focus:outline-none ${errors.password ? "top-1/3 -translate-y-2/3" : ""}`}
            style={{color: "#1a7dc3"}}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="w-full text-left text-red-500 text-sm mb-4">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.confirmPassword ? "border-red-500 mb-0.5" : "border-gray-300"
              }`}
            autoComplete="confirm-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute right-2 top-1/3 transform -translate-y-1/3 text-sm focus:outline-none ${errors.password ? "top-1/3 -translate-y-2/3" : ""}`}
            style={{color: "#1a7dc3"}}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
          {errors.confirmPassword && (
            <p className="w-full text-left text-red-500 text-sm mb-4">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Profile */}
        <p className="w-full text-left mb-1 text-sm font-medium" style={{color: "#1a7dc3"}}>Upload Profile Image</p>
        <input
          ref={fileInputRef}
          type="file"
          name="profile_image"
          onChange={(e) => {
            setProfileImage(e.target.files[0]);
            setErrors((prev) => ({ ...prev, profileImage: "" }));
          }}
          accept=".jpg, .jpeg, .png, .webp"
          className={`w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2197eb] outline-none ${errors.profileImage ? "border-red-500 mb-0.5" : "border-gray-300"
            }`}
        />
        {errors.profileImage && (
          <p className="w-full text-left text-red-500 text-sm mb-4">
            {errors.profileImage}
          </p>
        )}


        <button
          type="submit"
          className="w-full bg-[#1a7dc3] hover:bg-[#166ca9] active:bg-[#1a7dc3] text-white font-semibold p-2 rounded transition duration-200 mt-2"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#1a7dc3] hover:text-[#166ca9] active:text-[#1a7dc3] hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}