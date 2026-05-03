import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../../components/ui/Loading'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { publicPortfolioService } from '../../services/publicPortfolioService'
import { getSkillLogoUrl } from '../../utils/skillLogos'
import SkillLogo from '../../components/ui/SkillLogo'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Articles', href: '#articles' },
  { label: 'Contact', href: '#contact' },
  {label : 'Education', href: '#education' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Articles and papers are sourced from the backend via the portfolio API.

const contributionPalette = ['bg-gray-100', 'bg-plum-200', 'bg-plum-400', 'bg-plum-600', 'bg-amber-400']

// Free fallback images for projects when user hasn't provided one.
const freeProjectImages = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=4',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=5',
]

function getProjectImage(project, index = 0) {
  // prefer explicit image url field if provided
  if (project?.image_url) return project.image_url
  // prefer uploaded image field (serializer exposes `image`)
  if (project?.image) return project.image
  // fallback to a free image chosen deterministically by index or title
  if (typeof index === 'number') return freeProjectImages[index % freeProjectImages.length]
  if (project?.title) {
    const char = project.title.charCodeAt(0) || 0
    return freeProjectImages[char % freeProjectImages.length]
  }
  return freeProjectImages[0]
}

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

// function HeroSection({ profile, username }) {
//   const [imgError, setImgError] = useState(false)
//   const [imgLoaded, setImgLoaded] = useState(false)
//   const displayName = profile?.full_name || username || 'Portfolio Owner'
//   const bio = profile?.bio || 'No bio available yet.'

//   const socialLinks = [
//     { label: 'GitHub', href: profile?.github, icon: 'code' },
//     { label: 'LinkedIn', href: profile?.linkedin, icon: 'openInNew' },
//   ].filter((item) => Boolean(item.href))

//   const downloadResume = async () => {
//     const url = profile?.resume
//     if (!url) return
//     try {
//       const res = await fetch(url, { credentials: 'include' })
//       const blob = await res.blob()
//       const a = document.createElement('a')
//       const objectUrl = URL.createObjectURL(blob)
//       a.href = objectUrl
//       a.download = `${displayName.replace(/\s+/g, '_')}_CV.pdf`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       URL.revokeObjectURL(objectUrl)
//     } catch (err) {
//       // fallback: open in new tab
//       window.open(url, '_blank')
//     }
//   }

//   return (
//     <section className="relative flex w-full flex-col items-center overflow-hidden px-6 py-12 text-center lg:py-24" style={{background: 'linear-gradient(135deg, #4a044e 0%, #701a75 100%)'}}>
//       <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
//         <div className="absolute left-[-10%] top-[-20%] h-1/2 w-1/2 rounded-full bg-amber-400 blur-[120px]" />
//         <div className="absolute bottom-[-20%] right-[-10%] h-3/5 w-2/5 rounded-full bg-plum-400 blur-[100px]" />
//       </div>

//       <div className="relative z-10 flex flex-col items-center">
//         <div className="group relative mb-6">
//           <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-plum-300 opacity-40 blur transition duration-500 group-hover:opacity-60" />
//           {profile?.profile_image && !imgError ? (
//             <>
//               {!imgLoaded && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="rounded-full w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/10 animate-pulse" />
//                 </div>
//               )}
//               <img
//                 src={profile.profile_image}
//                 alt={`${displayName} profile image`}
//                 onError={() => setImgError(true)}
//                 onLoad={() => setImgLoaded(true)}
//                 crossOrigin="anonymous"
//                 referrerPolicy="no-referrer"
//                 className={`relative w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-4 border-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
//               />
//             </>
//           ) : (
//             <div className="relative flex w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 items-center justify-center rounded-full border-4 border-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] bg-gradient-to-br from-plum-400 to-amber-400 text-5xl font-bold text-white">
//               {displayName.charAt(0).toUpperCase()}
//             </div>
//           )}
//         </div>

//         <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white sm:text-7xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">{displayName}</h1>
//         <p className="mb-6 text-lg font-semibold uppercase tracking-wider text-amber-400">{bio}</p>
//         {/* <p className="mb-4 max-w-2xl text-lg font-light leading-relaxed text-white">{bio}</p> */}
//         <p className="mb-10 text-sm font-medium text-white">Portfolio views: {Number(profile?.portfolio_views || 0).toLocaleString()}</p>

