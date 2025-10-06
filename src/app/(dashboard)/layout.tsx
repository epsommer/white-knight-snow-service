import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get user session and role from NextAuth
  const userRole = 'ADMIN'; // Temporary
  const userName = 'Admin User'; // Temporary

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
