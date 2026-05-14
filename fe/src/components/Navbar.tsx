import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/router";
import { useState } from "react";

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Skill</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Bridge</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/tutors" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">Tutors</Link>
            <Link href="/services" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">Services</Link>
            <Link href="/match" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">AI Match</Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">Blog</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary">
                  <img
                    src={user.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.name.split(" ")[0]}</span>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">Admin</Link>
                )}
                <button onClick={handleLogout} className="btn-outline text-sm py-2 px-4">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="p-2 text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
            <Link href="/tutors" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>Tutors</Link>
            <Link href="/services" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/match" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>AI Match</Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>Blog</Link>
            {user ? (
              <>
                <Link href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="text-left text-red-500 font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-outline text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/auth/signup" className="btn-primary text-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
