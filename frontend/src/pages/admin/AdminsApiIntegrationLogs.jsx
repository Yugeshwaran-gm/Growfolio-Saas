import { useMemo, useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'

function HealthCard({ service, status, latency, uptime, degraded = false }) {
	const sparkBars = degraded
		? ['h-[30%]', 'h-[20%]', 'h-[45%]', 'h-[25%]', 'h-[18%]', 'h-[40%]']
		: ['h-[35%]', 'h-[55%]', 'h-[30%]', 'h-[75%]', 'h-[45%]', 'h-[62%]']

	return (
		<div
			className={`bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm ${
				degraded ? 'border-l-4 border-l-primary/30' : ''
			}`}
		>
			<div className="flex justify-between items-start mb-4">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-lg">🔌</div>
					<span className="font-bold text-primary dark:text-slate-100">{service}</span>
				</div>
				<span
					className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
						degraded
							? 'bg-slate-200 dark:bg-slate-700 text-slate-500'
							: 'bg-accent/20 text-accent'
					}`}
				>
					<span className={`size-1.5 rounded-full ${degraded ? 'bg-slate-400' : 'bg-accent'}`}></span>
					{status}
				</span>
			</div>

			<div className="h-[30px] w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent rounded-md px-1 flex items-end gap-1">
				{sparkBars.map((heightClass, index) => (
					<span
						key={`${service}-${index}`}
						className={`w-full rounded-t-sm ${degraded ? 'bg-primary/20' : 'bg-accent/60'} ${heightClass}`}
					></span>
				))}
			</div>

			<div className="flex justify-between items-end mt-4">
				<div>
					<p className="text-xs text-slate-400">Latency</p>
					<p className="text-lg font-black text-primary dark:text-slate-100">{latency}</p>
				</div>
				<div className="text-right">
					<p className="text-xs text-slate-400">Uptime</p>
					<p className={`text-lg font-black ${degraded ? 'text-slate-400' : 'text-accent'}`}>{uptime}</p>
				</div>
			</div>
		</div>
	)
}

function RateLimitRow({ label, used, total, colorClass }) {
	const percent = Math.min(100, Math.round((used / total) * 100))
	const widthClass =
		percent >= 95
			? 'w-[95%]'
			: percent >= 84
				? 'w-[84%]'
				: percent >= 8
					? 'w-[8%]'
					: 'w-[1%]'

	return (
		<div className="space-y-2">
			<div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
				<span>{label}</span>
				<span>
					{used.toLocaleString()} / {total.toLocaleString()} req/hr
				</span>
			</div>
			<div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
				<div className={`h-full rounded-full transition-all ${colorClass} ${widthClass}`}></div>
			</div>
		</div>
	)
}

function SyncRow({ item }) {
	return (
		<tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
			<td className="px-6 py-4 text-slate-500 font-mono">{item.timestamp}</td>
			<td className="px-6 py-4 font-bold text-primary dark:text-slate-200">{item.source}</td>
			<td className="px-6 py-4 text-slate-400">{item.userId}</td>
			<td className="px-6 py-4 text-right">
				<span className={`text-base align-middle ${item.ok ? 'text-green-500' : 'text-red-400'}`}>
					{item.ok ? '✔' : '⚠'}
				</span>
			</td>
		</tr>
	)
}

function ErrorLogCard({ log }) {
	const badgeClass =
		log.level === 'error'
			? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
			: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'

	return (
		<div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40">
			<div className="flex justify-between items-start mb-2">
				<span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>{log.code}</span>
				<span className="text-[10px] text-slate-400">{log.age}</span>
			</div>
			<p className="text-xs font-mono text-slate-600 dark:text-slate-400 mb-3 break-all">{log.endpoint}</p>
			<button className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-plum-light transition-all">
				<span className="text-xs">⌨</span>
				View Trace
			</button>
		</div>
	)
}

export default function AdminsApiIntegrationLogs() {
	const [query, setQuery] = useState('')

	const healthData = [
		{ service: 'GitHub', status: 'Healthy', latency: '124ms', uptime: '99.98%', degraded: false },
		{ service: 'GitLab', status: 'Healthy', latency: '198ms', uptime: '99.85%', degraded: false },
		{ service: 'Dev.to', status: 'Degraded', latency: '842ms', uptime: '92.10%', degraded: true },
		{ service: 'Hashnode', status: 'Healthy', latency: '156ms', uptime: '99.99%', degraded: false },
	]

	const syncHistory = [
		{ timestamp: '14:22:05', source: 'GitHub', userId: 'usr_9921', ok: true },
		{ timestamp: '14:19:12', source: 'Hashnode', userId: 'usr_4431', ok: true },
		{ timestamp: '14:15:33', source: 'Dev.to', userId: 'usr_1020', ok: false },
		{ timestamp: '14:10:01', source: 'GitLab', userId: 'usr_0092', ok: true },
	]

	const errorLogs = [
		{
			code: '503 SERVICE UNAVAILABLE',
			age: '2 mins ago',
			endpoint: 'GET https://api.dev.to/v1/articles?username=growfolio_sync',
			level: 'error',
		},
		{
			code: '429 TOO MANY REQUESTS',
			age: '14 mins ago',
			endpoint: 'POST https://api.github.com/graphql/query',
			level: 'warn',
		},
		{
			code: '502 BAD GATEWAY',
			age: '22 mins ago',
			endpoint: 'GET https://gitlab.com/api/v4/users/1221/projects',
			level: 'error',
		},
	]

	const filteredLogs = useMemo(() => {
		const text = query.trim().toLowerCase()
		if (!text) {
			return errorLogs
		}
		return errorLogs.filter(
			(log) => log.code.toLowerCase().includes(text) || log.endpoint.toLowerCase().includes(text)
		)
	}, [query])

	return (
		<AdminLayout>
			<div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display rounded-xl p-2 md:p-4">
				<header className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
					<div>
						<h2 className="text-3xl font-black text-primary dark:text-slate-100 tracking-tight">API Health & Performance</h2>
						<p className="text-slate-500 mt-1">Real-time status tracking for third-party portfolio connectors.</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center bg-white dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700">
							<span className="text-slate-400 mr-2">🔍</span>
							<input
								type="text"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search logs..."
								className="bg-transparent border-none focus:ring-0 text-sm w-36 sm:w-48"
							/>
						</div>
						<div className="relative">
							<span className="inline-flex p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-primary">🔔</span>
							<span className="absolute top-2 right-2 size-2 bg-accent rounded-full"></span>
						</div>
					</div>
				</header>

				<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{healthData.map((item) => (
						<HealthCard key={item.service} {...item} />
					))}
				</section>

				<section className="mb-8">
					<div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-bold text-primary dark:text-slate-100">Active Rate Limits</h3>
							<button className="text-sm font-bold text-primary hover:underline">View All Quotas</button>
						</div>
						<div className="space-y-6">
							<RateLimitRow label="GitHub GraphQL API" used={4210} total={5000} colorClass="bg-primary" />
							<RateLimitRow label="GitLab REST v4" used={150} total={2000} colorClass="bg-accent" />
							<RateLimitRow label="Dev.to API" used={950} total={1000} colorClass="bg-primary" />
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
					<div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
						<div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
							<h3 className="text-lg font-bold text-primary dark:text-slate-100">Recent Sync History</h3>
							<span className="text-slate-400 cursor-pointer">⚙</span>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left">
								<thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 font-bold uppercase tracking-widest">
									<tr>
										<th className="px-6 py-3">Timestamp</th>
										<th className="px-6 py-3">Source</th>
										<th className="px-6 py-3">User ID</th>
										<th className="px-6 py-3 text-right">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
									{syncHistory.map((item) => (
										<SyncRow key={`${item.timestamp}-${item.userId}`} item={item} />
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
						<div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
							<h3 className="text-lg font-bold text-primary dark:text-slate-100">Technical Error Logs</h3>
							<button className="text-xs font-bold text-red-500 border border-red-500/20 px-2 py-1 rounded">Clear All</button>
						</div>
						<div className="flex-1 overflow-y-auto max-h-[400px]">
							<div className="divide-y divide-slate-100 dark:divide-slate-700">
								{filteredLogs.map((log) => (
									<ErrorLogCard key={`${log.code}-${log.age}`} log={log} />
								))}
								{filteredLogs.length === 0 && (
									<div className="p-6 text-sm text-slate-500">No matching logs found.</div>
								)}
							</div>
						</div>
					</div>
				</section>
			</div>
		</AdminLayout>
	)
}
