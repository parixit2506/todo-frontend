import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Header from './common/Header';
import Footer from './common/Footer'

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: "" }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setErrors((prev) => ({ ...prev, description: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    let newErrors = {};
    if (!title) newErrors.title = "Title is required!";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.post(
        "https://todo-backend-5m3x.onrender.com/todos/createTodo",
        { title, description },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Task created successfully!");
      setTitle("");
      setDescription("");
      navigate('/dashboard')
    } catch (err) {
      toast.error("Failed to create task.");
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    setTitle("");
    setDescription("");
  }

  const isFormFilled = title.trim() !== "" || description.trim() !== "";

  return (
    <>
      <Header />
      <section className="flex flex-col justify-center items-center px-8 py-20 flex-grow bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-[#1a7dc3] mb-6">Create Task</h1>
        <form className="flex flex-col items-center max-w-7xl w-full bg-white p-8 rounded-2xl shadow">
          <div className="flex justify-between gap-2">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Task"
                value={title}
                onChange={handleTitleChange}
                className={`w-80 h-11 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none ${errors.title ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.title && <p className="text-red-500 text-sm ml-1">{errors.title}</p>}
            </div>

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-80 h-11 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormFilled}
              onClick={handleSubmit}
              className={`w-40 h-11 ${isFormFilled ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"} text-white font-semibold rounded transition duration-200`}
            >
              Add
            </button>

            <button
              type="submit"
              disabled={!isFormFilled}
              onClick={handleCancel}
              className={`w-40 h-11 ${isFormFilled ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"} text-white font-semibold rounded transition duration-200`}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={() => (navigate('/dashboard'))}
              className="w-40 h-11 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-200"
            >
              Back
            </button>
          </div>
        </form>
      </section>
      {/* Footer */}
      <Footer />
    </>
  )
} 