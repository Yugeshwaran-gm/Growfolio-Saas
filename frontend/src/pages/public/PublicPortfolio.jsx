import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../../components/ui/Loading'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { publicPortfolioService } from '../../services/publicPortfolioService'

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Articles', href: '#articles' },
  { label: 'Contact', href: '#contact' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const articles = [
  {
    title: 'Optimizing API Latency at Scale',
    summary: 'Strategies for caching and database indexing that reduced our p99 latency by 40%.',
    date: 'Oct 12, 2023',
    readTime: '5 min read',
    source: 'Dev.to',
  },
  {
    title: 'React Server Components: A Deep Dive',
    summary: 'Understanding the shift in mental model and how to migrate large scale applications.',
    date: 'Sep 28, 2023',
    readTime: '8 min read',
    source: 'Medium',
  },
]

const papers = [
  {
    title: 'Machine Learning in High-Frequency FinTech Trading',
    venue: 'Published in IEEE Transactions on Neural Networks',
    year: '2022',
  },
  {
    title: 'Distributed Ledger Scalability Analysis',
    venue: 'Presented at Crypto 2021 Conference',
    year: '2021',
  },
]

const contributionPalette = ['bg-gray-100', 'bg-plum-200', 'bg-plum-400', 'bg-plum-600', 'bg-amber-400']

const contributionCells = Array.from({ length: 364 }, (_, index) => {
  const level = index % 17 === 0 ? 4 : index % 7 === 0 ? 3 : index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0
  return level
})

function Icon({ name, className = 'size-5' }) {
  if (name === 'workspaces') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="4" width="8" height="7" rx="1.5" />
        <rect x="13" y="4" width="8" height="7" rx="1.5" />
        <rect x="8" y="13" width="8" height="7" rx="1.5" />
      </svg>
    )
  }

  if (name === 'menu') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    )
  }

  if (name === 'download') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 4v10" />
        <path d="M8 10l4 4 4-4" />
        <path d="M4 20h16" />
      </svg>
    )
  }

  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    )
  }

  if (name === 'code') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M8 8l-4 4 4 4" />
        <path d="M16 8l4 4-4 4" />
        <path d="M14 4l-4 16" />
      </svg>
    )
  }

  if (name === 'openInNew') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 5h5v5" />
        <path d="M10 14L19 5" />
        <path d="M19 13v6H5V5h6" />
      </svg>
    )
  }

  if (name === 'arrowForward') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    )
  }

  if (name === 'article') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 4h12v16H6z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    )
  }

  if (name === 'school') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 8l10-5 10 5-10 5-10-5z" />
        <path d="M6 10.5V15c0 1.8 2.7 3.5 6 3.5s6-1.7 6-3.5v-4.5" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M3 10h18" />
      </svg>
    )
  }

  if (name === 'schedule') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </svg>
    )
  }

  if (name === 'pdf') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
        <path d="M8 14h8" />
      </svg>
    )
  }

  return null
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
  )
}

