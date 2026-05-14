import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xl font-bold text-primary">Skill</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Bridge</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Connect with tutors and freelancers. Learn anything, hire anyone.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/tutors" className="hover:text-primary">Browse Tutors</Link></li>
            <li><Link href="/services" className="hover:text-primary">Browse Services</Link></li>
            <li><Link href="/match" className="hover:text-primary">AI Match</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/auth/signup" className="hover:text-primary">Become a Tutor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/auth/login" className="hover:text-primary">Login</Link></li>
            <li><Link href="/auth/signup" className="hover:text-primary">Sign Up</Link></li>
            <li><Link href="/profile" className="hover:text-primary">My Profile</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} SkillBridge. All rights reserved.
      </div>
    </footer>
  );
}
