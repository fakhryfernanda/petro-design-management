export const metadata = { title: 'Project Details' }

import RequestDetailClient from './RequestDetailClient'

export default function RequestDetailPage({ params }) {
  return <RequestDetailClient id={params.id} />
}
