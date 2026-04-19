const navLinks = [
	{ label: "Projects", href: "#projects" },
	{ label: "Articles", href: "#articles" },
	{ label: "Contact", href: "#contact" },
];

const socialLinks = [
	{ label: "Teams", icon: "group", href: "#" },
	{ label: "Code", icon: "code", href: "#" },
	{ label: "Chat", icon: "chat", href: "#" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const projects = [
	{
		title: "E-Commerce API v2",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCm_8O5u9f0kCPbhFvZydv18YAW2n1Z74zUzdNZ0NYp-j97rs0h5LLGKUGmSTaFKcf6qsHeOiKdUxf54dpf3GqNCrseBAX7fUtdTYtX1M460Uah2G21BgY5nf-b5WpA2YrgzAUJjYlsNhgXGxid36l5P7KS5Bksk3VJ4986reruoaLVT7ftWmE7KTF4L7f4pU1QY3amFhsZ3Cz_YKlO2gIk2S7XlIzBKPcdb1oxk5FNWJIiNLhvVhtV5W6ZREaOgPQTqd81VJTEc4eH",
		imageAlt: "E-Commerce API Dashboard",
		description:
			"A high-performance, headless e-commerce backend built for scalability. Handles 10k+ concurrent requests with < 50ms latency.",
		stars: "1.2k",
		tech: ["Node.js", "GraphQL", "Docker", "Redis"],
		featured: true,
	},
	{
		title: "HealthDash",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBp_MWWMhKIlcANBbS8zSjTcZcdEhtGU8R6pW3CobFRnRjk8PAbtr523Gvm_HGI_gQBrepomFyi111nPQZSclsBCBBe1B_XQKgEjVkbHVAtu7Svt-6-yRk5WXqurjW4bl6HRziplw6veHtCMvdaoP11yyt2Y09MAEKVIxBpSRZ_sLfhoLaRYpfKzKddlfDlAIFrNDfDyRYNR6hQSun5TOpRauCCimst82P86h8o2RTsQRJcODStrmB2lNCLJIeEKjVtpqcC9zRzHOC9",
		imageAlt: "HealthDash Analytics Interface",
		description:
			"Real-time patient monitoring dashboard for healthcare providers. Visualizes vital signs using D3.js with WebSocket integration.",
		tech: ["React", "D3.js", "Tailwind"],
	},
	{
		title: "PortfolioTracker",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCSvOTPCge02Vlp0eX6gLT6SFLusjVvIOlZ-8ufkaQee12vS5iIP2LOK4U8YBEDJNE_AdepWDgVSJqvnCBOzGH_4OV55SQpbBtkg1n0xngFxDHJsbcvnalR3s4j9KULHTq-UJ7OyCEdz_zL1-104l_U1uO9uFISxt-No6QiV7-VhBAe8pqM0fkqUBihib_5gsfhhgvoJ7VBrSrRqBrm44mqwQ1iJdTHSB34eaQ0N9cxDXQxl_r-MQRK-CN-_HKl1f09nWnkc5RHcPR7",
		imageAlt: "FinTech Portfolio Tracker",
		description:
			"Personal finance aggregator that pulls data from Plaid API and visualizes spending habits and investment growth over time.",
		tech: ["Next.js", "Supabase", "Plaid API"],
	},
	{
		title: "DevOps CLI",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDTQ3MEkSkHLzBVTmXczE1Wulv0BzXG30k4DnuT1P-Zq6jozi6-Npvi_CWwrvW-uQYHwQIkxzg-2Ru_S-9Tc4G-VFM0StbbaHckz4pgJJVoQAAuSIMsXrL7iVXv_Lj_nJDR-LTHO2zJfiAWK8MN6sv3p8Gou5hCywY5DEvjfbQvh7ETEL-3pl6UYjN9wA54VEe_WUcw5S5RQskLtvSNzkIS-r1F8Xko9etP0zCPWSZE5eNGzpp_-TjROgJroYyoNYYQuGk9z4W7vx5Y",
		imageAlt: "CLI Tool",
		description:
			"A command-line interface tool written in Rust to automate AWS infrastructure deployment and environment syncing.",
		tech: ["Rust", "AWS SDK"],
		darkCover: true,
	},
];

const articles = [
	{
		title: "Optimizing API Latency at Scale",
		summary: "Strategies for caching and database indexing that reduced our p99 latency by 40%.",
		date: "Oct 12, 2023",
		readTime: "5 min read",
		source: "Dev.to",
	},
	{
		title: "React Server Components: A Deep Dive",
		summary: "Understanding the shift in mental model and how to migrate large scale applications.",
		date: "Sep 28, 2023",
		readTime: "8 min read",
		source: "Medium",
	},
];

const papers = [
	{
		title: "Machine Learning in High-Frequency FinTech Trading",
		venue: "Published in IEEE Transactions on Neural Networks",
		year: "2022",
	},
	{
		title: "Distributed Ledger Scalability Analysis",
		venue: "Presented at Crypto 2021 Conference",
		year: "2021",
	},
];

const contributionPalette = [
	"bg-gray-100",
	"bg-plum-200",
	"bg-plum-400",
	"bg-plum-600",
	"bg-amber-400",
];

const contributionCells = Array.from({ length: 364 }, (_, index) => {
	// Deterministic pattern for stable rendering and a natural spread.
	const level = index % 17 === 0 ? 4 : index % 7 === 0 ? 3 : index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0;
	return level;
});

function Icon({ name, className = "size-5" }) {
	if (name === "workspaces") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
				<rect x="3" y="4" width="8" height="7" rx="1.5" />
				<rect x="13" y="4" width="8" height="7" rx="1.5" />
				<rect x="8" y="13" width="8" height="7" rx="1.5" />
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

	if (name === "download") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M12 4v10" />
				<path d="M8 10l4 4 4-4" />
				<path d="M4 20h16" />
			</svg>
		);
	}

	if (name === "mail") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<rect x="3" y="5" width="18" height="14" rx="2" />
				<path d="M3 7l9 6 9-6" />
			</svg>
		);
	}

	if (name === "group") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
				<circle cx="9" cy="8" r="3" />
				<circle cx="17" cy="9" r="2.5" />
				<path d="M3.5 18a5.5 5.5 0 0111 0" />
				<path d="M14 18a4 4 0 014-3.5" />
			</svg>
		);
	}

	if (name === "code") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M8 8l-4 4 4 4" />
				<path d="M16 8l4 4-4 4" />
				<path d="M14 4l-4 16" />
			</svg>
		);
	}

	if (name === "chat") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M21 11.5A8.5 8.5 0 1112.5 3 8.5 8.5 0 0121 11.5z" />
				<path d="M8 10h8" />
				<path d="M8 14h5" />
			</svg>
		);
	}

	if (name === "arrowForward") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M5 12h14" />
				<path d="M13 5l7 7-7 7" />
			</svg>
		);
	}

	if (name === "openInNew") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M14 5h5v5" />
				<path d="M10 14L19 5" />
				<path d="M19 13v6H5V5h6" />
			</svg>
		);
	}

	if (name === "star") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
				<path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3z" />
			</svg>
		);
	}

	if (name === "terminal") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M4 6l5 5-5 5" />
				<path d="M12 16h8" />
			</svg>
		);
	}

	if (name === "article") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M6 4h12v16H6z" />
				<path d="M9 8h6" />
				<path d="M9 12h6" />
				<path d="M9 16h4" />
			</svg>
		);
	}

	if (name === "school") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M2 8l10-5 10 5-10 5-10-5z" />
				<path d="M6 10.5V15c0 1.8 2.7 3.5 6 3.5s6-1.7 6-3.5v-4.5" />
			</svg>
		);
	}

	if (name === "calendar") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<rect x="3" y="5" width="18" height="16" rx="2" />
				<path d="M8 3v4" />
				<path d="M16 3v4" />
				<path d="M3 10h18" />
			</svg>
		);
	}

	if (name === "schedule") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<circle cx="12" cy="12" r="9" />
				<path d="M12 7v6l4 2" />
			</svg>
		);
	}

	if (name === "pdf") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M6 3h8l4 4v14H6z" />
				<path d="M14 3v4h4" />
				<path d="M8 14h8" />
			</svg>
		);
	}

	return null;
}

