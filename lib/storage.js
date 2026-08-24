/**
 * Storage abstraction layer.
 *
 * Prototype: simpan ke local disk (public/uploads/).
 * Production: ganti implementasi uploadFile & deleteFile
 * dengan Google Drive (atau S3, dll) — API route dan client
 * tidak perlu diubah sama sekali.
 */

import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

/**
 * Upload file ke storage.
 * @returns {{ url: string, name: string, mimeType: string, size: number }}
 */
export async function uploadFile({ buffer, originalName, mimeType, requestId }) {
  // Buat subfolder per request
  const dir = path.join(UPLOAD_DIR, String(requestId))
  await mkdir(dir, { recursive: true })

  // Nama unik: timestamp + nama asli (sanitised)
  const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filename = `${Date.now()}_${safe}`
  const filepath = path.join(dir, filename)

  await writeFile(filepath, buffer)

  return {
    url:      `/uploads/${requestId}/${filename}`,
    name:     originalName,
    mimeType: mimeType || 'application/octet-stream',
    size:     buffer.length,
  }
}

/**
 * Hapus file dari storage.
 * url: path relatif, e.g. /uploads/34/1234_file.png
 */
export async function deleteFile({ url }) {
  try {
    const filepath = path.join(process.cwd(), 'public', url)
    await unlink(filepath)
  } catch {
    // File tidak ada — abaikan
  }
}
