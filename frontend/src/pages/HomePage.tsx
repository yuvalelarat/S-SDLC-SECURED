import { useEffect, useState } from "react";

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <div className="mt-20 justify-center items-center flex flex-col">
      <h1 className="text-4xl font-bold">Comunication_LTD </h1>
      {token ? <p>{`Token: ${token}`}</p> : <p>Please login to continue.</p>}
    </div>
  );
}
