import React, { type ReactNode } from 'react';
import { Menu, X, LogOut, Leaf, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFarmerData } from '../../hooks/useFarmerData';

interface IFarmerLayoutProps {
  children: ReactNode;
  title: string;
  menuItems?: Array<{
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  }>;
}

export function FarmerLayout({ children, title, menuItems }: IFarmerLayoutProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { farmer } = useFarmerData();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const defaultMenuItems = [
    { label: 'Dashboard', onClick: () => navigate('/farmer'), icon: <Leaf className="w-5 h-5" /> },
    { label: 'My Reports', onClick: () => navigate('/farmer/reports'), icon: <FileText className="w-5 h-5" /> },
    { label: 'Recommendations', onClick: () => navigate('/farmer/advisor'), icon: <Sparkles className="w-5 h-5" /> },
  ];

  const activeMenuItems = menuItems && menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] min-w-[44px] md:hidden cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-bold text-zinc-900 dark:text-white truncate">{title}</h1>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 min-h-[44px] min-w-[44px] md:hidden cursor-pointer flex items-center justify-center"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-zinc-900 shadow-xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] min-w-[44px]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {activeMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => { item.onClick(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[48px] cursor-pointer"
                >
                  <span className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[48px] cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Grid Container */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar (Desktop view) */}
        <aside className="hidden md:flex md:w-64 flex-col space-y-1.5 shrink-0">
          {/* Profile Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Farmer Portal</p>
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{farmer?.name || 'Farmer Member'}</h3>
                <p className="text-[9px] text-zinc-500 truncate">Active Account</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {activeMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition text-left"
              >
                <span className="text-zinc-500 dark:text-zinc-400">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow min-w-0 pb-16">
          {children}
        </main>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}