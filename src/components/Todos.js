import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Modal from './Model';

export default function Todos() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [todos, setTodos] = useState([]);

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const [showModal, setShowModal] = useState(false); // State to show/hide the modal
  const [todoToDelete, setTodoToDelete] = useState(null); // Store the task to be deleted

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTodos = async () => {
    try {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const res = await axios.get("https://todo-backend-5m3x.onrender.com/todos/getTodos", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTodos(res.data.result);
    } catch (err) {
      toast.error("Failed to load tasks.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: "" }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setErrors((prev) => ({ ...prev, description: "" }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setTitle("");
    setDescription("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      fetchTodos();
    } catch (err) {
      toast.error("Failed to create task.");
    }
  }



  // const handleDelete = async (id) => {
  //   const confirmed = window.confirm("Are you sure you want to delete this task?");
  //   if (!confirmed) return;

  //   try {
  //     await axios.delete(`https://todo-backend-5m3x.onrender.com/todos/deleteTodo/${id}`, {
  //       headers: { Authorization: `${token}` },
  //     });
  //     toast.success("Task deleted.");
  //     fetchTodos();
  //   } catch (err) {
  //     toast.error("Failed to delete task.");
  //   }
  // };

  // Handle delete and show modal
  const handleDelete = (id) => {
    setTodoToDelete(id);
    setShowModal(true); // Show modal
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://todo-backend-5m3x.onrender.com/todos/deleteTodo/${todoToDelete}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success("Task deleted.");
      fetchTodos();
    } catch (err) {
      toast.error("Failed to delete task.");
    } finally {
      setShowModal(false); // Close the modal
      setTodoToDelete(null);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodoId(todo.id);
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
  };

  const handleEditAnother = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditedTitle("");
    setEditedDescription("");
    setErrors({})
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!editedTitle.trim()) newErrors.editedTitle = "Title is required!";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.put(
        `https://todo-backend-5m3x.onrender.com/todos/updateTodo/${editingTodoId}`,
        {
          title: editedTitle,
          description: editedDescription,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      toast.success("Task updated successfully!");
      setEditingTodoId(null);
      fetchTodos();
      setEditedTitle("");
      setEditedDescription("");
    } catch (err) {
      toast.error("Failed to update task.");
    }
  };

  const isFormFilled = title.trim() !== "" || description.trim() !== "";
  const isEditMode = editingTodoId !== null;

  return (
    <section className="flex flex-col items-center px-8 py-20 flex-grow bg-gray-50">
      <h1 className="text-3xl font-bold text-[#1a7dc3] mb-6" >Create Task</h1>
      <form className="flex flex-col items-center max-w-7xl w-full bg-white p-8 rounded-2xl shadow">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Task"
              value={isEditMode ? editedTitle : title}
              onChange={isEditMode ? (e) => setEditedTitle(e.target.value) : handleTitleChange}
              className={`w-60 h-11 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <p className="text-red-500 text-sm ml-1">{errors.title}</p>}
            {errors.editedTitle && <p className="text-red-500 text-sm ml-1">{errors.editedTitle}</p>}

          </div>

          <input
            type="text"
            placeholder="Description"
            value={isEditMode ? editedDescription : description}
            onChange={isEditMode ? (e) => setEditedDescription(e.target.value) : handleDescriptionChange}
            className="w-60 h-11 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            // disabled={!isFormFilled}
            onClick={isEditMode ? handleSaveEdit : handleSubmit}
            className={`w-40 h-11 ${isEditMode || isFormFilled ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"} text-white font-semibold rounded transition duration-200`}
          >
            {isEditMode ? "Update" : "Add"}
          </button>

          <button
            type="submit"
            onClick={isEditMode ? handleCancelEdit : handleCancel}
            className={`w-40 h-11 ${isEditMode || isFormFilled ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"} text-white font-semibold rounded transition duration-200`}
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={() => (navigate('/CreateTask'))}
            className="w-40 p-2 h-11 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-200"
          >
            Add Todo
          </button>
        </div>

        {/* Todos List */}
        <div className="mt-20 w-full max-w-5xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Tasks</h2>
          {todos.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : (
            // <ul className="space-y-4">
            //   {todos.map((todo) => (
            //     <li
            //       key={todo.id}
            //       className="bg-white p-4 shadow-md rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            //     >
            //       {editingTodoId === todo.id ? (
            //         <div className="flex flex-col sm:flex-row sm:items-start gap-2 w-full">
            //           <div className="flex flex-col flex-1">
            //             <input
            //               type="text"
            //               value={editedTitle}
            //               onChange={(e) => setEditedTitle(e.target.value)}
            //               placeholder="Edit task title"
            //               className={`p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-600 text-base ${errors.editedTitle ? "border-red-500" : "border-gray-300"
            //                 }`}
            //             />
            //             {errors.editedTitle && (
            //               <p className="text-red-500 text-sm mt-1">{errors.editedTitle}</p>
            //             )}
            //           </div>

            //           <input
            //             type="text"
            //             value={editedDescription}
            //             onChange={(e) => setEditedDescription(e.target.value)}
            //             placeholder="Edit task description"
            //             className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
            //           />

            //           <div className="flex gap-2">
            //             <button
            //               type="button"
            //               onClick={handleSaveEdit}
            //               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            //             >
            //               Save
            //             </button>
            //             <button
            //               type="button"
            //               onClick={handleCancelEdit}
            //               className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            //             >
            //               Cancel
            //             </button>
            //           </div>
            //         </div>

            //       ) : (
            //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
            //           <div className="flex-1">
            //             <h3 className="text-lg font-semibold">{todo.title}</h3>
            //             <p className="text-gray-600">{todo.description}</p>
            //             <span className="text-sm text-gray-400">
            //               {new Date(todo.createdAt).toLocaleString()}
            //             </span>
            //           </div>

            //           <div className="mt-3 flex flex-wrap gap-2">
            //             <button
            //               type="button"
            //               onClick={() => handleEdit(todo)}
            //               className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            //             >
            //               Edit
            //             </button>
            //             <button
            //               type="button"
            //               onClick={() => handleEditAnother(todo.id)}
            //               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            //             >
            //               Edit From Another Page
            //             </button>
            //             <button
            //               type="button"
            //               onClick={() => handleDelete(todo.id)}
            //               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            //             >
            //               Delete
            //             </button>
            //           </div>
            //         </div>
            //       )}
            //     </li>
            //   ))}
            // </ul>
            <ul className="space-y-4">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-white p-4 shadow-md rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{todo.title}</h3>
                      <p className="text-gray-600">{todo.description}</p>
                      <span className="text-sm text-gray-400">
                        {new Date(todo.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(todo)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEditAnother(todo.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Edit From Another Page
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(todo.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {showModal && (
        <Modal
          message="Are you sure you want to delete this task?"
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  )
}
