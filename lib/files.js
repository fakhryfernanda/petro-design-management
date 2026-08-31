export const ALLOWED_TYPES = [
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
  'text/plain', 'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip', 'application/x-zip-compressed',
]

export const MAX_SIZE = 50 * 1024 * 1024 // 50MB

export function isFileAllowed(type) {
  return ALLOWED_TYPES.includes(type)
}

export function isFileTooLarge(size) {
  return size > MAX_SIZE
}
