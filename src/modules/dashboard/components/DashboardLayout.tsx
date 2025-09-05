import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Key,
  BarChart3,
  CreditCard,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  description: string;
}

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', description: 'Dashboard home' },
  {
    icon: Key,
    label: 'API Keys',
    path: '/dashboard/api-keys',
    description: 'Manage your API keys',
  },
  {
    icon: BarChart3,
    label: 'Usage',
    path: '/dashboard/usage',
    description: 'Analytics & usage statistics',
  },
  {
    icon: CreditCard,
    label: 'Billing',
    path: '/dashboard/billing',
    description: 'Plans & billing information',
  },
  { icon: FileText, label: 'Docs', path: '/dashboard/docs', description: 'SDK documentation' },
  {
    icon: Settings,
    label: 'Settings',
    path: '/dashboard/settings',
    description: 'Account settings',
  },
  { icon: HelpCircle, label: 'Support', path: '/dashboard/support', description: 'Help & support' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } mt-16`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-end h-12 px-6 border-b border-gray-200 lg:hidden">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1a1947]/10 via-[#2d4cc8]/10 to-[#4c7cf0]/10 text-[#2d4cc8] border border-[#2d4cc8]/20'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${isActive ? 'text-[#2d4cc8]' : 'text-gray-400'}`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 hidden xl:block">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Full-width top navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-h-[4rem]">
          <div className="flex items-center min-w-0">
            <button
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 flex-shrink-0 mr-3"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <img src="/logo-light.png" alt="Shunya Labs" className="h-8 w-auto flex-shrink-0" />
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 h-9 min-w-0 relative"
                >
                  <div className="w-7 h-7 bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'D'}
                    </span>
                  </div>
                  <div className="hidden md:flex flex-col items-start min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                      {user.name || 'Demo User'}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      {user.plan || 'Developer'} Plan
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 mt-1"
                sideOffset={5}
                avoidCollisions={true}
              >
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-base font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'D'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {user.name || 'Demo User'}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {user.plan || 'Developer'} Plan
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center cursor-pointer px-3 py-2"
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center cursor-pointer px-3 py-2"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer px-3 py-2"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen pt-16">
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
