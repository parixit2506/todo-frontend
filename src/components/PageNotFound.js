import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 px-6 text-center">
        <img
            src="/404-page not found.gif"
            alt="404 Page not found"
            className="w-auto h-96"
          />
      <h2 className="text-5xl font-semibold mb-4" style={{color: "#1a7dc3"}}>Page Not Found</h2>
      
      <p className="text-gray-500 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-[#1a7dc3] hover:bg-[#166ca9] px-6 py-2 text-white rounded transition"
      >
        Go to Home
      </button>
    </div>
  );
}
