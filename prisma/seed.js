const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Users ────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alex.rivera@petro.id' },
      update: {},
      create: { name: 'Alex Rivera', email: 'alex.rivera@petro.id', password: 'hashed_pw', role: 'studio_director' },
    }),
    prisma.user.upsert({
      where: { email: 'elena.vance@petro.id' },
      update: {},
      create: { name: 'Elena Vance', email: 'elena.vance@petro.id', password: 'hashed_pw', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'marcus.thorne@petro.id' },
      update: {},
      create: { name: 'Marcus Thorne', email: 'marcus.thorne@petro.id', password: 'hashed_pw', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.jenkins@petro.id' },
      update: {},
      create: { name: 'Sarah Jenkins', email: 'sarah.jenkins@petro.id', password: 'hashed_pw', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'jordan.smith@petro.id' },
      update: {},
      create: { name: 'Jordan Smith', email: 'jordan.smith@petro.id', password: 'hashed_pw', role: 'designer' },
    }),
  ])

  const [alex, elena, marcus, sarah, jordan] = users
  console.log(`✅ ${users.length} users created`)

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
    // Completed — untuk Archive
    {
      title: 'Nexus Platform UI',
      category: 'UI/UX Design',
      client: 'Stellar Tech',
      product: 'Nexus SaaS Platform',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      budget: 8500,
      projectType: 'Web Design',
      description: 'Full UI redesign for the Nexus SaaS dashboard. Dark mode aesthetic with glassmorphism cards and data visualization components.',
      assignedDesignerId: elena.id,
      createdById: alex.id,
      deadline: new Date('2023-10-12'),
      createdAt: new Date('2023-09-01'),
      tagNames: ['UI/UX', 'Figma', 'Web Design'],
    },
    {
      title: 'Neon Rebranding',
      category: 'Brand Identity',
      client: 'Neon Dynamics',
      product: 'Corporate Identity',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      budget: 12000,
      projectType: 'Branding',
      description: 'Complete brand overhaul including logo, color system, typography guide, and brand book for Neon Dynamics.',
      assignedDesignerId: jordan.id,
      createdById: alex.id,
      deadline: new Date('2023-09-28'),
      createdAt: new Date('2023-08-10'),
      tagNames: ['Branding', 'Print'],
    },
    {
      title: 'Q3 Ad Campaign',
      category: 'Marketing Assets',
      client: 'Aura Ventures',
      product: 'Aura Mobile App',
      status: 'Completed',
      priority: 'Urgent',
      progress: 100,
      budget: 5200,
      projectType: 'Marketing',
      description: 'Series of dynamic social media ad creatives for Q3 campaign. 15 formats across Instagram, Facebook, and TikTok.',
      assignedDesignerId: sarah.id,
      createdById: alex.id,
      deadline: new Date('2023-08-15'),
      createdAt: new Date('2023-07-20'),
      tagNames: ['Social Media', 'Marketing', 'Mobile'],
    },
    {
      title: 'Nova Pack Design',
      category: 'Product Design',
      client: 'Orion Audio',
      product: 'Nova Headphones',
      status: 'Completed',
      priority: 'Medium',
      progress: 100,
      budget: 7800,
      projectType: 'Packaging',
      description: 'Premium packaging design for the Nova headphones line. Matte black with spot UV and silver foil.',
      assignedDesignerId: marcus.id,
      createdById: alex.id,
      deadline: new Date('2023-07-30'),
      createdAt: new Date('2023-06-15'),
      tagNames: ['Product', 'Packaging', 'Print'],
    },
    {
      title: 'Aether Characters',
      category: 'Motion Graphics',
      client: 'GameSpire',
      product: 'Aether Game',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      budget: 15000,
      projectType: '3D Design',
      description: 'Character design and 3D modeling for Aether mobile game. 12 hero characters with animation rigs.',
      assignedDesignerId: marcus.id,
      createdById: alex.id,
      deadline: new Date('2023-06-12'),
      createdAt: new Date('2023-04-01'),
      tagNames: ['3D Assets', 'Motion Graphics'],
    },
    {
      title: '2023 Annual Report',
      category: 'Editorial',
      client: 'EcoTrust',
      product: 'Annual Report 2023',
      status: 'Completed',
      priority: 'Medium',
      progress: 100,
      budget: 4500,
      projectType: 'Editorial',
      description: 'Annual sustainability report layout. 48-page editorial design with infographics and photography curation.',
      assignedDesignerId: elena.id,
      createdById: alex.id,
      deadline: new Date('2023-05-05'),
      createdAt: new Date('2023-03-10'),
      tagNames: ['Editorial', 'Print', 'Illustration'],
    },
    {
      title: 'Horizon Travel Web',
      category: 'UI/UX Design',
      client: 'Horizon Lux',
      product: 'Horizon Booking Platform',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      budget: 9200,
      projectType: 'Web Design',
      description: 'Luxury travel agency website redesign. Large photography, elegant filters, and seamless booking flow.',
      assignedDesignerId: elena.id,
      createdById: alex.id,
      deadline: new Date('2023-04-21'),
      createdAt: new Date('2023-02-15'),
      tagNames: ['UI/UX', 'Web Design', 'Figma'],
    },
    {
      title: 'Prism Icon Set',
      category: 'UI/UX Design',
      client: 'Internal',
      product: 'Design System Assets',
      status: 'Completed',
      priority: 'Low',
      progress: 100,
      budget: 2800,
      projectType: 'Asset Library',
      description: 'Comprehensive glassmorphism icon library for internal design system. 240 icons in 3 weights.',
      assignedDesignerId: sarah.id,
      createdById: alex.id,
      deadline: new Date('2023-03-10'),
      createdAt: new Date('2023-01-20'),
      tagNames: ['Asset Library', 'UI/UX', 'Figma'],
    },
    {
      title: 'Lumina Brand Kit',
      category: 'Brand Identity',
      client: 'Lumina Health',
      product: 'Brand Identity System',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      budget: 11000,
      projectType: 'Branding',
      description: 'Full brand identity for Lumina Health startup. Logo, color palette, typography, and digital guidelines.',
      assignedDesignerId: jordan.id,
      createdById: alex.id,
      deadline: new Date('2023-02-28'),
      createdAt: new Date('2023-01-05'),
      tagNames: ['Branding', 'Print'],
    },
    {
      title: 'Cyber Week Campaign',
      category: 'Marketing Assets',
      client: 'TechMart',
      product: 'Cyber Week 2022',
      status: 'Completed',
      priority: 'Urgent',
      progress: 100,
      budget: 6500,
      projectType: 'Marketing',
      description: 'Full Cyber Week digital campaign. Banner ads, email templates, social assets, and landing page design.',
      assignedDesignerId: sarah.id,
      createdById: alex.id,
      deadline: new Date('2022-11-28'),
      createdAt: new Date('2022-11-01'),
      tagNames: ['Marketing', 'Social Media', 'Web Design'],
    },
    {
      title: 'Vertex Dashboard',
      category: 'UI/UX Design',
      client: 'Vertex Analytics',
      product: 'Analytics Dashboard',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      budget: 13500,
      projectType: 'Web Design',
      description: 'Data analytics dashboard with complex charts, filters, and real-time data visualization.',
      assignedDesignerId: elena.id,
      createdById: alex.id,
      deadline: new Date('2022-10-15'),
      createdAt: new Date('2022-08-20'),
      tagNames: ['UI/UX', 'Web Design', 'Figma'],
    },
    {
      title: 'Solara App Redesign',
      category: 'UI/UX Design',
      client: 'Solara Energy',
      product: 'Solara Mobile App',
      status: 'Completed',
      priority: 'Medium',
      progress: 100,
      budget: 7200,
      projectType: 'Mobile Design',
      description: 'iOS and Android app redesign for Solara home energy management. Clean, minimal interface with real-time monitoring.',
      assignedDesignerId: elena.id,
      createdById: alex.id,
      deadline: new Date('2022-09-10'),
      createdAt: new Date('2022-07-15'),
      tagNames: ['UI/UX', 'Mobile', 'Figma'],
    },
    // Non-completed — muncul di Dashboard/Requests tapi bukan Archive default
    {
      title: 'Astra Mobile App',
      category: 'UI/UX Design',
      client: 'SpaceX Solutions',
      product: 'Astra App',
      status: 'In Progress',
      priority: 'High',
      progress: 65,
      budget: 9800,
      projectType: 'Mobile Design',
      description: 'Mobile app for SpaceX ground operations team. Real-time telemetry display and mission management.',
      assignedDesignerId: elena.id,
      createdById: alex.id,
      deadline: new Date('2026-09-30'),
      tagNames: ['UI/UX', 'Mobile', 'Figma'],
    },
    {
      title: 'Lumina Web Portal',
      category: 'UI/UX Design',
      client: 'Glow Inc.',
      product: 'Customer Portal',
      status: 'Review',
      priority: 'Medium',
      progress: 90,
      budget: 6500,
      projectType: 'Web Design',
      description: 'Customer self-service portal for Glow Inc. Account management, order tracking, and support tickets.',
      assignedDesignerId: jordan.id,
      createdById: alex.id,
      deadline: new Date('2026-08-15'),
      tagNames: ['UI/UX', 'Web Design'],
    },
    {
      title: 'Neon Branding',
      category: 'Brand Identity',
      client: 'Cyberdyne Systems',
      product: 'Corporate Rebrand',
      status: 'Revision',
      priority: 'High',
      progress: 45,
      budget: 14000,
      projectType: 'Branding',
      description: 'Complete corporate rebrand for Cyberdyne Systems. Logo, brand voice, and digital guidelines.',
      assignedDesignerId: marcus.id,
      createdById: alex.id,
      deadline: new Date('2026-09-01'),
      tagNames: ['Branding'],
    },
    {
      title: 'Velocity Logo Set',
      category: 'Brand Identity',
      client: 'Swift Media',
      product: 'Logo Package',
      status: 'Completed',
      priority: 'Low',
      progress: 100,
      budget: 3200,
      projectType: 'Branding',
      description: 'Logo design and variations for Swift Media podcast network. Primary, secondary, and favicon versions.',
      assignedDesignerId: sarah.id,
      createdById: alex.id,
      deadline: new Date('2026-07-20'),
      tagNames: ['Branding'],
    },
    {
      title: 'PROJECT-882: Neo-Genesis Landing Page',
      category: 'UI/UX Design',
      client: 'Genesis Collective',
      product: 'Neo-Genesis NFT Platform',
      status: 'In Progress',
      priority: 'Urgent',
      progress: 65,
      budget: 4500,
      projectType: 'Web Design',
      description: "Design a high-conversion landing page for the 'Neo-Genesis' NFT platform. The aesthetic should align with our 'Digital Studio' vibe: deep, immersive backgrounds contrasted with vibrant, translucent UI layers.",
      assignedDesignerId: sarah.id,
      createdById: alex.id,
      deadline: new Date('2023-10-31'),
      tagNames: ['UI/UX', 'Web Design', 'Figma'],
    },
  ]

  const createdRequests = []

  for (const req of requests) {
    const { tagNames: reqTags, createdAt, ...data } = req

    const created = await prisma.designRequest.create({
      data: {
        ...data,
        ...(createdAt ? { createdAt } : {}),
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
