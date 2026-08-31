'use client'

import { useState, useEffect, useRef } from 'react'

export default function LoginClient() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const glow1Ref = useRef(null)
  const glow2Ref = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5
      const y = (e.clientY / window.innerHeight) - 0.5
      if (glow1Ref.current) glow1Ref.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`
      if (glow2Ref.current) glow2Ref.current.style.transform = `translate(${x * 40}px, ${y * 40}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        // Hard navigation agar cookie session terkirim & halaman dimuat penuh
        window.location.href = '/dashboard'
      } else {
        const json = await res.json().catch(() => ({}))
        setError(json.error || 'Login failed')
        setSubmitting(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-background">
      <div ref={glow1Ref} className="ambient-glow floating" style={{ top: '-10%', left: '-10%', transition: 'transform 0.1s ease-out' }} />
      <div ref={glow2Ref} className="ambient-glow floating" style={{ bottom: '-20%', right: '-10%', animationDelay: '-4s', transition: 'transform 0.1s ease-out' }} />

      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#adc6ff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <main className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 p-6 z-10 items-center">
        {/* Left: Branding */}
        <div className="hidden lg:flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>architecture</span>
            </div>
            <h1 className="text-headline-lg font-black tracking-tighter text-on-surface">PETRO DESIGN</h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-headline-xl text-primary leading-tight">
              Manufacture, Architecture and Retail Support Design.
            </h2>
            <p className="text-body-lg text-on-surface-variant">Website management design and archive</p>
            <p className="text-body-lg text-on-surface font-semibold">PT PETRO LANCAR SAKTI</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex justify-center">
          <div className="glass-panel w-full max-w-[480px] p-6 sm:p-8 lg:p-12 rounded-[2rem] shadow-2xl">
            <div className="flex flex-col gap-6">
              <p className="text-on-surface text-headline-md font-black tracking-tighter lg:hidden">PETRO DESIGN</p>
              <div className="flex flex-col gap-2">
                <h3 className="text-on-surface text-[30px] font-bold">Welcome back</h3>
                <p className="text-on-surface-variant text-body-md">Please login to your account to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-on-surface text-label-md font-medium px-1">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">alternate_email</span>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-on-surface text-label-md font-medium">Password</label>
                    <a href="#" className="text-primary text-label-sm hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl py-4 pl-12 pr-12 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1 py-2">
                  <input type="checkbox" id="remember" className="w-5 h-5 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary" />
                  <label htmlFor="remember" className="text-on-surface-variant text-label-md cursor-pointer">Keep me logged in</label>
                </div>

                <button type="submit"
                  disabled={submitting}
                  className="w-full primary-gradient text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group mt-2 shadow-lg disabled:opacity-60">
                  {submitting ? (
                    <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Signing in...</>
                  ) : (<>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </>)}
                </button>

                {error && (
                  <p className="flex items-center gap-xs text-error text-label-sm bg-error/10 border border-error/30 rounded-lg px-sm py-xs">
                    <span className="material-symbols-outlined text-[16px]">error_outline</span>
                    {error}
                  </p>
                )}
              </form>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-outline-variant" />
                <span className="flex-shrink mx-4 text-outline text-label-sm uppercase tracking-widest">or continue with</span>
                <div className="flex-grow border-t border-outline-variant" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant hover:bg-surface-variant transition-colors text-on-surface">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                  </svg>
                  <span className="text-label-md">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant hover:bg-surface-variant transition-colors text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                  <span className="text-label-md">GitHub</span>
                </button>
              </div>

              <p className="text-center text-on-surface-variant text-label-md pt-4">
                Don&apos;t have an account?{' '}
                <a href="#" className="text-primary font-bold hover:underline">Register here</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 w-full text-center text-outline text-label-sm">
        © 2026 PETRO DESIGN SYSTEM. All rights reserved. Built for visionaries.
      </footer>
    </div>
  )
}