//         <div className="mb-12 flex flex-wrap justify-center gap-4">
//           {profile?.resume && (
//             <button
//               type="button"
//               onClick={downloadResume}
//               className="flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 text-base font-bold text-plum-900 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] active:translate-y-0"
//             >
//               <Icon name="download" className="size-5" />
//               <span>Download CV</span>
//             </button>
//           )}
//           {profile?.github && (
//             <a
//               href={profile.github}
//               target="_blank"
//               rel="noreferrer"
//               className="flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 text-base font-bold text-plum-900 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]"
//             >
//               <Icon name="code" className="size-5" />
//               <span>View GitHub</span>
//             </a>
//           )}

//           {profile?.linkedin && (
//             <a
//               href={profile.linkedin}
//               target="_blank"
//               rel="noreferrer"
//               className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20 hover:border-amber-300"
//             >
//               <Icon name="openInNew" className="size-5" />
//               <span>View LinkedIn</span>
//             </a>
//           )}
//         </div>

//         {socialLinks.length > 0 && (
//           <div className="flex items-center justify-center gap-4">
//             {socialLinks.map((item) => (
//               <a
//                 key={item.label}
//                 href={item.href}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="group flex flex-col items-center gap-1 text-plum-100 transition-colors hover:text-amber-400"
//                 aria-label={item.label}
//               >
//                 <div className="rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all group-hover:border-amber-400/50 group-hover:bg-amber-400/10">
//                   <Icon name={item.icon} className="size-6" />
//                 </div>
//               </a>
//             ))}
//           </div>
//         )}


//       </div>
//     </section>
//   )
// }

