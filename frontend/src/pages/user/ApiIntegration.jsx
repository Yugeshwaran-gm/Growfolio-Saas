const navLinks = ["Dashboard", "Portfolio", "Analytics", "Settings"];

const categoryFilters = [
	{ label: "All", icon: "grid", active: true },
	{ label: "Development", icon: "code", active: false },
	{ label: "Writing", icon: "edit", active: false },
	{ label: "Media", icon: "play", active: false },
];

const integrations = [
	{
		name: "GitHub",
		description: "Showcase top repos and contribution graph automatically.",
		connected: true,
		logoType: "image",
		logoAlt: "GitHub logo",
		logoSrc:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCCiOUVIr1laiZuhQDHKh2BUkZ4Rdixi0yrekv6vL6wo5ZUvHYvkqcjzXzrumTUOYyfKq_28g5hTIHP-BDpWz6Rusz557nm6dHT23GhteHjVG3-THdkwdP5tJJu0Eu-vuTXMNqqng7gjntJBSWiIYz7IlM6L62NvLjIDkIzF3cAgXWwE_q-xDkcPKTOckBeeD6itLXV4FHZj-IFy_KRt3N88SJDfLQQC2uQAVNEjCDch_BtybByKS77lGeLM_W6kA5TzkoXOgRJ6pcJ",
		logoClassName: "size-8 dark:invert",
	},
	{
		name: "GitLab",
		description: "Import projects from your private or public GitLab repositories.",
		connected: true,
		logoType: "image",
		logoAlt: "GitLab logo",
		logoSrc:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBB11JjXnTlBGMjzUA9tHs5J4HySdTl1yL6jUg-DjmFKFAMzINZBnZTo4Mdhq7dNXZgQxDFIkpnY4W0Sq1zzp0N3ocNQL4Sq5HeobjW-hMie99Oyg3ya4bq-bxbHkNmFYhYhDb_ZB7EollqXtvIv-XQKfMLgk0rBLJoq6Rklg-74bsmnVulqGoH_DT20OAlnb0eKgiag4LqvdTbsHB9KkemPny2EfGooh42ANO8AhgPak1a4jIMvPR40WDpsxqU1ftpAsyev2_ktIdW",
		logoClassName: "size-8",
	},
	{
		name: "Dev.to",
		description: "Sync your latest technical articles and blog posts.",
		connected: false,
		logoType: "image",
		logoAlt: "Dev.to logo",
		logoSrc:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAskmGMgwqjTkKi9hPJI6jf9Xmh1TepT5O-NUP83Qehah7rbdch06BbVXm92DoUJ9qpzHnwkPBNSLoTWDr6MNTiaO8Mt0Mf-2enLz4jEoTGNaFuhWFtHM1pPloK1SCy9fo5sT4iLt3oRIljzyGCgnJBMvtcSQ89Ge0hO-56oGjXzsmIt-hNjHkMyDLtU3nJ9yvXZGJi3zvtLCM7TIEmBr-H1wY0-R6m7tnWZraa9j3SXMIMXKu_Ug1Ycft8rggv4BFsyRdKEWaxTns3",
		logoClassName: "size-8 dark:invert",
	},
	{
		name: "Hashnode",
		description: "Display your Hashnode blog posts directly on your portfolio.",
		connected: false,
		logoType: "text",
		logoText: "HN",
		logoTextClassName: "text-plum-700 text-xl font-black",
	},
	{
		name: "Stack Overflow",
		description: "Highlight your reputation and top answered questions.",
		connected: true,
		logoType: "image",
		logoAlt: "Stack Overflow logo",
		logoSrc:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAy7TG_-5frA1UpeQPqZctRQZ1A3A52VsyGSQ-XAuctaTFaTW44JBaGNQ-0n29Aagi3yJvDsW0g9zP3mMwrWBVitYqczOC51odO2ZmDnK0Uk2dhd7R_T5pC37-N4ezVjpueCRZc4UDTA8cQP66lRtRKn5f9xw13VjwOzXZ-lURsaJvV1bML2Ht9oxSa0x7UIttyRFHUJUgV8sEcptWwXrUsiV9aiM8rlIcwtXc53whKbOj0P3l1B6bPcEqghCQwaQKTc7gsDqC1M7ZU",
		logoClassName: "size-8",
	},
	{
		name: "Codeforces",
		description: "Show your competitive programming rating and history.",
		connected: false,
		logoType: "image",
		logoAlt: "Codeforces logo",
		logoSrc:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBLgTQsZ2AAWBkDtr1cJ5e83KXFDSrPY3aeUBRonEPKIZsf7Q3FVxh8AmRDOEeP2aODTIMvbvVPQGbKWC5E5jeVJgsfLaTrhz3Axf58RGoJnIThiqMLo_xg-yZRpMqm4bJZ9Q614a2lls0zF3uSJSpIclMrES4DFy8qMbwIf99w1sVcWzZMwaBhLrz483OWYYoeqn8SmX6EA4CDQ2k1TwLvzGxAQXGDGxt4jbyC_0LocxTZh-hDZrHO-tcm_c-okIBZWXLkFVaFrQIB",
		logoClassName: "size-8",
	},
	{
		name: "arXiv",
		description: "List your pre-print academic papers and research.",
		connected: false,
		logoType: "text",
		logoText: "arXiv",
		logoTextClassName: "text-plum-800 font-bold",
	},
	{
		name: "ORCID",
		description: "Verify your research identity and publications.",
		connected: false,
		logoType: "text",
		logoText: "iD",
		logoTextClassName: "text-amber-600 font-bold",
	},
	{
		name: "Unsplash",
		description: "Feature your photography portfolio.",
		connected: false,
		logoType: "icon",
		logoAlt: "Unsplash logo",
	},
	{
		name: "YouTube",
		description: "Embed your latest video uploads and playlists.",
		connected: false,
		logoType: "image",
		logoAlt: "YouTube logo",
		logoSrc:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCaXXvV6NKunVc2eSKJycwCley8xleGrM4ozsRC7DulRAGcjO1XOSodzTDkFF1nbNZwSdgQuNhXLlTuzqm9I3qhsDYs5XrGmrIy-JP1wez46v_idxk3rBxbWfvAuLriN9u9gy6N1nlel7AHEturBMEf0LAm8pSOzRCWiQybYWlvAuH4dWAYwh-_aWFeB2_GvDdVyEokifqgnTw2A9gXDhMKg4_RzSAO_1pOsSDo76qM39kL0QAcwU989YwB_bQcXa89PeWa8V1OfoC4",
		logoClassName: "size-8",
	},
];

