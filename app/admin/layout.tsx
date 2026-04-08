import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-brand-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-brand-800">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-lg"
          >
            <span className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-sm font-black">
              M
            </span>
            Admin
          </Link>
        </div>
        <nav
          className="flex-1 px-3 py-4 space-y-1"
          aria-label="Admin navigation"
        >
          {[
            { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
            {
              href: "/admin/appointments",
              label: "Appointments",
              Icon: Calendar,
            },
            { href: "/admin/availability", label: "Availability", Icon: Users },
          ].map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-100/75 hover:text-white hover:bg-brand-800 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-brand-800">
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-100/60 hover:text-white hover:bg-brand-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
