const sidebarSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "dashboard", active: true },
      { label: "Analytics", icon: "barChart" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Users", icon: "group" },
      { label: "Integrations", icon: "integration" },
      { label: "API Settings", icon: "api" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Audit Logs", icon: "description" },
      { label: "Settings", icon: "settings" },
    ],
  },
];

const stats = [
  { title: "Total Users", value: "12,450", icon: "group", trend: "+12%" },
  { title: "Active Integrations", value: "854", icon: "hub", trend: "+5%" },
  { title: "API Calls (24h)", value: "1.2M", icon: "api", trend: "+8%" },
];

const users = [
  {
    name: "Sarah Jenkins",
    role: "Admin",
    joinDate: "Oct 24, 2023",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqf0f7CKX_tCcu2q03H_C45fv474SVfu_-5C9nunFkfaLM-gGprV7pceZJ8SUv3g9SFQ5IC5hoK6OuO9D8aUFsZV1AKWhdWvDnJdQ63ZuCB0KAfKSgdbM1MyFpBDcA0zMMhPxwN95nTjqtY_xjUIcz6SX4x8D79LDzmMhOUekP92TRwyRxqoFsrgAoACte5VLH1B5626f2LFO9kW6vI7C6GIo6CPLS5FzeIGdACRhcbTpnfaar4xWty5CT1p0wkR_YGNORFQj9Jjl7",
  },
  {
    name: "Michael Chen",
    role: "User",
    joinDate: "Oct 23, 2023",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYK9efvd3ETgiNfGohPQy5S7QylCcJzPN-wCLvgrC1CwQ2zt397a6pFdYqkZ_oxrLbquRZo4sUJRB1A5Lt0vyQ2Jrj3Jv_P-1n6JOFKMBMWFX3Qtd7gM4GA9oEqw0rk-U15srVwepclMA-3gpyf4C1GlDVWNmVhe9gA_YUTS1LDnBWYLcs3zkQMZt4gIiGZDUkRePoP3lvOsQoXiq7UC7qXa77HISTUtsHSjOtJzg-96lIVhML_2OQM6pPKPpBQvx02wiuFkLVX07G",
  },
  {
    name: "Jessica Wu",
    role: "User",
    joinDate: "Oct 23, 2023",
    status: "Pending",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBj-S2FNLTrsIleIENd8TLikPbn7ryvNZSamV9wzfutoaYJqtsy83xJqC7Q_5H8UcqUhi8tyRo9R5bLIQ2Ay0Co7wWtaewOiASKiLnG5oKCg3JHGN_yQUp-Hk5oVnIWM_cYnytnztTnmF7N1Y97GZ8HVFFlH4jSF03PRDDJ1plrFt4ZtpXc86AfI0FBtjzaWdU6q_EzzI3zrh2MVjpMHKGJqMHb00X6i9JHWPRw9FCeDLlWii8ePpXPv00N4zGxR_BeGsOCYAuFD5op",
  },
  {
    name: "David Miller",
    role: "User",
    joinDate: "Oct 22, 2023",
    status: "Suspended",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtLBVD6hlLcUEwDT_kUSI3FZnq6chZnewAsiyBQXWRx7Apoti1N7xqlMOz4h5KIE5j7QYbCwOgGUCnnnr7drGWPqUAS3oUrRY_JRxB8MDK414f8Gz87TuDSIPy1Ad4EkX4gdM2JAuU7Q_lCkKpS2njlBeqOB8XJY6AMFNAvicgZ8WsD5sswsucrdADpOThfktiBlZR5XNfxhg4NfBIEZJq9skb1-lj6zGdRjE6KupFMhnfOpTfH0S6bpoZ9nx0iH_sBLC6xB9pQQgE",
  },
  {
    name: "Emily Davis",
    role: "User",
    joinDate: "Oct 22, 2023",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABj_qFA6iybZPJBRpv0HdYbabTOuEBFzjZdLvjdY2hpbt9BBhbEF3sgiQ5GJiTt6BmMXDSWRYdYp7EBffSs8jJpfhwvZ3YQI-byL_vYr8n2xocLQ4pXMFX3363WjgNK4s7MkEOTRK4P6KfHgqbXwQIaQ5Sk300q3myh6tRQUzaTczLnyf8H6WVbOzAJ2YewOJkGfx9s1efmKzYT2wu0m-J9jxsVjOj3rsPjkUjcyUJG2sVIyHzjNM2ryY-VFz8LgwhKWWvhDLn_qH7",
  },
];