function UiIcon({ name, className = "size-5" }) {
	if (name === "search") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<circle cx="11" cy="11" r="7" />
				<path d="M20 20l-3.5-3.5" />
			</svg>
		);
	}

	if (name === "grid") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<rect x="3" y="3" width="7" height="7" rx="1" />
				<rect x="14" y="3" width="7" height="7" rx="1" />
				<rect x="3" y="14" width="7" height="7" rx="1" />
				<rect x="14" y="14" width="7" height="7" rx="1" />
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

	if (name === "edit") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M12 20h9" />
				<path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
			</svg>
		);
	}

	if (name === "play") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<circle cx="12" cy="12" r="9" />
				<path d="M10 8l6 4-6 4z" fill="currentColor" stroke="none" />
			</svg>
		);
	}

	if (name === "unlink") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1" />
				<path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" />
				<path d="M3 3l18 18" />
			</svg>
		);
	}

	if (name === "arrow") {
		return (
			<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M5 12h14" />
				<path d="M13 5l7 7-7 7" />
			</svg>
		);
	}

	return null;
}

function BrandMark() {
	return (
		<svg fill="currentColor" viewBox="0 0 48 48" aria-hidden="true">
			<path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
			/>
		</svg>
	);
}

function UnsplashMark() {
	return (
		<svg className="size-8 text-plum-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z" />
		</svg>
	);
}

function StatusBadge({ connected }) {
	if (connected) {
		return (
			<span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-400">
				<span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
				Connected
			</span>
		);
	}

	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-[#2a1331] dark:text-slate-400 dark:ring-plum-800">
			Disconnected
		</span>
	);
}

function IntegrationLogo({ item }) {
	if (item.logoType === "image") {
		return <img src={item.logoSrc} alt={item.logoAlt} className={item.logoClassName || "size-8"} />;
	}

	if (item.logoType === "icon") {
		return <UnsplashMark />;
	}

	return <div className={item.logoTextClassName}>{item.logoText}</div>;
}

function IntegrationCard({ item }) {
	return (
		<article
			className={`group relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-plum-950 ${
				item.connected
					? "border-plum-100 hover:border-amber-400/50 dark:border-plum-800 dark:hover:border-amber-500/50"
					: "border-plum-100 hover:border-plum-400/30 dark:border-plum-800"
			}`}
		>
			<div className="mb-4 flex items-start justify-between gap-3">
				<div className="flex size-12 items-center justify-center rounded-xl bg-plum-50 p-2 dark:bg-[#1f0b24]">
					<IntegrationLogo item={item} />
				</div>
				<StatusBadge connected={item.connected} />
			</div>

			<h3 className="mb-1 text-lg font-bold text-plum-950 dark:text-white">{item.name}</h3>
			<p className="mb-6 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>

			<div className="mt-auto flex gap-2">
				{item.connected ? (
					<>
						<button
							type="button"
							className="flex flex-1 items-center justify-center rounded-lg border border-plum-200 bg-transparent py-2 text-sm font-semibold text-plum-800 transition-colors hover:bg-plum-50 dark:border-plum-800 dark:text-plum-200 dark:hover:bg-plum-900/30"
						>
							Manage
						</button>
						<button
							type="button"
							title="Disconnect"
							className="flex size-9 items-center justify-center rounded-lg border border-plum-200 bg-transparent text-slate-400 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:border-plum-800 dark:hover:border-amber-800 dark:hover:bg-amber-900/10"
						>
							<UiIcon name="unlink" className="size-5" />
						</button>
					</>
				) : (
					<button
						type="button"
						className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-plum-700 py-2 text-sm font-bold text-white transition-colors hover:bg-plum-800"
					>
						Connect
						<UiIcon name="arrow" className="size-4" />
					</button>
				)}
			</div>
		</article>
	);
}

