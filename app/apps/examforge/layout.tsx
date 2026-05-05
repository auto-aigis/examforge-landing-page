import AuthProvider from "./_components/AuthProvider";

export default function ExamForgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 font-sans">{children}</div>
    </AuthProvider>
  );
}
