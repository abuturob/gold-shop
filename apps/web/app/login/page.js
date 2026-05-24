"use client"
import { useState } from 'react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
      } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = data.user.role === 'ADMIN' ? '/admin' : '/'
      }
    } catch (err) {
      setError('Server bilan ulanishda xato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      background: '#080808', minHeight: '100vh',
      display: 'flex', fontFamily: 'Georgia, serif'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .input-field {
          width: 100%;
          background: transparent !important;
          border: none;
          border-bottom: 1px solid #222;
          color-scheme: dark;
          padding: 12px 0;
          color: #F5F0E8;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          outline: none;
          transition: border-color 0.3s;
        }
        .input-field::placeholder { color: #333; }
        .input-field:focus { border-bottom-color: #C9A84C; }
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #A07830, #C9A84C, #E8C96A);
          color: #000;
          border: none;
          padding: 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 40px;
        }
        .login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      {/* LEFT - Decorative */}
      <div style={{
        width: '50%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0800 0%, #1a1500 50%, #0a0800 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(ellipse at 60% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)'
        }} />

        {/* Geometric decorations */}
        <div style={{position: 'absolute', top: '10%', left: '10%', width: '200px', height: '200px', border: '1px solid #1a1500', borderRadius: '50%'}} />
        <div style={{position: 'absolute', bottom: '15%', right: '8%', width: '300px', height: '300px', border: '1px solid #1a1500', borderRadius: '50%'}} />
        <div style={{position: 'absolute', top: '40%', right: '20%', width: '100px', height: '100px', border: '1px solid #2a2000', transform: 'rotate(45deg)'}} />

        <div style={{position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px'}}>
          <div style={{marginBottom: '24px'}}>
            <img src="/logo.png" style={{width: '250px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.4))', marginBottom: '20px', display: 'block', margin: '0 auto 20px'}} alt="logo" />
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F5F0E8', fontSize: '3.5rem',
              fontWeight: '300', lineHeight: '1.1',
            }}>
              Xush<br/>
              <em style={{color: '#C9A84C', fontStyle: 'italic'}}>Kelibsiz</em>
            </h1>
          </div>

          <div style={{width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '0 auto 24px'}} />

          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#555', fontSize: '0.8rem',
            lineHeight: '1.8', fontWeight: '300',
            maxWidth: '300px', margin: '0 auto'
          }}>
            O'zbekistondagi eng ishonchli oltin marketplace ga xush kelibsiz
          </p>

          <div style={{marginTop: '60px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {[
              {icon: '🔐', text: 'SHA-256 kriptografik himoya'},
              {icon: '🏛️', text: 'Davlat nazorati ostida'},
              {icon: '💎', text: 'Sertifikatlangan mahsulotlar'},
            ].map((item, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span style={{fontSize: '1rem'}}>{item.icon}</span>
                <span style={{fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.75rem', letterSpacing: '1px'}}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - Form */}
      <div style={{
        width: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px',
        background: '#080808',
        borderLeft: '1px solid #111'
      }}>
        <div style={{width: '100%', maxWidth: '400px'}}>
          
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            textDecoration: 'none', marginBottom: '60px'
          }}>
            <span style={{fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '2px'}}>← BOSH SAHIFA</span>
          </a>

          <div style={{marginBottom: '48px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
              <div style={{width: '40px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)'}} />
              <span style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '3px'}}>KIRISH</span>
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#F5F0E8', fontSize: '2.5rem',
              fontWeight: '300', lineHeight: '1.1'
            }}>
              Hisobingizga<br/>
              <em style={{fontStyle: 'italic', color: '#C9A84C'}}>Kiring</em>
            </h2>
          </div>

          {error && (
            <div style={{
              border: '1px solid #3a1a1a',
              background: 'rgba(255,68,68,0.05)',
              padding: '14px 18px',
              marginBottom: '32px',
              fontFamily: 'Montserrat, sans-serif',
              color: '#ff6666', fontSize: '0.8rem',
              letterSpacing: '0.5px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{marginBottom: '32px'}}>
              <label style={{
                fontFamily: 'Montserrat, sans-serif',
                color: focused === 'phone' ? '#C9A84C' : '#333',
                fontSize: '0.65rem', letterSpacing: '2px',
                textTransform: 'uppercase', display: 'block', marginBottom: '8px',
                transition: 'color 0.3s'
              }}>Telefon Raqam</label>
              <input
                className="input-field"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused('')}
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div style={{marginBottom: '8px'}}>
              <label style={{
                fontFamily: 'Montserrat, sans-serif',
                color: focused === 'password' ? '#C9A84C' : '#333',
                fontSize: '0.65rem', letterSpacing: '2px',
                textTransform: 'uppercase', display: 'block', marginBottom: '8px',
                transition: 'color 0.3s'
              }}>Parol</label>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>

          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#333', fontSize: '0.75rem',
            textAlign: 'center', marginTop: '32px',
            letterSpacing: '0.5px'
          }}>
            Hisobingiz yo'qmi?{' '}
            <a href="/register" style={{color: '#C9A84C', textDecoration: 'none'}}>
              Ro'yxatdan o'ting
            </a>
          </p>

          <div style={{
            marginTop: '60px', paddingTop: '32px',
            borderTop: '1px solid #111',
            display: 'flex', justifyContent: 'center', gap: '32px'
          }}>
            {['Click', 'Payme', 'UzCard'].map((brand, i) => (
              <span key={i} style={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#222', fontSize: '0.7rem',
                letterSpacing: '1px', fontWeight: '500'
              }}>{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}