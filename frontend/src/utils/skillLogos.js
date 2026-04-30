const SIMPLE_ICONS = {
  ejs: 'ejs',
  handlebars: 'handlebarsdotjs',
  python: 'python',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  react: 'react',
  django: 'django',
  java: 'java',
  jupyter: 'jupyter',
  'jupyter notebook': 'jupyter',
  nodejs: 'nodedotjs',
  'node.js': 'nodedotjs',
  html: 'html5',
  html5: 'html5',
  css: 'css3',
  css3: 'css3',
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  postgres: 'postgresql',
  postgresql: 'postgresql',
  mongodb: 'mongodb',
  mysql: 'mysql',
}

export function getSkillLogoUrl(skillName) {
  if (!skillName) return ''

  const key = String(skillName).trim().toLowerCase()
  const slug = SIMPLE_ICONS[key]

  if (!slug) return ''

  return `https://cdn.simpleicons.org/${slug}`
}