function HeroSection({ profile, username }) {
  const displayName = profile?.full_name || username || 'Portfolio Owner'
  const bio = profile?.bio || 'No bio available yet.'

  const socialLinks = [
    { label: 'GitHub', href: profile?.github, icon: 'code' },
    { label: 'LinkedIn', href: profile?.linkedin, icon: 'openInNew' },
  ].filter((item) => Boolean(item.href))

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-gradient-to-br from-plum-900 to-plum-700 px-6 py-12 text-center lg:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-[-10%] top-[-20%] h-1/2 w-1/2 rounded-full bg-amber-400 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-3/5 w-2/5 rounded-full bg-plum-400 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="group relative mb-6">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-plum-300 opacity-40 blur transition duration-500 group-hover:opacity-60" />
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt={`${displayName} profile image`}
              className="relative size-36 rounded-full border-4 border-white/10 object-cover shadow-xl"
            />
          ) : (
            <div className="relative flex size-36 items-center justify-center rounded-full border-4 border-white/10 bg-white/10 text-5xl font-bold text-white shadow-xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">{displayName}</h1>
        <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-amber-400">Public Portfolio</p>
        <p className="mb-4 max-w-2xl text-lg font-light leading-relaxed text-plum-100">{bio}</p>
        <p className="mb-10 text-sm font-medium text-plum-100">Portfolio views: {Number(profile?.portfolio_views || 0).toLocaleString()}</p>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 text-base font-bold text-plum-900 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]"
            >
              <Icon name="code" className="size-5" />
              <span>View GitHub</span>
            </a>
          )}

          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Icon name="openInNew" className="size-5" />
              <span>View LinkedIn</span>
            </a>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-1 text-plum-100 transition-colors hover:text-amber-400"
                aria-label={item.label}
              >
                <div className="rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all group-hover:border-amber-400/50 group-hover:bg-amber-400/10">
                  <Icon name={item.icon} className="size-6" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ContributionSection() {
  return (
    <section className="flex w-full justify-center border-b border-plum-100 bg-background-subtle py-12">
      <div className="w-full max-w-[960px] px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-plum-900">Contribution Activity</h2>
            <p className="mt-1 text-text-secondary">Activity visualization placeholder</p>
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
                    className={`h-full w-full rounded-[2px] ${contributionPalette[level]}`}
                    title="Contributions on this day"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  const techStack = Array.isArray(project?.tech_stack) ? project.tech_stack : []

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-plum-100 bg-white shadow-sm transition-all duration-300 hover:border-plum-300 hover:shadow-xl hover:shadow-plum-900/5">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-plum-100 to-plum-50">
        <Icon name="code" className="size-12 text-plum-400" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-xl font-bold text-plum-900 transition-colors group-hover:text-plum-700">{project?.title || 'Untitled Project'}</h3>
          {project?.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noreferrer"
              className="text-text-secondary transition-colors hover:text-amber-500"
              title="Open Project"
              aria-label="Open Project"
            >
              <Icon name="openInNew" className="size-5" />
            </a>
          )}
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-text-secondary">{project?.description || 'No description available.'}</p>

        {techStack.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {techStack.map((tag) => (
              <span key={tag} className="rounded-md border border-plum-100 bg-plum-50 px-2.5 py-1 text-xs font-medium text-plum-700">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function ProjectsSection({ projects }) {
  return (
    <section id="projects" className="w-full max-w-[960px] px-6 py-16">
      <div className="mb-10 flex items-center justify-between gap-4">
        <h2 className="border-l-4 border-amber-400 pl-4 text-3xl font-bold text-plum-900">Featured Projects</h2>
        <span className="flex items-center gap-1 font-medium text-plum-700">
          Total {projects.length} <Icon name="arrowForward" className="size-4" />
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-plum-100 bg-white p-8">
          <EmptyState message="No projects available for this portfolio." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={`${project?.title || 'project'}-${index}`} project={project} />
          ))}
        </div>
      )}
    </section>
  )
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
              <article key={article.title} className="rounded-xl border border-transparent p-4 transition-colors hover:border-plum-100 hover:bg-plum-50">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-plum-900">{article.title}</h3>
                  <Icon name="openInNew" className="size-5 text-plum-200" />
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
              </article>
            ))}
          </div>
        </div>

        <div className="flex-1" id="contact">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Icon name="school" className="size-5" />
            </div>
            <h2 className="text-2xl font-bold text-plum-900">Research & Papers</h2>
          </div>

          <div className="flex flex-col gap-4">
            {papers.map((paper) => (
              <article key={paper.title} className="rounded-xl border border-plum-100 bg-background-subtle p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <Icon name="pdf" className="mt-1 size-5 text-plum-400" />
                  <div>
                    <h3 className="text-base font-bold leading-snug text-plum-900">{paper.title}</h3>
                    <p className="mb-2 mt-1 text-sm text-text-secondary">{paper.venue}</p>
                    <span className="text-xs text-text-secondary">{paper.year}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
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
      </div>
    </footer>
  )
}

function PublicPortfolio() {
  const { username } = useParams()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPortfolio = async () => {
    if (!username) {
      setError('Invalid portfolio URL.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await publicPortfolioService.getByUsername(username)
      setPortfolio(data || null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load portfolio.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPortfolio()
  }, [username])

  const projects = useMemo(() => (Array.isArray(portfolio?.projects) ? portfolio.projects : []), [portfolio])

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-text-main antialiased dark:bg-background-dark">
      <Header />

      <main className="flex w-full flex-grow flex-col items-center">
        {loading ? (
          <div className="w-full max-w-[960px] px-6 py-16">
            <div className="rounded-2xl border border-plum-100 bg-white p-10">
              <Loading message="Loading portfolio..." />
            </div>
          </div>
        ) : error ? (
          <div className="w-full max-w-[960px] px-6 py-16">
            <div className="rounded-2xl border border-plum-100 bg-white p-6">
              <ErrorState message={error} onRetry={loadPortfolio} />
            </div>
          </div>
        ) : (
          <>
            <HeroSection profile={portfolio} username={username} />
            <ContributionSection />
            <ProjectsSection projects={projects} />
            <ArticlesAndPapersSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default PublicPortfolio