function Header() {
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between border-b border-plum-100 bg-white/95 px-6 py-3 backdrop-blur-md lg:px-40">
			<div className="flex items-center gap-4 text-plum-900">
				<div className="flex size-8 items-center justify-center rounded-lg bg-plum-50 text-plum-900">
					<Icon name="workspaces" className="size-5" />
				</div>
				<h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-plum-900">GrowFolio</h2>
			</div>

			<div className="hidden flex-1 items-center justify-end gap-8 md:flex">
				<nav className="flex items-center gap-9">
					{navLinks.map((link) => (
						<a key={link.label} href={link.href} className="text-sm font-medium text-plum-900 transition-colors hover:text-amber-500">
							{link.label}
						</a>
					))}
				</nav>
				<button
					type="button"
					className="flex h-9 items-center justify-center rounded-xl bg-plum-900 px-4 text-sm font-bold text-white shadow-sm ring-2 ring-transparent transition-colors hover:bg-plum-800 hover:ring-plum-200"
				>
					<span className="truncate">Create Your Portfolio</span>
				</button>
			</div>

			<div className="md:hidden">
				<button type="button" className="p-2 text-plum-900" aria-label="Open menu">
					<Icon name="menu" className="size-6" />
				</button>
			</div>
		</header>
	);
}

