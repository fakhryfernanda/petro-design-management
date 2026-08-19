export const metadata = { title: 'Project Details' }

import RequestDetailClient from './RequestDetailClient'

export default async function RequestDetailPage({ params }) {
  const { id } = await params
  return <RequestDetailClient id={id} />
}
