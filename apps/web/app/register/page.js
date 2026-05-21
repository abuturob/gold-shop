"use client"
import { useState } from 'react'

export default function Register() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('BUYER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, role })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
      } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/'
      }
    } catch (err) {
      setError('Server bilan ulanishda xato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#111', border: '1px solid #D4AF37', borderRadius: '12px', padding: '48px', width: '100%', maxWidth: '400px'}}>
        <div>
  <img 
    src="/logo.png" 
    style={{
      width: '180px', 
      height: '120px', 
      objectFit: 'contain',
      display: 'block',        // Block qilib qo'yamiz
      margin: '0 auto 15px'    // Tepa-past 0, chap-o'ng auto = markaz, pastdan 15px joy
    }} 
    alt="Gold Shop Logo" 
  />
  
  <h1 style={{
    color: '#D4AF37', 
    fontSize: '1.5rem', 
    fontWeight: '800', 
    letterSpacing: '2px',
    textAlign: 'center',      // Matnni ham markazga
    margin: '0 0 5px 0'
  }}>
    GOLD SHOP
  </h1>
  
  <p style={{
    color: '#666', 
    fontSize: '0.9rem',
    textAlign: 'center',
    margin: 0
  }}>
    Yangi hisob yarating
  </p>
</div>
        {error && (
          <div style={{background: '#2d1a1a', border: '1px solid #ff4444', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#ff6666', fontSize: '0.9rem'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{marginBottom: '20px'}}>
            <label style={{color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '8px'}}>Telefon raqam</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+998901234567"
              style={{width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '8px'}}>Parol</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '32px'}}>
            <label style={{color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '8px'}}>Men kim sifatida ro'yxatdan o'taman?</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                style={{flex: 1, padding: '12px', borderRadius: '8px', border: role === 'BUYER' ? '2px solid #D4AF37' : '1px solid #333', background: role === 'BUYER' ? '#1a1500' : '#1a1a1a', color: role === 'BUYER' ? '#D4AF37' : '#666', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600'}}
              >
                🛒 Xaridor
              </button>
              <button
                type="button"
                onClick={() => setRole('SELLER')}
                style={{flex: 1, padding: '12px', borderRadius: '8px', border: role === 'SELLER' ? '2px solid #D4AF37' : '1px solid #333', background: role === 'SELLER' ? '#1a1500' : '#1a1a1a', color: role === 'SELLER' ? '#D4AF37' : '#666', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600'}}
              >
                🏪 Sotuvchi
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{width: '100%', background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer'}}
          >
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <p style={{color: '#666', textAlign: 'center', marginTop: '24px', fontSize: '0.9rem'}}>
          Hisobingiz bormi? <a href="/login" style={{color: '#D4AF37', textDecoration: 'none'}}>Kiring</a>
        </p>
      </div>
    </main>
  )
}