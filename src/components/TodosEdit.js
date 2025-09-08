import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';


export default function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const fetchTodo = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`https://todo-backend-5m3x.onrender.com/todos/getTodo/${id}`, {
          headers: { Authorization: `${token}` },
        });

        setTitle(res.data.result.title);
        setDescription(res.data.result.description);
      } catch (err) {
        toast.error("Failed to fetch task.");
      }
    };

    fetchTodo();
  }, [id, token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required!";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.put(
        `https://todo-backend-5m3x.onrender.com/todos/updateTodo/${id}`,
        { title, description },
        {
          headers: { Authorization: `${token}` },
        }
      );
      toast.success("Task updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to update task.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleUpdate}
        className="flex flex-col items-center max-w-md w-full bg-white p-8 rounded-2xl shadow"
      >

        <div className="relative flex items-center max-w-md w-full mb-7">
          <ArrowLeftIcon
            className="w-5 h-5 duration-200  text-[#1a7dc3] hover:text-[#166ca9] active:text-[#1a7dc3]"
            onClick={() => navigate("/dashboard")}
          />
          <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2"  style={{color: "#1a7dc3"}}>
          
            Edit Task
          </h1>
        </div>

        <div className="flex-1 mb-4">
          <input
            type="text"
            placeholder="Edit task title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            className={`w-96 h-11 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none ${errors.title ? "border-red-500 m-1" : "border-gray-300"}`}
          />
          {errors.title && <p className="text-red-500 text-sm ml-2">{errors.title}</p>}
        </div>

        <input
          type="text"
          placeholder="Edit task description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors((prev) => ({ ...prev, description: "" }));
          }}
          className="w-96 h-11 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none mb-4"
        />

        <div className='flex justify-between gap-2 mt-2'>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
