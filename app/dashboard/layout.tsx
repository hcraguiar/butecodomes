import NavLinks from '../ui/dashboard/nav-links';
import Logo from '../ui/logo';
import Topbar from '../ui/dashboard/topbar';
import { ModalProvider } from '../context/modal-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className={`flex min-h-screen`}>
      {/* Sidebar (desktop only) */}
      <aside className="hidden md:flex md:flex-col w-64 bg-background text-foreground px-4 py-6">
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
        <main className="flex-1 p-4 bg-background text-foreground">
          <div className="container max-w-screen-xl mx-auto mb-20 md:mb-auto">
            <ModalProvider>
              {children}
            </ModalProvider>
          </div>
        </main>

        {/* Mobile Navbar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 border-t border-muted bg-background z-[9999]">
          <NavLinks />
        </nav>
      </div>
    </div>
  );
}
