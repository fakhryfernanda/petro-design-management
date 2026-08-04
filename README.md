# Petro Design Management System

Design management web app untuk PT Petro Lancar Sakti — mengelola request desain, tracking progress, arsip hasil, dan analitik tim.

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (design tokens Luminous Petro)
- **React Router v7**

## Pages

| Route | Halaman |
|---|---|
| `/login` | Login |
| `/dashboard` | Dashboard utama |
| `/requests/new` | Form request desain baru |
| `/requests/:id` | Detail request |
| `/archive` | Arsip desain selesai |
| `/analytics` | Laporan & analitik |

## Cara run

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Scripts

```bash
npm run dev      # dev server (HMR)
npm run build    # build production ke dist/
npm run preview  # preview build production
npm run lint     # lint dengan oxlint
```
