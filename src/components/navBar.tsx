import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center bg-gray-100 p-4 fixed top-0 w-full z-10">
      <div className="flex space-x-4 border-b-2 border-b-blue-400 w-80 items-center justify-evenly text-lg">
        <p
          className="px-4 py-1 text-black font-bold hover:cursor-pointer hover:underline hover:scale-110 transition-all duration-300 ease-in-out"
          onClick={() => navigate("/")}
        >
          Home
        </p>
        <p
          className="px-4 py-1 text-black font-bold hover:cursor-pointer hover:underline hover:scale-110 transition-all duration-300 ease-in-out"
          onClick={() => navigate("/login")}
        >
          Login
        </p>
        <p
          className="px-4 py-1 text-black font-bold hover:cursor-pointer hover:underline hover:scale-110 transition-all duration-300 ease-in-out"
          onClick={() => navigate("/register")}
        >
          Register
        </p>
      </div>
    </div>
  );
}
