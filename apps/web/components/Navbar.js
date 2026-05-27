"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar({ active }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    router.push('/')
  }

  return (
    <>
      <style>{`
        .nav-link { color: #999; text-decoration: none; font-family: 'Montserrat', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; transition: color 0.3s; position: relative; }
        .nav-link:hover { color: #C9A84C; }
        .nav-link.active { color: #C9A84C; }
        .nav-link.active::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 1px; background: #C9A84C; }
        .nav-btn { background: linear-gradient(135deg, #A07830, #C9A84C); color: #000; padding: '10px 28px'; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; transition: all 0.3s; border: none; cursor: pointer; }
        .nav-btn:hover { opacity: 0.9; }
        .nav-outline-btn { background: none; border: 1px solid #1a1a1a; color: #555; padding: 8px 20px; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; }
        .nav-outline-btn:hover { border-color: #C9A84C; color: #C9A84C; }
      `}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 60px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.98)' : 'rgba(8,8,8,0.85)',
        borderBottom: '1px solid #111',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s'
      }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" style={{ width: '44px', height: '44px', objectFit: 'contain' }} alt="logo" />
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '4px' }}>GOLD SHOP</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.55rem', letterSpacing: '3px' }}>PREMIUM MARKETPLACE</div>
          </div>
        </a>

        {/* Links */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="/products" className={`nav-link ${active === 'products' ? 'active' : ''}`}>Mahsulotlar</a>
          <a href="/sellers" className={`nav-link ${active === 'sellers' ? 'active' : ''}`}>Sotuvchilar</a>

          {user ? (
            <>
              {user.role === 'SELLER' && (
                <a href="/dashboard" className={`nav-link ${active === 'dashboard' ? 'active' : ''}`}>Kabinet</a>
              )}
              {user.role === 'ADMIN' || user.role === 'SUPERADMIN' ? (
                <a href="/admin" className={`nav-link ${active === 'admin' ? 'active' : ''}`}>Admin</a>
              ) : null}
              <a href="/profile" className={`nav-link ${active === 'profile' ? 'active' : ''}`}>
                <span style={{ color: '#C9A84C' }}>♦</span> {user.phone?.slice(-4)}
              </a>
              <button className="nav-outline-btn" onClick={handleLogout}>Chiqish</button>
            </>
          ) : (
            <>
              <a href="/login" className={`nav-link ${active === 'login' ? 'active' : ''}`}>Kirish</a>
              <a href="/register" style={{
                background: 'linear-gradient(135deg, #A07830, #C9A84C)',
                color: '#000', padding: '10px 28px',
                fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem',
                fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
                textDecoration: 'none'
              }}>Boshlash</a>
            </>
          )}
        </div>
      </nav>
    </>
  )
}