const logs = [
  {
    title: "500 Internal Error",
    time: "2m ago",
    route: "GET /api/v1/portfolio/u/sjenkins",
    level: "Critical",
    action: "View Trace",
    tone: "critical",
  },
  {
    title: "429 Too Many Requests",
    time: "15m ago",
    route: "POST /api/v1/sync/github",
    level: "Warning",
    action: "Block IP",
    tone: "warning",
  },
  {
    title: "404 Not Found",
    time: "23m ago",
    route: "GET /assets/img/missing.png",
    level: "Info",
    tone: "info",
  },
  {
    title: "401 Unauthorized",
    time: "45m ago",
    route: "GET /api/v1/admin/config",
    level: "Info",
    tone: "info",
  },
];

function Icon({ name, className = "size-5" }) {
  if (name === "layers") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 16l9 5 9-5" />
      </svg>
    );
  }
  if (name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="5" rx="1" />
        <rect x="13" y="10" width="8" height="11" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
      </svg>
    );
  }
  if (name === "barChart") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 20V8" />
        <path d="M10 20V4" />
        <path d="M16 20v-6" />
        <path d="M22 20v-9" />
      </svg>
    );
  }
  if (name === "group") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 18a5.5 5.5 0 0111 0" />
        <path d="M14 18a4 4 0 014-3.5" />
      </svg>
    );
  }
  if (name === "integration") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 8h5" />
        <path d="M13 16h5" />
        <path d="M8 6a2 2 0 100 4 2 2 0 000-4z" />
        <path d="M16 14a2 2 0 100 4 2 2 0 000-4z" />
        <path d="M11 8l2 2-2 2" />
      </svg>
    );
  }
  if (name === "api") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h10" />
        <path d="M7 12h6" />
        <path d="M7 15h8" />
      </svg>
    );
  }
  if (name === "description") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
        <path d="M9 12h6" />
      </svg>
    );
  }
  if (name === "settings") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.5h.1a1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.5 1z" />
      </svg>
    );
  }
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    );
  }
  if (name === "notifications") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M13.7 21a2 2 0 01-3.4 0" />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    );
  }
  if (name === "cloudDownload") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20 16.5A4.5 4.5 0 0017 8h-1A6 6 0 004 11.5" />
        <path d="M12 12v8" />
        <path d="M8.5 16.5L12 20l3.5-3.5" />
      </svg>
    );
  }
  if (name === "add") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }
  if (name === "hub") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="M12 7v6" />
        <path d="M12 13l-6 4" />
        <path d="M12 13l6 4" />
      </svg>
    );
  }
  if (name === "trendingUp") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 17l6-6 4 4 7-7" />
        <path d="M14 8h6v6" />
      </svg>
    );
  }
  if (name === "edit") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    );
  }
  if (name === "refresh") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 12a9 9 0 10-3 6.7" />
        <path d="M21 3v6h-6" />
      </svg>
    );
  }
  if (name === "error") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v5h2V10z" />
      </svg>
    );
  }
  if (name === "warning") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2v-6z" />
      </svg>
    );
  }
  if (name === "info") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    );
  }

  return null;
}

function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-plum-900 text-amber-500">
          <Icon name="layers" className="size-5" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-900">GrowFolio</h1>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          {sidebarSections.map((section) => (
            <div key={section.title} className="px-2 py-3">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{section.title}</p>
              <div className="mt-2 flex flex-col gap-1">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className={
                      item.active
                        ? "flex items-center gap-3 rounded-lg bg-plum-50 px-3 py-2 text-sm font-medium text-plum-900"
                        : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-plum-900"
                    }
                  >
                    <Icon name={item.icon} className="size-5" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbj3HSxo0WV3dAmwNRACYUwQ0rCb7CtmBN20ltUo6cbgGwlH5aJRnNOV5zE3qlHL4nA56H6HpHfaCvL8rEdGW1GVtxn_Kue-jCnP28mEcRjJSzSoS4RS9ZDoTDAM41y5m0-s-aSxVftm7NX585X9GDd5cZQKkj6CWeDW71hCAzG-vhphb82JFf0hMHSI68nEL_HeO23xCwzAnkvIrofPhlaS5o7ny7VAi_ZKs-h5obK7n6DT-gWvpi4lpp6egdMAwYECV6GjhdXohe"
              alt="Admin user profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-plum-100"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">Sarah Jenkins</span>
              <span className="text-xs text-slate-500">Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon name="home" className="size-5" />
        <span>/</span>
        <span className="font-medium text-slate-900">Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="absolute left-2.5 top-2.5 text-slate-400">
            <Icon name="search" className="size-5" />
          </span>
          <input
            type="text"
            placeholder="Search users, logs..."
            className="h-10 w-64 rounded-lg border-0 bg-slate-100 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-plum-500/20"
          />
        </div>

        <button type="button" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Notifications">
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
          <Icon name="notifications" className="size-6" />
        </button>

        <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
          <Icon name="menu" className="size-6" />
        </button>
      </div>
    </header>
  );
}

