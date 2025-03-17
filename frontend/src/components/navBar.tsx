import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  const pStyles =
    "px-4 py-1 text-black font-bold hover:cursor-pointer hover:underline hover:scale-110 transition-all duration-300 ease-in-out";

  return (
    <div className="flex justify-center items-center p-4 fixed top-0 w-full z-10">
      <div className="flex space-x-4 border-b-2 border-b-blue-400 w-96 items-center justify-evenly text-lg">
        <p className={pStyles} onClick={() => navigate("/")}>
          Home
        </p>
        <p className={pStyles} onClick={() => navigate("/login")}>
          Login
        </p>
        <p className={pStyles} onClick={() => navigate("/register")}>
          Register
        </p>
      </div>
    </div>
  );
}
