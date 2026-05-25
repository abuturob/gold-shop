"use client"
import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [scrolled, setScrolled] = useState(false)
  const [buying, setBuying] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleBuy = async (product) => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    // confirm olib tashlandi
    setBuying(product.id)
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      })
      const data = await res.json()
      if (res.ok) {
        alert('✅ Xarid muvaffaqiyatli! Tranzaksiya ID: ' + data.transaction.txHash.slice(0, 16) + '...')
        setProducts(products.filter(p => p.id !== product.id))
      } else {
        alert(data.error || 'Xato yuz berdi')
      }
    } catch (e) {
      alert('Server bilan ulanishda xato')
    }
    setBuying(null)
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data.products || []); setLoading(false) })
      .catch(() => setLoading(false))
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filtered = filter === 'ALL' ? products : products.filter(p => p.metalType === filter)

  return (
    <main style={{background: '#080808', minHeight: '100vh', fontFamily: 'Georgia, serif'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .nav-link { color: #999; text-decoration: none; font-family: 'Montserrat', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; transition: color 0.3s; }
        .nav-link:hover { color: #C9A84C; }
        .nav-link.active { color: #C9A84C; border-bottom: 1px solid #C9A84C; padding-bottom: 2px; }
        .product-card { background: #0f0f0f; border: 1px solid #1a1a1a; transition: all 0.4s; position: relative; overflow: hidden; cursor: pointer; }
        .product-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(201,168,76,0.03), transparent); opacity: 0; transition: opacity 0.4s; }
        .product-card:hover { border-color: #2a2200; transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .product-card:hover::before { opacity: 1; }
        .filter-btn { background: none; border: 1px solid #1a1a1a; color: #555; padding: 10px 28px; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
        .filter-btn:hover { border-color: #C9A84C; color: #C9A84C; }
        .filter-btn.active { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.05); }
        .buy-btn { background: linear-gradient(135deg, #A07830, #C9A84C); color: #000; border: none; padding: 12px 24px; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; width: 100%; }
        .buy-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 60px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.95)' : 'rgba(8,8,8,0.8)',
        borderBottom: '1px solid #111',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s'
      }}>
        <a href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px'}}>
          <img src="/logo.png" style={{width: '44px', height: '44px', objectFit: 'contain'}} alt="logo" />
          <div>
            <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '4px'}}>GOLD SHOP</div>
            <div style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.55rem', letterSpacing: '3px'}}>PREMIUM MARKETPLACE</div>
          </div>
        </a>
        <div style={{display: 'flex', gap: '48px', alignItems: 'center'}}>
          <a href="/products" className="nav-link active">Mahsulotlar</a>
          <a href="/sellers" className="nav-link">Sotuvchilar</a>
          <a href="/login" className="nav-link">Kirish</a>
          <a href="/register" style={{
            background: 'linear-gradient(135deg, #A07830, #C9A84C)',
            color: '#000', padding: '10px 28px',
            fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem',
            fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'all 0.3s'
          }}>Boshlash</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        paddingTop: '160px', paddingBottom: '80px',
        paddingLeft: '60px', paddingRight: '60px',
        borderBottom: '1px solid #111',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
            <div style={{width: '60px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)'}} />
            <span style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase'}}>Katalog</span>
          </div>
          <h1 style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '4rem', fontWeight: '300', marginBottom: '16px'}}>
            Oltin <em style={{fontStyle: 'italic', color: '#C9A84C'}}>Mahsulotlar</em>
          </h1>
          <p style={{fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.85rem', fontWeight: '300', lineHeight: '1.8', maxWidth: '500px'}}>
            Sertifikatlangan sotuvchilardan premium oltin va zargarlik buyumlari. Har bir mahsulot autentifikatsiya qilingan.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section style={{padding: '40px 60px', borderBottom: '1px solid #111', marginTop: '80px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center'}}>
          <span style={{fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '2px', marginRight: '8px'}}>FILTER:</span>
          {[
            {val: 'ALL', label: 'Barchasi'},
            {val: 'GOLD', label: 'Oltin'},
            {val: 'SILVER', label: 'Kumush'},
            {val: 'PLATINUM', label: 'Platina'},
          ].map(f => (
            <button key={f.val} className={`filter-btn ${filter === f.val ? 'active' : ''}`}
              onClick={() => setFilter(f.val)}>{f.label}</button>
          ))}
          <div style={{marginLeft: 'auto', fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem'}}>
            {filtered.length} ta mahsulot
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{padding: '60px', minHeight: '60vh'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          {loading ? (
            <div style={{textAlign: 'center', padding: '120px 0'}}>
              <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', fontWeight: '300', opacity: 0.4}}>♦</div>
              <p style={{fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.8rem', letterSpacing: '2px', marginTop: '16px'}}>YUKLANMOQDA...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '120px 0'}}>
              <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '5rem', fontWeight: '300', opacity: 0.2}}>♦</div>
              <h3 style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '2rem', fontWeight: '300', marginTop: '24px'}}>Mahsulotlar yo'q</h3>
              <p style={{fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.8rem', marginTop: '12px'}}>Sotuvchilar tez orada mahsulot qo'shishadi</p>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#111'}}>
              {filtered.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Image area */}
                  <div style={{
                    height: '280px',
                    background: 'radial-gradient(ellipse at center, #1e1800 0%, #0f0d08 70%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{
                      fontSize: '5rem',
                      filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.4))',
                      transition: 'transform 0.4s'
                    }}>
                      {product.metalType === 'GOLD' ? '💍' : product.metalType === 'SILVER' ? '🥈' : '💎'}
                    </div>
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      color: '#C9A84C',
                      padding: '4px 12px',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.6rem', fontWeight: '700', letterSpacing: '2px'
                    }}>
                      {product.metalType === 'GOLD' ? 'OLTIN' : product.metalType === 'SILVER' ? 'KUMUSH' : 'PLATINA'}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{padding: '28px'}}>
                    <h3 style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      color: '#F5F0E8', fontSize: '1.4rem',
                      fontWeight: '400', marginBottom: '12px'
                    }}>{product.title}</h3>

                    <div style={{display: 'flex', gap: '16px', marginBottom: '20px'}}>
                      <div style={{
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#444', fontSize: '0.7rem', letterSpacing: '1px'
                      }}>
                        <span style={{color: '#333', display: 'block', marginBottom: '2px'}}>OG'IRLIK</span>
                        <span style={{color: '#888'}}>{product.weightGram}g</span>
                      </div>
                      <div style={{width: '1px', background: '#1a1a1a'}} />
                      <div style={{
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#444', fontSize: '0.7rem', letterSpacing: '1px'
                      }}>
                        <span style={{color: '#333', display: 'block', marginBottom: '2px'}}>PROBA</span>
                        <span style={{color: '#888'}}>{product.purity}</span>
                      </div>
                      {product.seller && (
                        <>
                          <div style={{width: '1px', background: '#1a1a1a'}} />
                          <div style={{
                            fontFamily: 'Montserrat, sans-serif',
                            color: '#444', fontSize: '0.7rem', letterSpacing: '1px'
                          }}>
                            <span style={{color: '#333', display: 'block', marginBottom: '2px'}}>SOTUVCHI</span>
                            <span style={{color: '#888'}}>{product.seller.shopName}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{borderTop: '1px solid #1a1a1a', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                      <div>
                        <div style={{fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.6rem', letterSpacing: '1px', marginBottom: '4px'}}>NARX</div>
                        <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1.6rem', fontWeight: '400'}}>
                          {Number(product.priceUzs).toLocaleString()} <span style={{fontSize: '0.9rem', color: '#888'}}>so'm</span>
                        </div>
                      </div>
                    </div>

                    <button 
  className="buy-btn" 
  onClick={(e) => { e.stopPropagation(); handleBuy(product); }}
  disabled={buying === product.id}
  style={{
    opacity: buying === product.id ? 0.6 : 1,
    position: 'relative',
    zIndex: 10,
    pointerEvents: 'all'
  }}
>
  {buying === product.id ? 'Xarid qilinmoqda...' : 'Xarid Qilish'}
</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background: '#080808', padding: '60px', borderTop: '1px solid #111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <img src="/logo.png" style={{width: '32px', height: '32px', objectFit: 'contain'}} alt="logo" />
            <span style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1rem', letterSpacing: '3px'}}>GOLD SHOP</span>
          </div>
          <p style={{fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem'}}>© 2026 Gold Shop. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </main>
  )
}