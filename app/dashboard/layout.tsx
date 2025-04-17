import NavLinks from '../ui/dashboard/nav-links';
import Logo from '../ui/logo';
import Topbar from '../ui/dashboard/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className={`flex min-h-screen`}>
      {/* Sidebar (desktop only) */}
      <aside className="hidden md:flex md:flex-col w-64 bg-primary-light dark:bg-primary-dark text-foreground dark:text-white px-4 py-6">
        <Logo />
        <nav className="flex flex-col gap-4">
          <NavLinks />
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="flex-1 p-4 bg-primary dark:bg-dark-primary text-foreground dark:text-muted">
          <div className="container max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Navbar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center bg-secondary dark:bg-dark-secondary py-2 border-t dark:border-gray-700">
          <NavLinks />
        </nav>
      </div>
    </div>
  );
}
