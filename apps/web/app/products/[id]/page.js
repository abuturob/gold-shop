"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ProductDetail() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!params?.id) return
    fetch(`http://localhost:5000/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => { setProduct(data.product); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params?.id])

  const handleBuy = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    setBuying(true)
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
        alert('✅ Xarid muvaffaqiyatli!\nTranzaksiya ID: ' + data.transaction.txHash.slice(0, 20) + '...')
        router.push('/products')
      } else {
        alert(data.error || 'Xato yuz berdi')
      }
    } catch (e) {
      alert('Server bilan ulanishda xato')
    }
    setBuying(false)
  }

  return (
    <main style={{ background: '#080808', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .buy-btn {
          width: 100%;
          background: linear-gradient(135deg, #A07830, #C9A84C, #E8C96A);
          color: #000; border: none; padding: 18px;
          font-family: 'Montserrat', sans-serif; font-size: 0.8rem;
          font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
        }
        .buy-btn:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201,168,76,0.3); }
        .buy-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .back-btn {
          background: none; border: 1px solid #1a1a1a; color: #555;
          padding: 8px 20px; cursor: pointer;
          font-family: 'Montserrat', sans-serif; font-size: 0.7rem;
          letter-spacing: 1px; transition: all 0.3s;
        }
        .back-btn:hover { border-color: #C9A84C; color: #C9A84C; }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: scrolled ? 'rgba(8,8,8,0.98)' : 'rgba(8,8,8,0.8)',
        borderBottom: '1px solid #111', padding: '0 60px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)',
        transition: 'all 0.4s'
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" style={{ width: '44px', height: '44px', objectFit: 'contain' }} alt="logo" />
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '4px' }}>GOLD SHOP</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.55rem', letterSpacing: '3px' }}>PREMIUM MARKETPLACE</div>
          </div>
        </a>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button className="back-btn" onClick={() => router.push('/products')}>← Katalog</button>
        </div>
      </nav>

      {loading ? (
        <div style={{ padding: '120px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.3 }}>♦</div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '16px' }}>YUKLANMOQDA...</p>
        </div>
      ) : !product ? (
        <div style={{ padding: '120px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '2rem' }}>Mahsulot topilmadi</p>
        </div>
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px' }}>
          
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
            <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem', letterSpacing: '3px' }}>
              KATALOG / {product.metalType === 'GOLD' ? 'OLTIN' : product.metalType === 'SILVER' ? 'KUMUSH' : 'PLATINA'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            
            {/* LEFT - Image */}
            <div>
              <div style={{
                background: 'radial-gradient(ellipse at center, #1e1800 0%, #0f0d08 70%)',
                height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', border: '1px solid #1a1a1a'
              }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.title} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 0 60px rgba(201,168,76,0.4))' }}>
                      {product.metalType === 'GOLD' ? '💍' : product.metalType === 'SILVER' ? '🥈' : '💎'}
                    </div>
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: '20px', left: '20px',
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
                  color: '#C9A84C', padding: '6px 16px',
                  fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '2px'
                }}>
                  {product.metalType === 'GOLD' ? 'OLTIN' : product.metalType === 'SILVER' ? 'KUMUSH' : 'PLATINA'}
                </div>

                {/* Corner decorations */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderTop: '1px solid #C9A84C', borderRight: '1px solid #C9A84C' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '16px', height: '16px', borderBottom: '1px solid #C9A84C', borderLeft: '1px solid #C9A84C' }} />
              </div>

              {/* Specs below image */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#111', marginTop: '1px' }}>
                {[
                  { label: 'OG\'IRLIK', value: product.weightGram + 'g' },
                  { label: 'PROBA', value: product.purity },
                  { label: 'HOLAT', value: product.status === 'ACTIVE' ? 'MAVJUD' : 'SOTILGAN' },
                ].map((spec, i) => (
                  <div key={i} style={{ background: '#0f0f0f', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.6rem', letterSpacing: '2px', marginBottom: '8px' }}>{spec.label}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1.2rem' }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - Info */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <h1 style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: '#F5F0E8', fontSize: '3rem',
                fontWeight: '300', lineHeight: '1.1', marginBottom: '32px'
              }}>{product.title}</h1>

              {product.seller && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '40px', padding: '16px 20px',
                  background: '#0f0f0f', border: '1px solid #1a1a1a'
                }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1.2rem'
                  }}>♦</div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.6rem', letterSpacing: '2px', marginBottom: '4px' }}>SOTUVCHI</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1rem' }}>{product.seller.shopName}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#22c55e', fontSize: '0.65rem' }}>SERTIFIKATLANGAN</span>
                  </div>
                </div>
              )}

              {/* Price */}
              <div style={{ marginBottom: '40px', padding: '32px', background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '12px' }}>NARX</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', fontWeight: '300', lineHeight: 1 }}>
                  {Number(product.priceUzs).toLocaleString()}
                  <span style={{ fontSize: '1rem', color: '#555', marginLeft: '8px' }}>so'm</span>
                </div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.75rem', marginTop: '8px' }}>
                  ≈ {(Number(product.priceUzs) / 12800).toFixed(0)} USD
                </div>
                {product.weightGram && (
                  <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', marginTop: '4px' }}>
                    1 gramm = {Math.round(Number(product.priceUzs) / product.weightGram).toLocaleString()} so'm
                  </div>
                )}
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                {[
                  { icon: '🔐', text: 'SHA-256 kriptografik tranzaksiya' },
                  { icon: '🏛️', text: 'Davlat nazorati ostida' },
                  { icon: '🚚', text: 'Xavfsiz yetkazib berish' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.75rem' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <button className="buy-btn" onClick={handleBuy} disabled={buying || product.status !== 'ACTIVE'}>
                {buying ? 'Xarid qilinmoqda...' : product.status !== 'ACTIVE' ? 'Sotilgan' : '✦ Xarid Qilish'}
              </button>

              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#222', fontSize: '0.7rem', textAlign: 'center', marginTop: '16px' }}>
                Xavfsiz to'lov · Click · Payme · UzCard
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: '#080808', padding: '40px 60px', borderTop: '1px solid #111', marginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" style={{ width: '32px', height: '32px', objectFit: 'contain' }} alt="logo" />
            <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1rem', letterSpacing: '3px' }}>GOLD SHOP</span>
          </div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem' }}>© 2026 Gold Shop</p>
        </div>
      </footer>
    </main>
  )
}   