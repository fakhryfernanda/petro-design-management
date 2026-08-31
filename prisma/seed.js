const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Users ────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'superadmin@petro.id' },
      update: {},
      create: { name: 'Super Admin', email: 'superadmin@petro.id', password: 'password123', role: 'super_admin' },
    }),
    prisma.user.upsert({
      where: { email: 'admin@petro.id' },
      update: {},
      create: { name: 'Admin', email: 'admin@petro.id', password: 'password123', role: 'admin' },
    }),
    prisma.user.upsert({
      where: { email: 'fahmi@petro.id' },
      update: {},
      create: { name: 'Fahmi', email: 'fahmi@petro.id', password: 'password123', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'gerva@petro.id' },
      update: {},
      create: { name: 'Gerva', email: 'gerva@petro.id', password: 'password123', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'bahar@petro.id' },
      update: {},
      create: { name: 'Bahar', email: 'bahar@petro.id', password: 'password123', role: 'designer' },
    }),
    prisma.user.upsert({
      where: { email: 'baga@petro.id' },
      update: {},
      create: { name: 'Baga', email: 'baga@petro.id', password: 'password123', role: 'designer' },
    }),
  ])

  const [superAdmin, admin, fahmi, gerva, bahar, baga] = users
  console.log(`✅ ${users.length} users created (password: password123)`)

  // ── Design Requests ───────────────────────────────────────
  const requests = [
    // ── MARCH 2026 (5 requests, all Completed) ──────────────
    {
      title: 'Nexus Tower Fasad',
      category: 'Architecture', subCategory1: 'Exterior', subCategory2: 'Fasad', client: 'Stellar Tech', product: 'Nexus Tower',
      status: 'Completed', priority: 'High', projectType: 'Web Design',
      description: 'Full fasad design for Nexus Tower. Dark mode with glassmorphism cards.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-03-20'), createdAt: new Date('2026-03-03'),
      tagType: 'Custom',
    },
    {
      title: 'Lumina Brand Kit',
      category: 'Retail Support', subCategory1: 'Advertising', subCategory2: 'Polesign', client: 'Lumina Health', product: 'Brand Identity System',
      status: 'Completed', priority: 'High', projectType: 'Branding',
      description: 'Polesign design for Lumina Health startup.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-03-22'), createdAt: new Date('2026-03-07'),
      tagType: 'Regular',
    },
    {
      title: 'Q1 Marketing Pack',
      category: 'Retail Support', subCategory1: 'Meubel', subCategory2: 'Meja Kasir', client: 'Aura Ventures', product: 'Aura Mobile App',
      status: 'Completed', priority: 'Urgent', projectType: 'Marketing',
      description: 'Meja kasir design for Q1 campaign — 15 formats.',
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-03-25'), createdAt: new Date('2026-03-10'),
      tagType: 'Regular',
    },
    {
      title: 'Prism Icon Set',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Ceiling', client: 'Internal', product: 'Design System Assets',
      status: 'Completed', priority: 'Low', projectType: 'Asset Library',
      description: 'Ceiling design library — 240 icons in 3 weights.',
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-03-27'), createdAt: new Date('2026-03-14'),
      tagType: 'Regular',
    },
    {
      title: 'Nova Pack Design',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Partition', client: 'Orion Audio', product: 'Nova Headphones',
      status: 'Completed', priority: 'Medium', projectType: 'Packaging',
      description: 'Premium partition for Nova headphones — matte black, spot UV.',
      assignedDesignerId: gerva.id, createdById: admin.id,
      deadline: new Date('2026-03-30'), createdAt: new Date('2026-03-18'),
      tagType: 'Custom',
    },
    // ── APRIL 2026 (5 requests, all Completed) ──────────────
    {
      title: 'Horizon Travel Web',
      category: 'Architecture', subCategory1: 'Exterior', subCategory2: 'Secondary Skin', client: 'Horizon Lux', product: 'Horizon Booking Platform',
      status: 'Completed', priority: 'High', projectType: 'Web Design',
      description: 'Secondary skin for luxury travel agency. Large photography, seamless booking flow.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-04-22'), createdAt: new Date('2026-04-02'),
      tagType: 'Regular',
    },
    {
      title: 'Neon Rebranding',
      category: 'Retail Support', subCategory1: 'Advertising', subCategory2: 'Shopsign', client: 'Neon Dynamics', product: 'Corporate Identity',
      status: 'Completed', priority: 'High', projectType: 'Branding',
      description: 'Complete shop sign — logo, color system, typography, brand book.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-04-24'), createdAt: new Date('2026-04-07'),
      tagType: 'Regular',
    },
    {
      title: 'Vertex Dashboard',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Backdrop', client: 'Vertex Analytics', product: 'Analytics Dashboard',
      status: 'Completed', priority: 'High', projectType: 'Web Design',
      description: 'Backdrop design with complex charts and real-time data visualization.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-04-26'), createdAt: new Date('2026-04-10'),
      tagType: 'Regular',
    },
    {
      title: 'Aether Characters',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Furniture', client: 'GameSpire', product: 'Aether Game',
      status: 'Completed', priority: 'High', projectType: '3D Design',
      description: 'Furniture design and 3D modeling for Aether mobile game.',
      assignedDesignerId: gerva.id, createdById: admin.id,
      deadline: new Date('2026-04-28'), createdAt: new Date('2026-04-14'),
      tagType: 'Regular',
    },
    {
      title: 'EcoTrust Report Layout',
      category: 'Retail Support', subCategory1: 'Meubel', subCategory2: 'Rak Gondola', client: 'EcoTrust', product: 'Annual Report 2025',
      status: 'Completed', priority: 'Medium', projectType: 'Editorial',
      description: '48-page rak gondola design with infographics.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-04-30'), createdAt: new Date('2026-04-18'),
      tagType: 'Custom',
    },
    // ── MAY 2026 (5 requests, all Completed) ────────────────
    {
      title: 'Solara App Redesign',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Decorative', client: 'Solara Energy', product: 'Solara Mobile App',
      status: 'Completed', priority: 'Medium', projectType: 'Mobile Design',
      description: 'Decorative design for Solara home energy management.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-05-20'), createdAt: new Date('2026-05-02'),
      tagType: 'Regular',
    },
    {
      title: 'Velocity Logo Set',
      category: 'Architecture', subCategory1: 'Exterior', subCategory2: 'Fasad', client: 'Swift Media', product: 'Logo Package',
      status: 'Completed', priority: 'Low', projectType: 'Branding',
      description: 'Fasad logo and variations for Swift Media podcast network.',
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-05-22'), createdAt: new Date('2026-05-06'),
      tagType: 'Regular',
    },
    {
      title: 'Apex Mobile App UI',
      category: 'Retail Support', subCategory1: 'Advertising', subCategory2: 'Lisplang', client: 'Apex Tech', product: 'Apex App',
      status: 'Completed', priority: 'High', projectType: 'Mobile Design',
      description: 'Full UI design for Apex fintech mobile application — lisplang.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-05-25'), createdAt: new Date('2026-05-09'),
      tagType: 'Regular',
    },
    {
      title: 'Cyber Week Campaign',
      category: 'Retail Support', subCategory1: 'Meubel', subCategory2: 'Rak Gudang', client: 'TechMart', product: 'Campaign 2026',
      status: 'Completed', priority: 'Urgent', projectType: 'Marketing',
      description: 'Full Cyber Week digital campaign — rak gudang, email, social.',
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-05-27'), createdAt: new Date('2026-05-13'),
      tagType: 'Regular',
    },
    {
      title: 'Orion Brand Refresh',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Ceiling', client: 'Orion Audio', product: 'Brand Refresh',
      status: 'Completed', priority: 'Medium', projectType: 'Branding',
      description: 'Ceiling brand refresh for Orion Audio — updated logo and visual language.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-05-30'), createdAt: new Date('2026-05-17'),
      tagType: 'Custom',
    },
    // ── JUNE 2026 (5 requests, all Completed) ───────────────
    {
      title: 'Flux Dashboard v2',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Backdrop', client: 'Flux Systems', product: 'Flux Dashboard',
      status: 'Completed', priority: 'High', projectType: 'Web Design',
      description: 'Version 2 redesign of Flux admin dashboard with new design system — backdrop.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-06-20'), createdAt: new Date('2026-06-03'),
      tagType: 'Regular',
    },
    {
      title: 'Pulse Motion Graphics',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Partition', client: 'Pulse Media', product: 'Promo Video Assets',
      status: 'Completed', priority: 'High', projectType: '3D Design',
      description: 'Partition designs for Pulse Media shows.',
      assignedDesignerId: gerva.id, createdById: admin.id,
      deadline: new Date('2026-06-22'), createdAt: new Date('2026-06-07'),
      tagType: 'Regular',
    },
    {
      title: 'GreenLeaf Packaging',
      category: 'Architecture', subCategory1: 'Exterior', subCategory2: 'Secondary Skin', client: 'GreenLeaf Co', product: 'Organic Product Line',
      status: 'Completed', priority: 'Medium', projectType: 'Packaging',
      description: 'Eco-friendly secondary skin packaging design for organic product line.',
      assignedDesignerId: gerva.id, createdById: admin.id,
      deadline: new Date('2026-06-24'), createdAt: new Date('2026-06-10'),
      tagType: 'Regular',
    },
    {
      title: 'Spark Social Kit',
      category: 'Retail Support', subCategory1: 'Advertising', subCategory2: 'Polesign', client: 'Spark Agency', product: 'Social Media Kit',
      status: 'Completed', priority: 'Medium', projectType: 'Marketing',
      description: 'Complete polesign social media template kit for Spark Agency clients.',
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-06-26'), createdAt: new Date('2026-06-14'),
      tagType: 'Regular',
    },
    {
      title: 'Terra Web Redesign',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Furniture', client: 'Terra Corp', product: 'Corporate Website',
      status: 'Completed', priority: 'High', projectType: 'Web Design',
      description: 'Furniture corporate website redesign for Terra Corp.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-06-28'), createdAt: new Date('2026-06-18'),
      tagType: 'Custom',
    },
    // ── JULY 2026 (5 requests, mix Completed/active) ────────
    {
      title: 'Mosaic Brand Identity',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Decorative', client: 'Mosaic Studio', product: 'Brand Identity',
      status: 'Completed', priority: 'High', projectType: 'Branding',
      description: 'Decorative brand identity for Mosaic creative studio.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-07-18'), createdAt: new Date('2026-07-02'),
      tagType: 'Regular',
    },
    {
      title: 'Zeta App Onboarding',
      category: 'Architecture', subCategory1: 'Exterior', subCategory2: 'Fasad', client: 'Zeta Labs', product: 'Zeta App',
      status: 'Completed', priority: 'Medium', projectType: 'Mobile Design',
      description: 'Fasad onboarding flow redesign for Zeta productivity app.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-07-20'), createdAt: new Date('2026-07-05'),
      tagType: 'Regular',
    },
    {
      title: 'Nova Campaign 2026',
      category: 'Retail Support', subCategory1: 'Meubel', subCategory2: 'Meja Kasir', client: 'Nova Brands', product: 'Summer Campaign',
      status: 'Completed', priority: 'Urgent', projectType: 'Marketing',
      description: 'Summer campaign assets — meja kasir, social, landing page.',
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-07-22'), createdAt: new Date('2026-07-09'),
      tagType: 'Regular',
    },
    {
      title: 'Lumina Web Portal',
      category: 'Retail Support', subCategory1: 'Advertising', subCategory2: 'Shopsign', client: 'Glow Inc.', product: 'Customer Portal',
      status: 'Accepted', priority: 'Medium', projectType: 'Web Design',
      description: 'Customer self-service portal for Glow Inc. — shopsign.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-08-15'), createdAt: new Date('2026-07-14'),
      tagType: 'Regular',
    },
    {
      title: 'Neon Branding',
      category: 'Retail Support', subCategory1: 'Meubel', subCategory2: 'Rak Gondola', client: 'Cyberdyne Systems', product: 'Corporate Rebrand',
      status: 'On Revision', priority: 'High', projectType: 'Branding',
      description: 'Corporate rebrand for Cyberdyne Systems — rak gondola.',
      assignedDesignerId: gerva.id, createdById: admin.id,
      deadline: new Date('2026-09-01'), createdAt: new Date('2026-07-18'),
      tagType: 'Regular',
    },
    // ── AUGUST 2026 (5 requests, mostly active) ─────────────
    {
      title: 'Astra Mobile App',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Ceiling', client: 'SpaceX Solutions', product: 'Astra App',
      status: 'In Progress', priority: 'High', projectType: 'Mobile Design',
      description: 'Mobile app for SpaceX ground operations — ceiling design.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-09-30'), createdAt: new Date('2026-08-04'),
      tagType: 'Regular',
    },
    {
      title: 'PROJECT-882: Neo-Genesis Landing Page',
      category: 'Retail Support', subCategory1: 'Meubel', subCategory2: 'Rak Gudang', client: 'Genesis Collective', product: 'Neo-Genesis NFT Platform',
      status: 'In Progress', priority: 'Urgent', projectType: 'Web Design',
      description: "Design a high-conversion landing page for the 'Neo-Genesis' NFT platform — rak gudang.",
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-09-20'), createdAt: new Date('2026-08-08'),
      tagType: 'Regular',
    },
    {
      title: 'Drift Brand Guidelines',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Partition', client: 'Drift Analytics', product: 'Brand Guidelines',
      status: 'In Progress', priority: 'Medium', projectType: 'Branding',
      description: 'Comprehensive partition brand guidelines document for Drift Analytics.',
      assignedDesignerId: baga.id, createdById: admin.id,
      deadline: new Date('2026-09-15'), createdAt: new Date('2026-08-12'),
      tagType: 'Regular',
    },
    {
      title: 'Helios Editorial Design',
      category: 'Architecture', subCategory1: 'Interior', subCategory2: 'Furniture', client: 'Helios Media', product: 'Magazine Layout',
      status: 'In Progress', priority: 'High', projectType: 'Editorial',
      description: 'Furniture magazine layout design for Helios quarterly publication.',
      assignedDesignerId: fahmi.id, createdById: admin.id,
      deadline: new Date('2026-09-10'), createdAt: new Date('2026-08-16'),
      tagType: 'Regular',
    },
    {
      title: 'Vortex 3D Assets',
      category: 'Retail Support', subCategory1: 'Advertising', subCategory2: 'Lisplang', client: 'Vortex Games', product: 'Game Assets',
      status: 'In Progress', priority: 'High', projectType: '3D Design',
      description: 'Lisplang 3D environment assets and character rigs for Vortex game.',
      assignedDesignerId: gerva.id, createdById: admin.id,
      deadline: new Date('2026-10-01'), createdAt: new Date('2026-08-20'),
      tagType: 'Custom',
    },
    // ── AWAITING ASSIGNMENT (Pending, no designer) ────────────
    {
      title: 'Aurora Rebrand Pitch',
      category: 'Architecture', subCategory1: 'Exterior', subCategory2: 'Fasad', client: 'Aurora Group', product: 'Brand Refresh',
      status: 'Pending', priority: 'Medium', projectType: 'Branding',
      description: 'Awaiting designer assignment — fasad rebrand proposal for Aurora Group.',
      createdById: admin.id,
      deadline: new Date('2026-09-25'), createdAt: new Date('2026-08-22'),
      tagType: 'Regular',
    },
    // ── PENDING DENGAN DESIGNER (assigned tapi belum dimulai) ──
    {
      title: 'Cobalt Social Campaign',
      category: 'Retail Support', subCategory1: 'Advertising', subCategory2: 'Shopsign', client: 'Cobalt Labs', product: 'Campaign Assets',
      status: 'Pending', priority: 'High', projectType: 'Marketing',
      description: 'Shopsign social media kit — assigned, awaiting start.',
      assignedDesignerId: bahar.id, createdById: admin.id,
      deadline: new Date('2026-09-28'), createdAt: new Date('2026-08-24'),
      tagType: 'Regular',
    },
  ]

  const createdRequests = []

  // Generate 30 random dates dalam Mar–Aug 2026, sorted
  const rangeStart = new Date('2026-03-01').getTime()
  const rangeEnd   = new Date('2026-08-25').getTime()
  const randomDates = Array.from({ length: requests.length }, () =>
    new Date(rangeStart + Math.random() * (rangeEnd - rangeStart))
  ).sort((a, b) => a - b)

  // Backfill milestone timestamps berdasarkan status final:
  // Pending        → hanya createdAt
  // In Progress    → startedAt = createdAt + beberapa hari
  // Accepted       → startedAt, acceptedAt
  // On Revision    → startedAt, acceptedAt, onRevisionAt
  // Completed      → startedAt, acceptedAt, onRevisionAt, completedAt
  const backfillTimeline = (status, createdAt) => {
    const d = new Date(createdAt.getTime())
    const offsetDays = (days) => new Date(d.getTime() + days * 86400000)

    switch (status) {
      case 'In Progress':
        return { startedAt: offsetDays(2) }
      case 'Accepted':
        return { startedAt: offsetDays(2), acceptedAt: offsetDays(6) }
      case 'On Revision':
        return { startedAt: offsetDays(2), acceptedAt: offsetDays(6), onRevisionAt: offsetDays(9) }
      case 'Completed':
        return {
          startedAt: offsetDays(2),
          acceptedAt: offsetDays(6),
          onRevisionAt: offsetDays(9),
          completedAt: offsetDays(12),
        }
      default:
        return {}
    }
  }

  for (let idx = 0; idx < requests.length; idx++) {
    const { createdAt: _ignored, ...data } = requests[idx]

    const created = await prisma.designRequest.create({
      data: {
        ...data,
        createdAt: randomDates[idx],
        // Backfill milestone timestamps berdasarkan status + created date
        ...backfillTimeline(data.status, randomDates[idx]),
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
      requestIndex: 26, // PROJECT-882 Neo-Genesis
      name: 'landing-reference-1.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
      mimeType: 'image/png',
    },
    {
      requestIndex: 26,
      name: 'landing-reference-2.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxICXbNpxAqFhlVsSScnevdTYK6CtHvpKHFEC8rDXsY6NZqrHZ8LUWtDqwSUW2MCoJ2VmwNUHj8QDoNmz1m4jm1S_E7S4Q8Ayt91PLCmzIqXsMlfEQLBziPNG79jo0fFkaCsFN-ViorE83osVivMoo0BW0U6PgPmwEmVulm7c9mnZaQMAjhOZNb4f51msiKhgnkdS1IZoW25O1tFkHSu2SjD6nZ4nBFkz71XgGVH6WQCvW0yRlT81x8w',
      mimeType: 'image/png',
    },
    // ── Reference untuk request terbaru (archive page 1) ─────
    {
      requestIndex: 31, // Cobalt Social Campaign (Pending)
      name: 'cobalt-shopsign-mockup.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
      mimeType: 'image/png',
    },
    {
      requestIndex: 30, // Aurora Rebrand Pitch (Pending)
      name: 'aurora-fasad-ref.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxICXbNpxAqFhlVsSScnevdTYK6CtHvpKHFEC8rDXsY6NZqrHZ8LUWtDqwSUW2MCoJ2VmwNUHj8QDoNmz1m4jm1S_E7S4Q8Ayt91PLCmzIqXsMlfEQLBziPNG79jo0fFkaCsFN-ViorE83osVivMoo0BW0U6PgPmwEmVulm7c9mnZaQMAjhOZNb4f51msiKhgnkdS1IZoW25O1tFkHSu2SjD6nZ4nBFkz71XgGVH6WQCvW0yRlT81x8w',
      mimeType: 'image/png',
    },
    {
      requestIndex: 29, // Vortex 3D Assets (In Progress)
      name: 'vortex-3d-ref.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgtJ9L1KOEyiACigTi1qVOBDQq__Qfv3NmMLKPxOsukjMEYPyRyBm6lKuBYfblJs6kLcPrDgp3mfhmAty3QNw3EfJ1BMzJsIgZ9d6NG2QrOyQom_i5VTBxGd_Ly5V6pngRajXHJU4i96TpFjuy1OyA0H-VqvzqbsbtzhS2bZbaXWXMF2em6Uxvdw0pDumXxVFXZpWzW_Sd4V_BvH5aSVi3MdMUW5eR-OgS9rC13YKaNEBtdlfbD7cRYQ',
      mimeType: 'image/png',
    },
    {
      requestIndex: 28, // Helios Editorial Design (In Progress)
      name: 'helios-layout-ref.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
      mimeType: 'image/png',
    },
    {
      requestIndex: 27, // Drift Brand Guidelines (In Progress)
      name: 'drift-guidelines-ref.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxICXbNpxAqFhlVsSScnevdTYK6CtHvpKHFEC8rDXsY6NZqrHZ8LUWtDqwSUW2MCoJ2VmwNUHj8QDoNmz1m4jm1S_E7S4Q8Ayt91PLCmzIqXsMlfEQLBziPNG79jo0fFkaCsFN-ViorE83osVivMoo0BW0U6PgPmwEmVulm7c9mnZaQMAjhOZNb4f51msiKhgnkdS1IZoW25O1tFkHSu2SjD6nZ4nBFkz71XgGVH6WQCvW0yRlT81x8w',
      mimeType: 'image/png',
    },
    {
      requestIndex: 25, // Astra Mobile App (In Progress)
      name: 'astra-app-ref.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
      mimeType: 'image/png',
    },
    {
      requestIndex: 24, // Neon Branding (On Revision)
      name: 'neon-brand-ref.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgtJ9L1KOEyiACigTi1qVOBDQq__Qfv3NmMLKPxOsukjMEYPyRyBm6lKuBYfblJs6kLcPrDgp3mfhmAty3QNw3EfJ1BMzJsIgZ9d6NG2QrOyQom_i5VTBxGd_Ly5V6pngRajXHJU4i96TpFjuy1OyA0H-VqvzqbsbtzhS2bZbaXWXMF2em6Uxvdw0pDumXxVFXZpWzW_Sd4V_BvH5aSVi3MdMUW5eR-OgS9rC13YKaNEBtdlfbD7cRYQ',
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
        type: 'reference',
        requestId: request.id,
      },
    })
  }
  console.log(`✅ ${referenceFiles.length} reference files created`)

  // ── Designer files (hasil pekerjaan designer) ────────────────
  const designerFiles = [
    {
      requestIndex: 25, // Astra Mobile App (In Progress)
      name: 'astra-ios-v1.fig',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
      mimeType: 'application/octet-stream',
    },
    {
      requestIndex: 25,
      name: 'astra-onboarding.png',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxICXbNpxAqFhlVsSScnevdTYK6CtHvpKHFEC8rDXsY6NZqrHZ8LUWtDqwSUW2MCoJ2VmwNUHj8QDoNmz1m4jm1S_E7S4Q8Ayt91PLCmzIqXsMlfEQLBziPNG79jo0fFkaCsFN-ViorE83osVivMoo0BW0U6PgPmwEmVulm7c9mnZaQMAjhOZNb4f51msiKhgnkdS1IZoW25O1tFkHSu2SjD6nZ4nBFkz71XgGVH6WQCvW0yRlT81x8w',
      mimeType: 'image/png',
    },
    {
      requestIndex: 23, // Lumina Web Portal (Accepted)
      name: 'lumina-wireframe.pdf',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgtJ9L1KOEyiACigTi1qVOBDQq__Qfv3NmMLKPxOsukjMEYPyRyBm6lKuBYfblJs6kLcPrDgp3mfhmAty3QNw3EfJ1BMzJsIgZ9d6NG2QrOyQom_i5VTBxGd_Ly5V6pngRajXHJU4i96TpFjuy1OyA0H-VqvzqbsbtzhS2bZbaXWXMF2em6Uxvdw0pDumXxVFXZpWzW_Sd4V_BvH5aSVi3MdMUW5eR-OgS9rC13YKaNEBtdlfbD7cRYQ',
      mimeType: 'application/pdf',
    },
  ]

  for (const f of designerFiles) {
    const request = createdRequests[f.requestIndex]
    if (!request) continue
    await prisma.file.create({
      data: {
        name: f.name,
        url: f.url,
        mimeType: f.mimeType,
        type: 'designer',
        requestId: request.id,
      },
    })
  }
  console.log(`✅ ${designerFiles.length} designer files created`)

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
