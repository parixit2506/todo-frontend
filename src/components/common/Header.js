import { UserIcon } from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    toast.success("Logout successfully!")
    navigate('/login', { replace: true })
  }
  
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow">
        <h1 className="text-2xl font-bold hover:cursor-pointer" style={{color: "#1a7dc3"}}>TaskMaster</h1>
        <nav className="flex gap-3">
          <UserIcon className="w-9 h-9 text-[#1a7dc3] hover:text-[#166ca9] bg-blue-100 rounded-full p-1 transition-colors duration-300 cursor-pointer hover:bg-[#acd0eb]"
            onClick={() => navigate("/profile")}
          />
          <button
            type="button"
            className="px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800  dark:bg-red-600 dark:hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>
    </>
  )
} 