function OverviewActions() {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-plum-950">Platform Overview</h2>
        <p className="text-sm text-slate-500">Monitor key metrics and system health.</p>
      </div>

      <div className="flex gap-3">
        <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          <Icon name="cloudDownload" className="size-5" />
          Export Report
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-plum-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-plum-800"
        >
          <Icon name="add" className="size-5" />
          Add User
        </button>
      </div>
    </div>
  );
}

function StatCards() {
  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.title}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-plum-100 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-plum-50 text-plum-900">
              <Icon name={stat.icon} className="size-5" />
            </div>
            <span className="flex items-center rounded-full border border-amber-100 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
              <Icon name="trendingUp" className="mr-1 size-3.5" />
              {stat.trend}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}

function RolePill({ role }) {
  if (role === "Admin") {
    return (
      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
        {role}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
      {role}
    </span>
  );
}

function StatusPill({ status }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
        Active
      </span>
    );
  }

  if (status === "Suspended") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
        Suspended
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      Pending
    </span>
  );
}

function SignupTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Recent User Signups</h3>
        <a href="#" className="text-sm font-medium text-plum-600 hover:text-plum-800">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-plum-900 text-xs uppercase text-white">
            <tr>
              <th className="px-6 py-3 font-semibold tracking-wider opacity-90">User</th>
              <th className="px-6 py-3 font-semibold tracking-wider opacity-90">Role</th>
              <th className="px-6 py-3 font-semibold tracking-wider opacity-90">Join Date</th>
              <th className="px-6 py-3 font-semibold tracking-wider opacity-90">Status</th>
              <th className="px-6 py-3 text-right font-semibold tracking-wider opacity-90">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.name} className="group hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                    <div className="font-medium text-slate-900">{user.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RolePill role={user.role} />
                </td>
                <td className="px-6 py-4 text-slate-500">{user.joinDate}</td>
                <td className="px-6 py-4">
                  <StatusPill status={user.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" className="text-slate-400 hover:text-plum-600" aria-label={`Edit ${user.name}`}>
                    <Icon name="edit" className="size-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LogEntry({ log }) {
  const toneClass =
    log.tone === "critical"
      ? "border-red-100 bg-red-50/50"
      : log.tone === "warning"
      ? "border-amber-100 bg-amber-50/50"
      : "border-slate-200 bg-white hover:bg-slate-50";

  const iconTone = log.tone === "critical" ? "text-red-500" : log.tone === "warning" ? "text-amber-500" : "text-slate-400";
  const iconName = log.tone === "critical" ? "error" : log.tone === "warning" ? "warning" : "info";

  const badgeTone =
    log.tone === "critical"
      ? "bg-red-100 text-red-700"
      : log.tone === "warning"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-600";

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${toneClass}`}>
      <div className={`mt-0.5 ${iconTone}`}>
        <Icon name={iconName} className="size-5" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">{log.title}</p>
          <span className="text-xs text-slate-500">{log.time}</span>
        </div>
        <p className="mt-1 font-mono text-xs text-slate-600">{log.route}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${badgeTone}`}>{log.level}</span>
          {log.action ? (
            <button type="button" className="text-[10px] font-medium text-plum-600 hover:underline">
              {log.action}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SystemHealthPanel() {
  return (
    <section className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-1">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">System Health / Error Logs</h3>
        <button type="button" className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600" aria-label="Refresh logs">
          <Icon name="refresh" className="size-5" />
        </button>
      </div>

      <div className="max-h-[400px] flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {logs.map((log) => (
            <LogEntry key={`${log.title}-${log.time}`} log={log} />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 p-3 text-center">
        <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-900">
          View Full System Log
        </a>
      </div>
    </section>
  );
}

function DashboardContent() {
  return (
    <div className="p-6 md:p-8">
      <OverviewActions />
      <StatCards />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <SignupTable />
        <SystemHealthPanel />
      </div>
    </div>
  );
}

function AdminDashboardPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light font-display text-slate-900 antialiased">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-background-light">
        <TopBar />
        <DashboardContent />
      </main>
    </div>
  );
}

export default AdminDashboardPage;