function ApiIntegration() {
	return (
		<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 antialiased dark:bg-background-dark dark:text-white">
			<header className="sticky top-0 z-50 flex items-center justify-between border-b border-plum-100 bg-white px-4 py-3 shadow-sm dark:border-plum-800 dark:bg-plum-950 sm:px-6 lg:px-10">
				<div className="flex items-center gap-4 text-slate-900 dark:text-white">
					<div className="size-8 text-plum-700 dark:text-amber-400">
						<BrandMark />
					</div>
					<h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-plum-900 dark:text-plum-100">GrowFolio</h2>
				</div>

				<div className="flex flex-1 items-center justify-end gap-4 sm:gap-8">
					<nav className="hidden items-center gap-9 md:flex">
						{navLinks.map((link) => (
							<a
								key={link}
								href="#"
								className="text-sm font-medium text-slate-600 transition-colors hover:text-plum-700 dark:text-slate-300 dark:hover:text-amber-400"
							>
								{link}
							</a>
						))}
					</nav>

					<button
						type="button"
						className="hidden h-10 min-w-[84px] items-center justify-center rounded-xl bg-plum-700 px-4 text-sm font-bold tracking-[0.015em] text-white transition-colors hover:bg-plum-800 sm:flex"
					>
						View Profile
					</button>

					<img
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyHBx0fzrRpIdBiV2bQNvejP3RtovYJFQdnlcUeLstb0hAzwMkjOXhaUWpi0pSyzUMRlDn1afUfQv5WfCNoNtjxpDsJoSmhxmQHP4xnMgIM8ZrIA4-ZAy0vFVqUa2Almz8JjyiyZBh1fbuRey-914iRatREKBuK9PtI4fl7mIJv_nEZHBi0_o9I15vBN22xqUMzM5NDe3GxkvvTavAhJ8fwOsmPWlmIPWtt_Y4TodtJoUs3_CVlj2b_8-1e4iQlXjwnf5eBSDcYG2B"
						alt="User avatar"
						className="size-10 rounded-full object-cover ring-2 ring-plum-100 dark:ring-plum-800"
					/>
				</div>
			</header>

			<main className="flex flex-1 flex-col bg-gradient-to-b from-background-light to-plum-50 px-4 py-8 dark:from-background-dark dark:to-plum-950/40 sm:px-10 lg:px-40">
				<div className="mx-auto flex w-full max-w-7xl flex-col">
					<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div className="flex flex-col gap-2">
							<h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-plum-950 dark:text-white md:text-4xl">
								API Integrations
							</h1>
							<p className="max-w-2xl text-base font-normal text-slate-600 dark:text-slate-300">
								Connect your accounts to automatically showcase your work on your portfolio. We sync daily.
							</p>
						</div>
					</div>

					<section className="mb-8 flex flex-col gap-4 rounded-2xl border border-plum-100 bg-white p-4 shadow-sm dark:border-plum-800 dark:bg-plum-950 lg:flex-row lg:items-center lg:justify-between">
						<label className="flex h-12 w-full items-center rounded-xl bg-slate-50 px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-plum-500 dark:bg-[#1f0b24] dark:ring-plum-900 lg:max-w-md">
							<UiIcon name="search" className="size-5 text-plum-400 dark:text-plum-600" />
							<input
								type="text"
								placeholder="Search integrations (e.g. GitHub, YouTube)"
								className="w-full border-none bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white"
							/>
						</label>

						<div className="flex flex-wrap gap-2">
							{categoryFilters.map((filter) => (
								<button
									key={filter.label}
									type="button"
									className={
										filter.active
											? "group flex h-9 items-center gap-2 rounded-lg bg-plum-100 px-4 text-plum-900 ring-1 ring-plum-200 transition-colors dark:bg-plum-900/50 dark:text-plum-100 dark:ring-plum-800"
											: "group flex h-9 items-center gap-2 rounded-lg bg-transparent px-4 text-slate-600 transition-colors hover:bg-plum-50 hover:text-plum-800 dark:text-slate-400 dark:hover:bg-plum-900/30 dark:hover:text-plum-200"
									}
								>
									<UiIcon name={filter.icon} className="size-[18px]" />
									<span className="text-sm font-medium">{filter.label}</span>
								</button>
							))}
						</div>
					</section>

					<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{integrations.map((item) => (
							<IntegrationCard key={item.name} item={item} />
						))}
					</section>
				</div>
			</main>
		</div>
	);
}

export default ApiIntegration;
