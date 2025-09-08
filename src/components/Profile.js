import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/solid";
import Modal from "./Model";

export default function Profile() {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null); // For preview
  const [profileImageFile, setProfileImageFile] = useState(null); // For upload

  const [errors, setErrors] = useState({});

  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    profile_image: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    (async function fetchData() {
      try {
        const res = await axios.get("https://todo-backend-5m3x.onrender.com/users/getUser", {
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = res.data?.result;

        const name = data?.name;
        const email = data?.email;
        const phoneNo = data?.phoneNo;
        const profile_image = data?.profile_image
          ? `https://todo-backend-5m3x.onrender.com/uploads/${data.profile_image}`
          : null;

        setName(name);
        setEmail(email);
        setPhone(phoneNo);
        setProfileImage(profile_image);

        setInitialData({
          name,
          email,
          phoneNo,
          profile_image: data?.profile_image || null, // store filename, not full URL
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // For preview
      setProfileImageFile(file); // Actual file for upload
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

  let newErrors = {};

    if (!Name.trim()) {
      newErrors.Name = "Name field is required!";
    } else if (Name.length < 3 || Name.length > 20) {
      newErrors.Name = "Name must be between 3 and 20 characters long!";
    } else {
      const nameValidation = /^[a-zA-Z\s'-]+$/;
      if (!nameValidation.test(Name.trim())) {
        newErrors.name = "Name can only contain letters, spaces, apostrophes, or hyphens!";
      }
    }

    if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

    try {
      const formData = new FormData();
      formData.append("name", Name);
      formData.append("phoneNo", phone);

      // Only append image if a new one was selected
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      const res = await axios.put(
        "https://todo-backend-5m3x.onrender.com/users/updateUser",
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const updatedUser = res.data?.result;

      // Update preview and initial state
      const newProfileImage = updatedUser?.profile_image
        ? `https://todo-backend-5m3x.onrender.com/uploads/${updatedUser.profile_image}`
        : null;

      setProfileImage(newProfileImage);
      setProfileImageFile(null);

      setInitialData({
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNo: updatedUser.phoneNo,
        profile_image: updatedUser.profile_image,
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const isChanged =
    Name !== initialData.name ||
    phone !== initialData.phoneNo ||
    profileImageFile !== null;

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsModalOpen(false);
    const token = localStorage.getItem("token");

    try {
      await axios.delete("https://todo-backend-5m3x.onrender.com/users/deleteUser", {
        headers: { Authorization: `${token}` },
      });

      toast.success("Account deleted successfully.");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete the account."
      );
    }
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="flex flex-col items-center max-w-md w-full bg-white p-8 rounded-2xl shadow"
        onSubmit={handleSave}
      >
        <div className="relative flex items-center max-w-md w-full mb-5">
          <ArrowLeftIcon
            className="w-5 h-5 cursor-pointer duration-200  text-[#1a7dc3] hover:text-[#166ca9] active:text-[#1a7dc3]"
            onClick={() => navigate("/dashboard")}
          />
          <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2" style={{ color: "#1a7dc3" }}>
            Profile
          </h1>
        </div>

        {/* Profile Image Upload */}
        <div
          className="h-28 w-28 rounded-full border-2 border-[#1a7dc3] flex items-center justify-center shadow shadow-slate-400 mb-5 cursor-pointer relative group"
          onClick={handleImageClick}
          title="Click to change profile picture"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No Image</span>
          )}

          <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <PencilIcon className="w-6 h-6 text-white" />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Name Field */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            value={Name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, Name: "" }));
            }}
            placeholder="Name"
            className={`w-full p-2 pr-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none ${errors.Name ? "border-red-500 mb-0.5" : "border-gray-300"
              }`}
            onFocus={() => setIsPhoneEditing(true)}
            onBlur={() => setIsPhoneEditing(false)}
          />
          {errors.Name && <p className="w-full text-left text-red-500 text-sm mb-4">{errors.Name}</p>}
          {!isPhoneEditing && (
            <PencilIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          )}
        </div>

        {/* Phone Field */}
        <div className="relative w-full mb-4">
          <input
            type="tel"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full p-2 pr-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            onFocus={() => setIsEmailEditing(true)}
            onBlur={() => setIsEmailEditing(false)}
          />
          {!isEmailEditing && (
            <PencilIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          )}
        </div>

        {/* Email Field */}
        <input
          type="email"
          value={email}
          disabled
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:ring-0 outline-none"
        />

        <div className="flex flex-row gap-4">
          {/* Save Button */}
          <button
            type="submit"
            disabled={!isChanged}
            className={`px-4 py-2 rounded transition-all duration-200 ${isChanged
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Save Changes
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDeleteClick}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition duration-200"
          >
            Delete Account
          </button>
        </div>
      </form>
      {isModalOpen && (
        <Modal
          message="Are you sure you want to delete your account?"
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