function HeroSection() {
	return (
		<section className="relative flex w-full flex-col items-center overflow-hidden bg-gradient-to-br from-plum-900 to-plum-700 px-6 py-12 text-center lg:py-24">
			<div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
				<div className="absolute left-[-10%] top-[-20%] h-1/2 w-1/2 rounded-full bg-amber-400 blur-[120px]" />
				<div className="absolute bottom-[-20%] right-[-10%] h-3/5 w-2/5 rounded-full bg-plum-400 blur-[100px]" />
			</div>

			<div className="relative z-10 flex flex-col items-center">
				<div className="group relative mb-6">
					<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-plum-300 opacity-40 blur transition duration-500 group-hover:opacity-60" />
					<img
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgaLZTzLzbnF6VnhB84Os_hhhFrBmU6C38yaoZCx3WTPSYlcVJL2ORDUaynND_hEKEBfEk0LfLISmA3d6oeW2817Qkx-tIg_ndvACp5GysCjlYNi9I9HYUhAE077939PRJVSIlujUiBVkrptFwZpJWfsACwQgcdXyfC34d9BAzU9bvnTNpCZktbyjfJkLMdeZCMYzKooajl3nVPI_6wlf21hoDt3EQ_VqqtqstGcnlNBPUdEvtq44fGIPzVTOqlKyyvy_l9L01c9X2"
						alt="Professional headshot of Alex Sterling"
						className="relative size-36 rounded-full border-4 border-white/10 object-cover shadow-xl"
					/>
				</div>

				<h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">Alex Sterling</h1>
				<p className="mb-6 text-sm font-semibold uppercase tracking-wide text-amber-400">Senior Full-Stack Engineer</p>
				<p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-plum-100">
					Specializing in React, Node.js, and cloud architecture. I turn complex problems into scalable code and coffee into deployments.
				</p>

				<div className="mb-12 flex flex-wrap justify-center gap-4">
					<button
						type="button"
						className="flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 text-base font-bold text-plum-900 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]"
					>
						<Icon name="download" className="size-5" />
						<span>Download CV</span>
					</button>
					<button
						type="button"
						className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
					>
						<Icon name="mail" className="size-5" />
						<span>Contact Me</span>
					</button>
				</div>

				<div className="flex items-center justify-center gap-4">
					{socialLinks.map((item) => (
						<a
							key={item.label}
							href={item.href}
							className="group flex flex-col items-center gap-1 text-plum-100 transition-colors hover:text-amber-400"
							aria-label={item.label}
						>
							<div className="rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all group-hover:border-amber-400/50 group-hover:bg-amber-400/10">
								<Icon name={item.icon} className="size-6" />
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

function ContributionSection() {
	return (
		<section className="flex w-full justify-center border-b border-plum-100 bg-background-subtle py-12">
			<div className="w-full max-w-[960px] px-6">
				<div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
					<div>
						<h2 className="text-2xl font-bold text-plum-900">Contribution Activity</h2>
						<p className="mt-1 text-text-secondary">2,432 contributions in the last year</p>
					</div>
					<div className="flex items-center gap-2 rounded-full border border-plum-100 bg-white px-3 py-1 text-sm shadow-sm">
						<span className="size-2 rounded-full bg-amber-500" />
						<span className="font-medium text-plum-800">Top 5% of contributors</span>
					</div>
				</div>

				<div className="overflow-x-auto rounded-2xl border border-plum-100 bg-white p-6 shadow-sm">
					<div className="min-w-[700px]">
						<div className="mb-2 flex justify-between pl-8 text-xs font-medium text-text-secondary">
							{months.map((month) => (
								<span key={month}>{month}</span>
							))}
						</div>

						<div className="flex gap-2">
							<div className="flex h-[110px] flex-col justify-between pb-2 pt-2 text-[10px] text-text-secondary">
								<span>Mon</span>
								<span>Wed</span>
								<span>Fri</span>
							</div>

							<div className="grid h-[110px] flex-1 grid-flow-col grid-rows-7 gap-1">
								{contributionCells.map((level, index) => (
									<div
										key={index}
										className={`h-full w-full cursor-pointer rounded-[2px] ${contributionPalette[level]} transition-all hover:ring-2 hover:ring-plum-300`}
										title="Contributions on this day"
									/>
								))}
							</div>
						</div>

						<div className="mt-4 flex items-center justify-end gap-2 text-xs text-text-secondary">
							<span>Less</span>
							<div className="flex gap-1">
								{contributionPalette.map((swatch) => (
									<div key={swatch} className={`size-3 rounded-[2px] ${swatch}`} />
								))}
							</div>
							<span>More</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function ProjectCard({ project }) {
	return (
		<article className="group flex flex-col overflow-hidden rounded-2xl border border-plum-100 bg-white shadow-sm transition-all duration-300 hover:border-plum-300 hover:shadow-xl hover:shadow-plum-900/5">
			<div
				className={`relative h-48 w-full overflow-hidden ${
					project.darkCover ? "flex items-center justify-center bg-plum-900" : "bg-gray-100"
				}`}
			>
				{project.darkCover && <div className="absolute inset-0 bg-gradient-to-br from-plum-800 to-black" />}
				{project.darkCover && <Icon name="terminal" className="relative z-10 size-14 text-amber-400/50" />}

				<img
					src={project.image}
					alt={project.imageAlt}
					className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
						project.darkCover ? "absolute inset-0 opacity-30 mix-blend-overlay" : ""
					}`}
				/>

				{project.featured && (
					<div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-plum-900/90 px-2 py-1 shadow-sm backdrop-blur">
						<Icon name="star" className="size-4 text-amber-400" />
						<span className="text-xs font-bold text-white">{project.stars}</span>
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col p-6">
				<div className="mb-2 flex items-start justify-between">
					<h3 className="text-xl font-bold text-plum-900 transition-colors group-hover:text-plum-700">{project.title}</h3>
					<div className="flex gap-2">
						<a href="#" className="text-text-secondary transition-colors hover:text-amber-500" title="View Code" aria-label="View Code">
							<Icon name="code" className="size-5" />
						</a>
						{!project.darkCover && (
							<a href="#" className="text-text-secondary transition-colors hover:text-amber-500" title="Live Demo" aria-label="Live Demo">
								<Icon name="openInNew" className="size-5" />
							</a>
						)}
					</div>
				</div>

				<p className="mb-4 line-clamp-2 text-sm text-text-secondary">{project.description}</p>

				<div className="mt-auto flex flex-wrap gap-2">
					{project.tech.map((tag) => (
						<span
							key={tag}
							className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
								tag === "Docker" || tag === "D3.js" || tag === "Supabase" || tag === "Rust"
									? "border-amber-100 bg-amber-50 text-amber-700"
									: "border-plum-100 bg-plum-50 text-plum-700"
							}`}
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</article>
	);
}

function ProjectsSection() {
	return (
		<section id="projects" className="w-full max-w-[960px] px-6 py-16">
			<div className="mb-10 flex items-center justify-between gap-4">
				<h2 className="border-l-4 border-amber-400 pl-4 text-3xl font-bold text-plum-900">Featured Projects</h2>
				<a href="#" className="flex items-center gap-1 font-medium text-plum-700 transition-colors hover:text-amber-600 hover:underline">
					View all <Icon name="arrowForward" className="size-4" />
				</a>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{projects.map((project) => (
					<ProjectCard key={project.title} project={project} />
				))}
			</div>
		</section>
	);
}

function ArticlesAndPapersSection() {
	return (
		<section id="articles" className="flex w-full justify-center border-t border-plum-100 bg-white py-16">
			<div className="flex w-full max-w-[960px] flex-col gap-12 px-6 md:flex-row">
				<div className="flex-1">
					<div className="mb-6 flex items-center gap-3">
						<div className="rounded-lg bg-plum-50 p-2 text-plum-700">
							<Icon name="article" className="size-5" />
						</div>
						<h2 className="text-2xl font-bold text-plum-900">Recent Articles</h2>
					</div>

					<div className="flex flex-col gap-4">
						{articles.map((article) => (
							<a
								key={article.title}
								href="#"
								className="group block rounded-xl border border-transparent p-4 transition-colors hover:border-plum-100 hover:bg-plum-50"
							>
								<div className="flex items-start justify-between">
									<h3 className="text-lg font-bold text-plum-900 transition-colors group-hover:text-plum-700">{article.title}</h3>
									<Icon name="openInNew" className="size-5 text-plum-200 transition-colors group-hover:text-amber-500" />
								</div>

								<p className="mb-3 mt-1 text-sm text-text-secondary">{article.summary}</p>

								<div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-secondary">
									<span className="flex items-center gap-1">
										<Icon name="calendar" className="size-[14px]" />
										{article.date}
									</span>
									<span className="flex items-center gap-1">
										<Icon name="schedule" className="size-[14px]" />
										{article.readTime}
									</span>
									<span className="rounded border border-amber-100 bg-amber-50 px-2 py-0.5 text-amber-700">{article.source}</span>
								</div>
							</a>
						))}
					</div>
				</div>

				<div className="flex-1" id="contact">
					<div className="mb-6 flex items-center gap-3">
						<div className="rounded-lg bg-amber-50 p-2 text-amber-600">
							<Icon name="school" className="size-5" />
						</div>
						<h2 className="text-2xl font-bold text-plum-900">Research &amp; Papers</h2>
					</div>

					<div className="flex flex-col gap-4">
						{papers.map((paper) => (
							<article key={paper.title} className="rounded-xl border border-plum-100 bg-background-subtle p-5 transition-shadow hover:shadow-md">
								<div className="flex items-start gap-3">
									<Icon name="pdf" className="mt-1 size-5 text-plum-400" />
									<div>
										<h3 className="text-base font-bold leading-snug text-plum-900">{paper.title}</h3>
										<p className="mb-2 mt-1 text-sm text-text-secondary">{paper.venue}</p>
										<div className="flex gap-3">
											<a href="#" className="flex items-center gap-1 text-xs font-bold text-amber-600 transition-colors hover:text-amber-700 hover:underline">
												Read Paper <Icon name="openInNew" className="size-3" />
											</a>
											<span className="text-xs text-text-secondary">{paper.year}</span>
										</div>
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer className="w-full border-t border-plum-100 bg-white py-8 text-center">
			<div className="flex flex-col items-center gap-4">
				<div className="flex items-center gap-2 text-plum-900 opacity-50">
					<Icon name="workspaces" className="size-5" />
					<span className="text-sm font-bold tracking-tight">GrowFolio</span>
				</div>
				<p className="text-sm text-text-secondary">Powered by GrowFolio. Create your own professional portfolio in minutes.</p>
				<button type="button" className="text-sm font-bold text-plum-700 transition-colors hover:text-amber-600 hover:underline">
					Get Started Free
				</button>
			</div>
		</footer>
	);
}

function PublicPortfolio() {
	return (
		<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-text-main antialiased dark:bg-background-dark">
			<Header />

			<main className="flex w-full flex-grow flex-col items-center">
				<HeroSection />
				<ContributionSection />
				<ProjectsSection />
				<ArticlesAndPapersSection />
			</main>

			<Footer />
		</div>
	);
}

export default PublicPortfolio;
