import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  PercentBadgeIcon,
  DocumentCheckIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = localStorage.getItem("name");
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: DocumentTextIcon },
    { name: "Search", href: "/search", icon: MagnifyingGlassIcon },
    { name: "AI Q&A", href: "/qa", icon: SparklesIcon },
    { name: "Teams", href: "/team", icon: PercentBadgeIcon },
    { name: "Doc editor", href: "/docs", icon: DocumentCheckIcon },
  ];

  const logout = () => {
    handleSuccess("Logged out successfully");

    setTimeout(() => {
      // preserve theme before clearing
      const theme = localStorage.getItem("theme");

      // clear everything
      localStorage.clear();

      // restore theme
      if (theme) {
        localStorage.setItem("theme", theme);
      }

      navigate("/login");
    }, 1000);
  };

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "");

  const toggleTheme = () => {
    setTheme(theme === "theme-dark" ? "" : "theme-dark");
  };
  // Apply theme globally
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen  bg-[var(--color-bg-1)] ">
      <ToastContainer />

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-[#0000008a] bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[var(--color-bg-2)] shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-[var(--text-color)] bg-[var(--color-bg-2)]">
              Knowledge Hub
            </h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-[var(--text-color)]" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? " bg-[var(--nav-button-active-bg)] text-[var(--nav-button-active-text)] "
                      : " text-[var(--nav-button-text)] hover:bg-[var(--nav-button-hover-bg)] "
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className=" rounded-xl cursor-pointer  text-white flex items-center justify-center transition-colors duration-200"
              >
                {" "}
                {theme === "theme-dark" ? (
                  <SunIcon className="h-8 w-8 text-indigo-600 mr-2" />
                ) : (
                  <MoonIcon className="h-8 w-8 text-indigo-600 mr-2" />
                )}
              </button>{" "}
              <div className=" flex-1">
                <p className="text-sm font-medium text-gray-400">{user}</p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-[var(--color-bg-2)] border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <SparklesIcon className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold  text-[var(--text-color)]">
              Knowledge Hub
            </h1>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex  items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? " bg-[var(--nav-button-active-bg)] text-[var(--nav-button-active-text)] "
                      : " text-[var(--nav-button-text)] hover:bg-[var(--nav-button-hover-bg)] "
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 " />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className=" rounded-xl cursor-pointer  text-white flex items-center justify-center transition-colors duration-200"
              >
                {" "}
                {theme === "theme-dark" ? (
                  <SunIcon className="h-8 w-8 text-indigo-600 mr-2" />
                ) : (
                  <MoonIcon className="h-8 w-8 text-indigo-600 mr-2" />
                )}
              </button>{" "}
              <div className=" flex-1">
                <p className="text-sm font-medium text-[var(--text-color)]">
                  {user}
                </p>
              </div>
              <button
                onClick={logout}
                className="text-[var(--icon-color)] cursor-pointer hover:text-[var(--icon-hover-color)] transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b justify-between border-gray-200 bg-[var(--color-bg-2)] px-4 shadow-sm lg:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[var(--text-color)]"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-[var(--text-color)]">
              Knowledge Hub
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className=" rounded-xl cursor-pointer  text-white flex items-center justify-center transition-colors duration-200"
          >
            {" "}
            {theme === "theme-dark" ? (
              <SunIcon className="h-8 w-8 text-indigo-600 mr-2" />
            ) : (
              // <FaSun className="w-5 h-5" />
              <MoonIcon className="h-8 w-8 text-indigo-600 mr-2" />

              // <FaMoon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
