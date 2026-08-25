const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Users ────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@petro.id' },
      update: {},
      create: { name: 'Priya Nair', email: 'admin@petro.id', password: 'password123', role: 'admin' },
    }),
    prisma.user.upsert({
      where: { email: 'alex.rivera@petro.id' },
      update: {},
      create: { name: 'Alex Rivera', email: 'alex.rivera@petro.id', password: 'password123', role: 'studio_director' },
    }),
    prisma.user.upsert({
      where: { email: 'elena.vance@petro.id' },
      update: {},
      create: { name: 'Elena Vance', email: 'elena.vance@petro.id', password: 'password123', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'marcus.thorne@petro.id' },
      update: {},
      create: { name: 'Marcus Thorne', email: 'marcus.thorne@petro.id', password: 'password123', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.jenkins@petro.id' },
      update: {},
      create: { name: 'Sarah Jenkins', email: 'sarah.jenkins@petro.id', password: 'password123', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'jordan.smith@petro.id' },
      update: {},
      create: { name: 'Jordan Smith', email: 'jordan.smith@petro.id', password: 'password123', role: 'designer' },
    }),
  ])

  const [admin, alex, elena, marcus, sarah, jordan] = users
  console.log(`✅ ${users.length} users created (password: password123)`)

  // ── Tags ─────────────────────────────────────────────────
  const tagNames = [
    'UI/UX', 'Branding', 'Social Media', 'Web Design', 'Motion Graphics',
    '3D Assets', 'Editorial', 'Product', 'Packaging', 'Asset Library',
    'Figma', 'Illustration', 'Marketing', 'Mobile', 'Print',
  ]

  const tags = {}
  for (const name of tagNames) {
    tags[name] = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log(`✅ ${tagNames.length} tags created`)

  // ── Design Requests ───────────────────────────────────────
  const requests = [
    // ── MARCH 2026 (5 requests, all Completed) ──────────────
    {
      title: 'Nexus Platform UI',
      category: 'UI/UX Design', client: 'Stellar Tech', product: 'Nexus SaaS Platform',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Web Design',
      description: 'Full UI redesign for Nexus SaaS dashboard. Dark mode with glassmorphism cards.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-03-20'), createdAt: new Date('2026-03-03'),
      tagNames: ['UI/UX', 'Figma', 'Web Design'],
    },
    {
      title: 'Lumina Brand Kit',
      category: 'Brand Identity', client: 'Lumina Health', product: 'Brand Identity System',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Branding',
      description: 'Full brand identity for Lumina Health startup.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-03-22'), createdAt: new Date('2026-03-07'),
      tagNames: ['Branding', 'Print'],
    },
    {
      title: 'Q1 Marketing Pack',
      category: 'Marketing Assets', client: 'Aura Ventures', product: 'Aura Mobile App',
      status: 'Completed', priority: 'Urgent', progress: 100, projectType: 'Marketing',
      description: 'Social media ad creatives for Q1 campaign — 15 formats.',
      assignedDesignerId: sarah.id, createdById: alex.id,
      deadline: new Date('2026-03-25'), createdAt: new Date('2026-03-10'),
      tagNames: ['Social Media', 'Marketing', 'Mobile'],
    },
    {
      title: 'Prism Icon Set',
      category: 'UI/UX Design', client: 'Internal', product: 'Design System Assets',
      status: 'Completed', priority: 'Low', progress: 100, projectType: 'Asset Library',
      description: 'Glassmorphism icon library — 240 icons in 3 weights.',
      assignedDesignerId: sarah.id, createdById: alex.id,
      deadline: new Date('2026-03-27'), createdAt: new Date('2026-03-14'),
      tagNames: ['Asset Library', 'UI/UX', 'Figma'],
    },
    {
      title: 'Nova Pack Design',
      category: 'Product Design', client: 'Orion Audio', product: 'Nova Headphones',
      status: 'Completed', priority: 'Medium', progress: 100, projectType: 'Packaging',
      description: 'Premium packaging for Nova headphones — matte black, spot UV.',
      assignedDesignerId: marcus.id, createdById: alex.id,
      deadline: new Date('2026-03-30'), createdAt: new Date('2026-03-18'),
      tagNames: ['Product', 'Packaging', 'Print'],
    },
    // ── APRIL 2026 (5 requests, all Completed) ──────────────
    {
      title: 'Horizon Travel Web',
      category: 'UI/UX Design', client: 'Horizon Lux', product: 'Horizon Booking Platform',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Web Design',
      description: 'Luxury travel agency redesign. Large photography, seamless booking flow.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-04-22'), createdAt: new Date('2026-04-02'),
      tagNames: ['UI/UX', 'Web Design', 'Figma'],
    },
    {
      title: 'Neon Rebranding',
      category: 'Brand Identity', client: 'Neon Dynamics', product: 'Corporate Identity',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Branding',
      description: 'Complete brand overhaul — logo, color system, typography, brand book.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-04-24'), createdAt: new Date('2026-04-07'),
      tagNames: ['Branding', 'Print'],
    },
    {
      title: 'Vertex Dashboard',
      category: 'UI/UX Design', client: 'Vertex Analytics', product: 'Analytics Dashboard',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Web Design',
      description: 'Analytics dashboard with complex charts and real-time data visualization.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-04-26'), createdAt: new Date('2026-04-10'),
      tagNames: ['UI/UX', 'Web Design', 'Figma'],
    },
    {
      title: 'Aether Characters',
      category: 'Motion Graphics', client: 'GameSpire', product: 'Aether Game',
      status: 'Completed', priority: 'High', progress: 100, projectType: '3D Design',
      description: 'Character design and 3D modeling for Aether mobile game.',
      assignedDesignerId: marcus.id, createdById: alex.id,
      deadline: new Date('2026-04-28'), createdAt: new Date('2026-04-14'),
      tagNames: ['3D Assets', 'Motion Graphics'],
    },
    {
      title: 'EcoTrust Report Layout',
      category: 'Editorial', client: 'EcoTrust', product: 'Annual Report 2025',
      status: 'Completed', priority: 'Medium', progress: 100, projectType: 'Editorial',
      description: '48-page annual sustainability report layout with infographics.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-04-30'), createdAt: new Date('2026-04-18'),
      tagNames: ['Editorial', 'Print', 'Illustration'],
    },
    // ── MAY 2026 (5 requests, all Completed) ────────────────
    {
      title: 'Solara App Redesign',
      category: 'UI/UX Design', client: 'Solara Energy', product: 'Solara Mobile App',
      status: 'Completed', priority: 'Medium', progress: 100, projectType: 'Mobile Design',
      description: 'iOS and Android redesign for Solara home energy management.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-05-20'), createdAt: new Date('2026-05-02'),
      tagNames: ['UI/UX', 'Mobile', 'Figma'],
    },
    {
      title: 'Velocity Logo Set',
      category: 'Brand Identity', client: 'Swift Media', product: 'Logo Package',
      status: 'Completed', priority: 'Low', progress: 100, projectType: 'Branding',
      description: 'Logo and variations for Swift Media podcast network.',
      assignedDesignerId: sarah.id, createdById: alex.id,
      deadline: new Date('2026-05-22'), createdAt: new Date('2026-05-06'),
      tagNames: ['Branding'],
    },
    {
      title: 'Apex Mobile App UI',
      category: 'UI/UX Design', client: 'Apex Tech', product: 'Apex App',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Mobile Design',
      description: 'Full UI design for Apex fintech mobile application.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-05-25'), createdAt: new Date('2026-05-09'),
      tagNames: ['UI/UX', 'Mobile'],
    },
    {
      title: 'Cyber Week Campaign',
      category: 'Marketing Assets', client: 'TechMart', product: 'Campaign 2026',
      status: 'Completed', priority: 'Urgent', progress: 100, projectType: 'Marketing',
      description: 'Full Cyber Week digital campaign — banners, email, social.',
      assignedDesignerId: sarah.id, createdById: alex.id,
      deadline: new Date('2026-05-27'), createdAt: new Date('2026-05-13'),
      tagNames: ['Marketing', 'Social Media', 'Web Design'],
    },
    {
      title: 'Orion Brand Refresh',
      category: 'Brand Identity', client: 'Orion Audio', product: 'Brand Refresh',
      status: 'Completed', priority: 'Medium', progress: 100, projectType: 'Branding',
      description: 'Brand refresh for Orion Audio — updated logo and visual language.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-05-30'), createdAt: new Date('2026-05-17'),
      tagNames: ['Branding', 'Print'],
    },
    // ── JUNE 2026 (5 requests, all Completed) ───────────────
    {
      title: 'Flux Dashboard v2',
      category: 'UI/UX Design', client: 'Flux Systems', product: 'Flux Dashboard',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Web Design',
      description: 'Version 2 redesign of Flux admin dashboard with new design system.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-06-20'), createdAt: new Date('2026-06-03'),
      tagNames: ['UI/UX', 'Web Design', 'Figma'],
    },
    {
      title: 'Pulse Motion Graphics',
      category: 'Motion Graphics', client: 'Pulse Media', product: 'Promo Video Assets',
      status: 'Completed', priority: 'High', progress: 100, projectType: '3D Design',
      description: 'Animated intro sequences and lower-thirds for Pulse Media shows.',
      assignedDesignerId: marcus.id, createdById: alex.id,
      deadline: new Date('2026-06-22'), createdAt: new Date('2026-06-07'),
      tagNames: ['Motion Graphics', '3D Assets'],
    },
    {
      title: 'GreenLeaf Packaging',
      category: 'Product Design', client: 'GreenLeaf Co', product: 'Organic Product Line',
      status: 'Completed', priority: 'Medium', progress: 100, projectType: 'Packaging',
      description: 'Eco-friendly packaging design for organic product line.',
      assignedDesignerId: marcus.id, createdById: alex.id,
      deadline: new Date('2026-06-24'), createdAt: new Date('2026-06-10'),
      tagNames: ['Product', 'Packaging'],
    },
    {
      title: 'Spark Social Kit',
      category: 'Marketing Assets', client: 'Spark Agency', product: 'Social Media Kit',
      status: 'Completed', priority: 'Medium', progress: 100, projectType: 'Marketing',
      description: 'Complete social media template kit for Spark Agency clients.',
      assignedDesignerId: sarah.id, createdById: alex.id,
      deadline: new Date('2026-06-26'), createdAt: new Date('2026-06-14'),
      tagNames: ['Social Media', 'Marketing'],
    },
    {
      title: 'Terra Web Redesign',
      category: 'UI/UX Design', client: 'Terra Corp', product: 'Corporate Website',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Web Design',
      description: 'Full corporate website redesign for Terra Corp.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-06-28'), createdAt: new Date('2026-06-18'),
      tagNames: ['UI/UX', 'Web Design'],
    },
    // ── JULY 2026 (5 requests, mix Completed/active) ────────
    {
      title: 'Mosaic Brand Identity',
      category: 'Brand Identity', client: 'Mosaic Studio', product: 'Brand Identity',
      status: 'Completed', priority: 'High', progress: 100, projectType: 'Branding',
      description: 'New brand identity for Mosaic creative studio.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-07-18'), createdAt: new Date('2026-07-02'),
      tagNames: ['Branding'],
    },
    {
      title: 'Zeta App Onboarding',
      category: 'UI/UX Design', client: 'Zeta Labs', product: 'Zeta App',
      status: 'Completed', priority: 'Medium', progress: 100, projectType: 'Mobile Design',
      description: 'Onboarding flow redesign for Zeta productivity app.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-07-20'), createdAt: new Date('2026-07-05'),
      tagNames: ['UI/UX', 'Mobile', 'Figma'],
    },
    {
      title: 'Nova Campaign 2026',
      category: 'Marketing Assets', client: 'Nova Brands', product: 'Summer Campaign',
      status: 'Completed', priority: 'Urgent', progress: 100, projectType: 'Marketing',
      description: 'Summer campaign assets — display ads, social, landing page.',
      assignedDesignerId: sarah.id, createdById: alex.id,
      deadline: new Date('2026-07-22'), createdAt: new Date('2026-07-09'),
      tagNames: ['Marketing', 'Social Media'],
    },
    {
      title: 'Lumina Web Portal',
      category: 'UI/UX Design', client: 'Glow Inc.', product: 'Customer Portal',
      status: 'Review', priority: 'Medium', progress: 90, projectType: 'Web Design',
      description: 'Customer self-service portal for Glow Inc.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-08-15'), createdAt: new Date('2026-07-14'),
      tagNames: ['UI/UX', 'Web Design'],
    },
    {
      title: 'Neon Branding',
      category: 'Brand Identity', client: 'Cyberdyne Systems', product: 'Corporate Rebrand',
      status: 'Revision', priority: 'High', progress: 45, projectType: 'Branding',
      description: 'Corporate rebrand for Cyberdyne Systems.',
      assignedDesignerId: marcus.id, createdById: alex.id,
      deadline: new Date('2026-09-01'), createdAt: new Date('2026-07-18'),
      tagNames: ['Branding'],
    },
    // ── AUGUST 2026 (5 requests, mostly active) ─────────────
    {
      title: 'Astra Mobile App',
      category: 'UI/UX Design', client: 'SpaceX Solutions', product: 'Astra App',
      status: 'In Progress', priority: 'High', progress: 65, projectType: 'Mobile Design',
      description: 'Mobile app for SpaceX ground operations — real-time telemetry.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-09-30'), createdAt: new Date('2026-08-04'),
      tagNames: ['UI/UX', 'Mobile', 'Figma'],
    },
    {
      title: 'PROJECT-882: Neo-Genesis Landing Page',
      category: 'UI/UX Design', client: 'Genesis Collective', product: 'Neo-Genesis NFT Platform',
      status: 'In Progress', priority: 'Urgent', progress: 65, projectType: 'Web Design',
      description: "Design a high-conversion landing page for the 'Neo-Genesis' NFT platform.",
      assignedDesignerId: sarah.id, createdById: alex.id,
      deadline: new Date('2026-09-20'), createdAt: new Date('2026-08-08'),
      tagNames: ['UI/UX', 'Web Design', 'Figma'],
    },
    {
      title: 'Drift Brand Guidelines',
      category: 'Brand Identity', client: 'Drift Analytics', product: 'Brand Guidelines',
      status: 'In Progress', priority: 'Medium', progress: 40, projectType: 'Branding',
      description: 'Comprehensive brand guidelines document for Drift Analytics.',
      assignedDesignerId: jordan.id, createdById: alex.id,
      deadline: new Date('2026-09-15'), createdAt: new Date('2026-08-12'),
      tagNames: ['Branding'],
    },
    {
      title: 'Helios Editorial Design',
      category: 'Editorial', client: 'Helios Media', product: 'Magazine Layout',
      status: 'In Progress', priority: 'High', progress: 55, projectType: 'Editorial',
      description: 'Digital magazine layout design for Helios quarterly publication.',
      assignedDesignerId: elena.id, createdById: alex.id,
      deadline: new Date('2026-09-10'), createdAt: new Date('2026-08-16'),
      tagNames: ['Editorial', 'Print'],
    },
    {
      title: 'Vortex 3D Assets',
      category: 'Motion Graphics', client: 'Vortex Games', product: 'Game Assets',
      status: 'In Progress', priority: 'High', progress: 30, projectType: '3D Design',
      description: '3D environment assets and character rigs for Vortex game.',
      assignedDesignerId: marcus.id, createdById: alex.id,
      deadline: new Date('2026-10-01'), createdAt: new Date('2026-08-20'),
      tagNames: ['3D Assets', 'Motion Graphics'],
    },
  ]

  const createdRequests = []

  // Generate 30 random dates dalam Mar–Aug 2026, sorted
  const rangeStart = new Date('2026-03-01').getTime()
  const rangeEnd   = new Date('2026-08-25').getTime()
  const randomDates = Array.from({ length: requests.length }, () =>
    new Date(rangeStart + Math.random() * (rangeEnd - rangeStart))
  ).sort((a, b) => a - b)

  for (let idx = 0; idx < requests.length; idx++) {
    const { tagNames: reqTags, createdAt: _ignored, ...data } = requests[idx]

    const created = await prisma.designRequest.create({
      data: {
        ...data,
        createdAt: randomDates[idx],
        tags: {
          create: reqTags.map((name) => ({
            tag: { connect: { name } },
          })),
        },
      },
    })

    createdRequests.push(created)
    process.stdout.write('.')
  }

  console.log(`\n✅ ${requests.length} design requests created`)

  // ── Reference files (untuk beberapa request) ──────────────────
  const referenceFiles = [
    {
      requestIndex: 0, // Nexus Platform UI
      name: 'dashboard-mockup.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
      mimeType: 'image/png',
    },
    {
      requestIndex: 0,
      name: 'color-palette.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxICXbNpxAqFhlVsSScnevdTYK6CtHvpKHFEC8rDXsY6NZqrHZ8LUWtDqwSUW2MCoJ2VmwNUHj8QDoNmz1m4jm1S_E7S4Q8Ayt91PLCmzIqXsMlfEQLBziPNG79jo0fFkaCsFN-ViorE83osVivMoo0BW0U6PgPmwEmVulm7c9mnZaQMAjhOZNb4f51msiKhgnkdS1IZoW25O1tFkHSu2SjD6nZ4nBFkz71XgGVH6WQCvW0yRlT81x8w',
      mimeType: 'image/png',
    },
    {
      requestIndex: 1, // Neon Rebranding
      name: 'logo-concepts.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgtJ9L1KOEyiACigTi1qVOBDQq__Qfv3NmMLKPxOsukjMEYPyRyBm6lKuBYfblJs6kLcPrDgp3mfhmAty3QNw3EfJ1BMzJsIgZ9d6NG2QrOyQom_i5VTBxGd_Ly5V6pngRajXHJU4i96TpFjuy1OyA0H-VqvzqbsbtzhS2bZbaXWXMF2em6Uxvdw0pDumXxVFXZpWzW_Sd4V_BvH5aSVi3MdMUW5eR-OgS9rC13YKaNEBtdlfbD7cRYQ',
      mimeType: 'image/png',
    },
    {
      requestIndex: 16, // PROJECT-882 Neo-Genesis
      name: 'landing-reference-1.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
      mimeType: 'image/png',
    },
    {
      requestIndex: 16,
      name: 'landing-reference-2.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxICXbNpxAqFhlVsSScnevdTYK6CtHvpKHFEC8rDXsY6NZqrHZ8LUWtDqwSUW2MCoJ2VmwNUHj8QDoNmz1m4jm1S_E7S4Q8Ayt91PLCmzIqXsMlfEQLBziPNG79jo0fFkaCsFN-ViorE83osVivMoo0BW0U6PgPmwEmVulm7c9mnZaQMAjhOZNb4f51msiKhgnkdS1IZoW25O1tFkHSu2SjD6nZ4nBFkz71XgGVH6WQCvW0yRlT81x8w',
      mimeType: 'image/png',
    },
  ]

  for (const f of referenceFiles) {
    const request = createdRequests[f.requestIndex]
    if (!request) continue
    await prisma.file.create({
      data: {
        name: f.name,
        url: f.url,
        mimeType: f.mimeType,
        requestId: request.id,
      },
    })
  }
  console.log(`✅ ${referenceFiles.length} reference files created`)

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