function HeroSection({ profile, username }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const displayName = profile?.full_name || username || 'Portfolio Owner'

  const socialLinks = [
    { label: 'GitHub', href: profile?.github, icon: 'code' },
    { label: 'LinkedIn', href: profile?.linkedin, icon: 'openInNew' },
  ].filter((item) => Boolean(item.href))

  const downloadResume = async () => {
    const url = profile?.resume
    if (!url) return
    try {
      const res = await fetch(url, { credentials: 'include' })
      const blob = await res.blob()
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = `${displayName.replace(/\s+/g, '_')}_CV.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      window.open(url, '_blank')
    }
  }

  return (
    <section
      className="relative flex w-full flex-col items-center overflow-hidden px-6 py-16 text-center lg:py-28"
      style={{ background: 'linear-gradient(135deg, #3d0738 0%, #5c0a5c 50%, #701a75 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <div className="absolute left-[-10%] top-[-20%] h-1/2 w-1/2 rounded-full bg-amber-400 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-3/5 w-2/5 rounded-full bg-plum-400 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-3xl">
        {/* Avatar with golden border and floating contact icon */}
        <div className="relative mb-8">
          <div className="relative rounded-full p-2 bg-gradient-to-br from-yellow-400 to-amber-400">
            {profile?.profile_image && !imgError ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-2 rounded-full bg-white/10 animate-pulse" />
                )}
                <img
                  src={profile.profile_image}
                  alt={`${displayName} profile`}
                  onError={() => setImgError(true)}
                  onLoad={() => setImgLoaded(true)}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className={`w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-white object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            ) : (
              <div className="w-44 h-44 md:w-56 md:h-56 flex items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-plum-400 to-amber-400 text-5xl md:text-6xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Floating contact button */}
          <button
            aria-label="Contact"
            onClick={() => { if (profile?.email) window.location.href = `mailto:${profile.email}` }}
            className="absolute bottom-2 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 shadow-lg hover:scale-110 transition-transform text-plum-900"
          >
            <Icon name="mail" className="size-5" />
          </button>
        </div>

        {/* Name */}
        <h1 className="mb-3 text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
          {displayName}
        </h1>

        {/* Title/Role */}
        <p className="mb-4 text-xs md:text-sm font-bold uppercase tracking-widest text-amber-300 drop-shadow-sm">
          Senior Full-Stack Engineer
        </p>

        {/* Professional Summary / Bio */}
        <p className="mb-6 text-base md:text-lg font-light leading-relaxed text-white/95 px-2">
          {profile?.professional_summary || profile?.bio || 'Aspiring Full Stack Developer with a strong foundation in the MERN stack and hands-on experience building real-world projects. Passionate about clean code, learning new technologies, and developing scalable web applications.'}
        </p>

        {/* Portfolio Views */}
        <p className="mb-8 text-xs md:text-sm font-semibold text-white/70 drop-shadow-sm">
          Portfolio views: {Number(profile?.portfolio_views || 0).toLocaleString()}
        </p>

        {/* Buttons */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => { if (profile?.email) window.location.href = `mailto:${profile.email}` }}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 text-sm font-semibold text-plum-900 hover:bg-amber-300 transition-colors shadow-md"
          >
            <Icon name="mail" className="size-4" />
            <span>Contact Me</span>
          </button>

          {profile?.resume && (
            <button
              type="button"
              onClick={downloadResume}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/40 bg-transparent px-6 text-sm font-semibold text-white hover:border-white/60 hover:bg-white/5 transition-all"
            >
              <Icon name="download" className="size-4" />
              <span>Download CV</span>
            </button>
          )}

          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/40 bg-transparent px-6 text-sm font-semibold text-white hover:border-white/60 hover:bg-white/5 transition-all"
            >
              <Icon name="openInNew" className="size-4" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>

        {/* Social icons at bottom */}
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-5">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20 transition-all"
                aria-label={item.label}
              >
                <Icon name={item.icon} className="size-5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function SkillGrid({ skills = [] }) {
  const sorted = (skills || []).slice().sort((a, b) => {
    const oa = a?.sort_order || a?.order || 0
    const ob = b?.sort_order || b?.order || 0
    if (ob !== oa) return ob - oa
    const na = a?.skill?.name || a?.name || ''
    const nb = b?.skill?.name || b?.name || ''
    return na.localeCompare(nb)
  })

  const skillIconMap = {
    // Frontend
    'React': 'bolt',
    'JavaScript': 'code',
    'TypeScript': 'badge',
    'HTML': 'language',
    'CSS': 'palette',
    'Tailwind': 'brush',
    'Vue': 'widgets',
    'Angular': 'settings_suggest',
    'Next.js': 'rocket_launch',
    'Svelte': 'flutter_dash',
    // Backend
    'Node.js': 'settings',
    'Python': 'terminal',
    'Java': 'hardware',
    'Rust': 'build',
    'Go': 'memory',
    'Django': 'web',
    'Flask': 'flask',
    'Express': 'api',
    'GraphQL': 'share',
    'REST': 'cloud_upload',
    // Databases
    'PostgreSQL': 'database',
    'MongoDB': 'storage',
    'MySQL': 'data_usage',
    'Redis': 'inbox',
    'Firebase': 'local_fire_department',
    'Supabase': 'cloud_queue',
    // DevOps & Tools
    'Docker': 'layers',
    'Kubernetes': 'cloud_done',
    'AWS': 'cloud',
    'Azure': 'cloud_circle',
    'GCP': 'cloud',
    'Git': 'code',
    'GitHub': 'github',
    'GitLab': 'gitlab',
    'VS Code': 'drive_file_rename_outline',
    'Postman': 'mail',
    'Jenkins': 'integration_instructions',
    // Visualization & Data
    'D3.js': 'show_chart',
    'Chart.js': 'bar_chart',
    'Tableau': 'analytics',
    'PowerBI': 'dashboard',
    // Mobile
    'React Native': 'phone_android',
    'Swift': 'phone_iphone',
    'Kotlin': 'android',
    // Other
    'Figma': 'design_services',
    'Photoshop': 'image',
    'Adobe XD': 'construction',
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {sorted.map((us) => {
        const name = us?.skill?.name || us?.name || ''
        const iconName = skillIconMap[name] || 'code'
        return (
          <div
            key={us?.id || name}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-plum-100 bg-white hover:bg-plum-50 hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-plum-100 to-amber-50 group-hover:from-amber-100 group-hover:to-plum-100 transition-all">
              {(() => {
                const logoUrl = (us?.skill?.logo_url && us.skill.logo_url.trim()) || getSkillLogoUrl(name)
                if (logoUrl) {
                  return <img src={logoUrl} alt={name} className="w-8 h-8 object-contain" />
                }

                // fallback to material symbol if available
                if (iconName) {
                  return <span className="material-symbols-outlined text-plum-700 text-2xl group-hover:text-amber-600 transition-colors">{iconName}</span>
                }

                // final fallback: first-letter badge
                return <div className="w-8 h-8 rounded-full bg-plum-200 flex items-center justify-center text-plum-700 font-bold">{name.charAt(0).toUpperCase()}</div>
              })()}
            </div>
            <span className="text-xs font-semibold text-plum-900 text-center line-clamp-2 group-hover:text-amber-600 transition-colors">{name}</span>
          </div>
        )
      })}
    </div>
  )
}

function ContributionSection({ username }) {
  const [days, setDays] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await publicPortfolioService.getContributions(username)
        if (!mounted) return
        setStartDate(data.start_date)
        setDays(Array.isArray(data.days) ? data.days : [])
      } catch (err) {
        // fallback to static placeholder if API not available
        setDays(contributionCells)
      } finally {
        setLoading(false)
      }
    }
    if (username) load()
    return () => {
      mounted = false
    }
  }, [username])

  const palette = contributionPalette
  const rendered = (Array.isArray(days) && days.length > 0) ? days : contributionCells
  const monthPositions = useMemo(() => {
    if (!startDate) return []
    const res = []
    let last = null
    for (let i = 0; i < rendered.length; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const m = d.toLocaleString(undefined, { month: 'short' })
      if (m !== last) {
        res.push({ month: m, index: i })
        last = m
      }
    }
    return res
  }, [rendered, startDate])
  const stats = useMemo(() => {
    if (!startDate || !Array.isArray(rendered)) return { total: 0, longest: 0, current: 0, mostActive: null, monthly: {} }

    const total = rendered.reduce((s, v) => s + Number(v || 0), 0)

    let longest = 0
    let current = 0
    let running = 0
    let mostActive = { count: 0, index: -1 }
    const monthly = {}

    for (let i = 0; i < rendered.length; i++) {
      const v = Number(rendered[i] || 0)
      if (v > 0) {
        running += 1
        if (running > longest) longest = running
      } else {
        running = 0
      }

      if (v > mostActive.count) {
        mostActive = { count: v, index: i }
      }

      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const m = d.toLocaleString(undefined, { month: 'short' })
      monthly[m] = (monthly[m] || 0) + v
    }

    // current streak: count back from last day
    let cs = 0
    for (let i = rendered.length - 1; i >= 0; i--) {
      if ((rendered[i] || 0) > 0) cs++
      else break
    }

    return { total, longest, current: cs, mostActive, monthly }
  }, [rendered, startDate])

  function cellDate(i) {
    if (!startDate) return ''
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  }

  return (
    <section className="relative flex w-full justify-center border-b border-plum-100 bg-gray-50 py-12">
      <div className="w-full max-w-[960px] px-6\">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-plum-900">Contribution Activity</h2>
            <p className="mt-1 text-text-secondary">Last year activity — aggregated from views, articles, and projects</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-plum-200 bg-gradient-to-br from-white via-plum-50 to-white p-6 shadow-lg shadow-plum-900/5">
          <div className="min-w-[700px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-plum-700">Total this year</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-plum-600 bg-clip-text text-transparent">{stats.total}</div>
              </div>
              <div className="flex gap-6">
                <div className="text-sm text-text-secondary rounded-lg bg-amber-50 p-3 border border-amber-100">
                  <div className="font-semibold text-amber-700">Current streak</div>
                  <div>{stats.current} days</div>
                </div>
                <div className="text-sm text-text-secondary rounded-lg bg-plum-50 p-3 border border-plum-100">
                  <div className="font-semibold text-plum-700">Longest streak</div>
                  <div>{stats.longest} days</div>
                </div>
              </div>
            </div>

            <div className="mb-2 relative text-xs font-medium text-text-secondary">
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${rendered.length}, minmax(0, 1fr))` }}>
                {monthPositions.map((p) => (
                  <div key={p.index} style={{ gridColumnStart: p.index + 1 }} className="pl-1">
                    {p.month}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex h-[110px] flex-col justify-between pb-2 pt-2 text-[10px] text-text-secondary">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div className="grid h-[110px] flex-1 grid-flow-col grid-rows-7 gap-1">
                {rendered.map((level, index) => {
                  const date = cellDate(index)
                  const title = `${date}: ${level} contribution${level === 1 ? '' : 's'}`
                  return (
                    <div
                      key={index}
                      role="img"
                      aria-label={title}
                      title={title}
                      className={`h-full w-full rounded-[2px] ${palette[Math.min(Number(level || 0), palette.length - 1)]} transition-all hover:scale-[1.02]`}
                    />
                  )
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-text-secondary">
              <span>Less</span>
              <div className="flex gap-1">
                {palette.map((color, idx) => (
                  <div key={idx} className={`h-3 w-3 rounded-[2px] ${color}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index = 0 }) {
  const techStack = Array.isArray(project?.tech_stack) ? project.tech_stack : []

  const imgSrc = getProjectImage(project, index)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-plum-200 bg-white shadow-md transition-all duration-300 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/10">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-plum-200 via-amber-100 to-plum-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={project.title}
            onError={(e) => {
              // hide broken remote image and show icon instead
              e.currentTarget.style.display = 'none'
            }}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Icon name="code" className="size-12 text-plum-400" />
        )}
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
    <section id="projects" className="relative flex w-full justify-center py-16">
      <div className="w-full max-w-[960px] px-6">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="border-l-4 border-amber-400 pl-4 text-3xl font-bold text-plum-900">Featured Projects</h2>
          <span className="flex items-center gap-1 font-medium text-plum-700">
            Total {projects.length} <Icon name="arrowForward" className="size-4" />
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-plum-200 bg-gradient-to-br from-plum-50 to-white p-8">
            <EmptyState message="No projects available for this portfolio." />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={`${project?.title || 'project'}-${index}`} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ArticlesAndPapersSection({ articles = [], papers = [], profile = {} }) {
  return (
    <section id="articles" className="relative flex w-full justify-center border-t border-plum-200 bg-white py-16 overflow-hidden">
      <div className="relative z-10 flex w-full max-w-[960px] flex-col gap-12 px-6 md:flex-row">
        <div className="flex-1">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-plum-50 p-2 text-plum-700">
              <Icon name="article" className="size-5" />
            </div>
            <h2 className="text-2xl font-bold text-plum-900">Recent Articles</h2>
          </div>

          <div className="flex flex-col gap-4">
            {articles.length === 0 ? (
              <div className="rounded-2xl border border-plum-200 bg-gradient-to-br from-plum-50 to-white p-8">
                <EmptyState message="No articles available for this portfolio." />
              </div>
            ) : (
              articles.map((article) => (
                <article key={article.id} className="rounded-xl border border-plum-200 bg-white p-4 transition-all hover:border-amber-300 hover:bg-gradient-to-r hover:from-white hover:to-amber-50 hover:shadow-md shadow-sm">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-plum-900">{article.title}</h3>
                    <a href={article.url} target="_blank" rel="noreferrer"><Icon name="openInNew" className="size-5 text-plum-200" /></a>
                  </div>

                  {article.description && <p className="mb-3 mt-1 text-sm text-text-secondary">{article.description}</p>}

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Icon name="calendar" className="size-[14px]" />
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                    <span className="rounded border border-amber-100 bg-amber-50 px-2 py-0.5 text-amber-700">{article.source}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="flex-1" id="contact">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Icon name="mail" className="size-5" />
            </div>
            <h2 className="text-2xl font-bold text-plum-900">Contact</h2>
          </div>

          <div className="flex flex-col gap-4">
            {(() => {
              if (!profile) return (
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8">
                  <EmptyState message="No contact information available." />
                </div>
              )

              const contact = profile.contact || { email: profile.email, github: profile.github, linkedin: profile.linkedin }
              if (!contact || (!contact.email && !contact.github && !contact.linkedin)) {
                return (
                  <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8">
                    <EmptyState message="No contact information available." />
                  </div>
                )
              }

              return (
                <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 p-5 shadow-md">
                  {contact.email && (
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-plum-900">Email</h3>
                      <a href={`mailto:${contact.email}`} className="text-sm text-slate-600">{contact.email}</a>
                    </div>
                  )}

                  {contact.github && (
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-plum-900">GitHub</h3>
                      <a href={contact.github} target="_blank" rel="noreferrer" className="text-sm text-slate-600">{contact.github}</a>
                    </div>
                  )}

                  {contact.linkedin && (
                    <div>
                      <h3 className="text-sm font-semibold text-plum-900">LinkedIn</h3>
                      <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-sm text-slate-600">{contact.linkedin}</a>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative w-full border-t border-plum-200 bg-white py-8 text-center">
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white font-display text-text-main antialiased dark:bg-background-dark\">
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

            {/* 2. About Section */}
            {(portfolio?.professional_summary || portfolio?.career_objective || portfolio?.bio) && (
              <section id="about" className="relative flex w-full justify-center py-12 bg-white border-b border-plum-100">
                <div className="w-full max-w-[960px] px-6">
                  <h2 className="text-3xl font-bold text-plum-900 border-l-4 border-amber-400 pl-4 mb-6">About</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-plum-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100">
                      <h3 className="text-lg font-semibold text-plum-900 mb-2">Professional Summary</h3>
                      <p className="text-text-secondary">{portfolio?.professional_summary || portfolio?.bio}</p>
                    </div>

                    <div className="rounded-2xl border border-plum-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100">
                      <h3 className="text-lg font-semibold text-plum-900 mb-2">Career Objective</h3>
                      <p className="text-text-secondary">{portfolio?.career_objective || 'No career objective provided.'}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 3. Technical Skills */}
            {portfolio?.skills && portfolio.skills.length > 0 && (
              <div className="relative flex w-full justify-center py-12 bg-white border-b border-plum-100">
                <div className="w-full max-w-[960px] px-6">
                  <h2 className="text-3xl font-bold text-plum-900 border-l-4 border-amber-400 pl-4 mb-8">Technical Expertise</h2>
                  <SkillGrid skills={portfolio.skills} />
                </div>
              </div>
            )}

            {/* 4. Projects */}
            <ProjectsSection projects={projects} />

            {/* 5. Education / Certificates / Extras */}
            {(Array.isArray(portfolio?.education) || Array.isArray(portfolio?.certificates) || Array.isArray(portfolio?.extras)) && (
              <section id="education" className="relative flex w-full justify-center py-12 bg-surface-container-lowest border-t border-plum-100">
                <div className="w-full max-w-[960px] px-6">
                  <h2 className="text-3xl font-bold text-plum-900 border-l-4 border-amber-400 pl-4 mb-8">Academic & Extras</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-plum-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300">
                      <h4 className="text-lg font-semibold text-plum-900 mb-3">Education</h4>
                      {(Array.isArray(portfolio?.education) && portfolio.education.length > 0) ? (
                        <ul className="space-y-3 text-text-secondary">
                          {portfolio.education.map((ed, i) => (
                            <li key={i} className="flex items-start gap-3 rounded-md p-2 hover:bg-plum-50 transition-colors">
                              <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-amber-50 text-amber-700">
                                <Icon name="school" className="size-4" />
                              </div>
                              <div className="text-sm">
                                {ed}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-text-secondary">No education details provided.</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-plum-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300">
                      <h4 className="text-lg font-semibold text-plum-900 mb-3">Certificates</h4>
                      {(Array.isArray(portfolio?.certificates) && portfolio.certificates.length > 0) ? (
                        <ul className="space-y-3 text-text-secondary">
                          {portfolio.certificates.map((c, i) => (
                            <li key={i} className="flex items-start gap-3 rounded-md p-2 hover:bg-amber-50 transition-colors">
                              <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-plum-50 text-plum-700">
                                <Icon name="pdf" className="size-4" />
                              </div>
                              <div className="text-sm">{c}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-text-secondary">No certificates listed.</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-plum-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300">
                      <h4 className="text-lg font-semibold text-plum-900 mb-3">Extra-Curricular</h4>
                      {(Array.isArray(portfolio?.extras) && portfolio.extras.length > 0) ? (
                        <ul className="space-y-3 text-text-secondary">
                          {portfolio.extras.map((e, i) => (
                            <li key={i} className="flex items-start gap-3 rounded-md p-2 hover:bg-plum-50 transition-colors">
                              <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-amber-50 text-amber-700">
                                <Icon name="calendar" className="size-4" />
                              </div>
                              <div className="text-sm">{e}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-text-secondary">No extra-curricular activities listed.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Optional: contributions and articles remain below */}
            <ContributionSection username={username} />
            <ArticlesAndPapersSection articles={portfolio?.articles || []} papers={portfolio?.papers || []} profile={portfolio} />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default PublicPortfolio
