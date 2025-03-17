interface WhiteCardProps {
  children: React.ReactNode;
}

export function WhiteCard({ children }: WhiteCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-6 rounded shadow-md w-96">{children}</div>
    </div>
  );
}
