"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('transactions')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) { router.push('/login'); return }
    if (userData) setUser(JSON.parse(userData))

    fetch('http://localhost:5000/api/transactions/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setTransactions(data.transactions || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return '#22c55e'
      case 'PAID': return '#C9A84C'
      case 'PENDING': return '#f59e0b'
      case 'DELIVERED': return '#3b82f6'
      case 'REFUNDED': return '#ef4444'
      default: return '#555'
    }
  }

  const statusLabel = (status) => {
    switch(status) {
      case 'COMPLETED': return 'YAKUNLANDI'
      case 'PAID': return "TO'LANDI"
      case 'PENDING': return 'KUTMOQDA'
      case 'DELIVERED': return 'YETKAZILDI'
      case 'REFUNDED': return 'QAYTARILDI'
      default: return status
    }
  }

  return (
    <main style={{ background: '#080808', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .tab-btn { padding: 12px 28px; background: none; border: none; border-bottom: 1px solid transparent; color: #444; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
        .tab-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
        .tab-btn:hover { color: #C9A84C; }
        tr:hover td { background: rgba(201,168,76,0.02); }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid #111',
        padding: '0 60px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)'
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" style={{ width: '44px', height: '44px', objectFit: 'contain' }} alt="logo" />
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '4px' }}>GOLD SHOP</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.55rem', letterSpacing: '3px' }}>XARIDOR KABINETI</div>
          </div>
        </a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.75rem' }}>{user?.phone}</span>
          <button onClick={() => router.push('/products')} style={{
            background: 'linear-gradient(135deg, #A07830, #C9A84C)', color: '#000',
            border: 'none', padding: '10px 24px', cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px'
          }}>Xarid qilish</button>
          <button onClick={() => { localStorage.clear(); router.push('/') }} style={{
            background: 'none', border: '1px solid #1a1a1a', color: '#444',
            padding: '8px 20px', cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', letterSpacing: '1px'
          }}>Chiqish</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px' }}>

        {/* Profile header */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '60px', padding: '40px', background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #1a1500, #2a2200)',
            border: '1px solid rgba(201,168,76,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '2rem'
          }}>♦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.6rem', letterSpacing: '3px', marginBottom: '8px' }}>XARIDOR</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.8rem', fontWeight: '300' }}>{user?.phone}</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.75rem', marginTop: '4px' }}>
              {user?.role === 'BUYER' ? 'Xaridor' : user?.role === 'SELLER' ? 'Sotuvchi' : 'Admin'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#111' }}>
            {[
              { label: 'Jami xaridlar', value: transactions.length },
              { label: 'Yakunlangan', value: transactions.filter(t => t.status === 'COMPLETED' || t.status === 'PAID').length },
              { label: 'Umumiy summa', value: (transactions.reduce((sum, t) => sum + Number(t.amountUzs), 0) / 1000000).toFixed(1) + ' mln' },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#0a0a0a', padding: '20px 28px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1.8rem', fontWeight: '300' }}>{stat.value}</div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.6rem', letterSpacing: '1px', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #111', marginBottom: '32px', display: 'flex' }}>
          {[
            { id: 'transactions', label: 'Xaridlarim' },
            { id: 'favorites', label: 'Sevimlilar' },
            { id: 'settings', label: 'Sozlamalar' },
          ].map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>

        {/* Transactions */}
        {activeTab === 'transactions' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.3rem', fontWeight: '400' }}>
                Mening <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Xaridlarim</em>
              </h2>
              <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem' }}>{transactions.length} ta xarid</span>
            </div>

            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '2rem', opacity: 0.3 }}>♦</div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '12px' }}>YUKLANMOQDA...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2, marginBottom: '20px' }}>♦</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.5rem', fontWeight: '300', marginBottom: '12px' }}>Xaridlar yo'q</h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem', marginBottom: '32px' }}>Hali hech narsa xarid qilmadingiz</p>
                <button onClick={() => router.push('/products')} style={{
                  background: 'linear-gradient(135deg, #A07830, #C9A84C)', color: '#000',
                  border: 'none', padding: '14px 40px', cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px'
                }}>Xarid qilish</button>
              </div>
            ) : (
              <div>
                {transactions.map(tx => (
                  <div key={tx.id} style={{ padding: '24px 32px', borderBottom: '1px solid #0f0f0f', display: 'flex', gap: '24px', alignItems: 'center' }}>
                    {/* Icon */}
                    <div style={{
                      width: '60px', height: '60px', flexShrink: 0,
                      background: 'radial-gradient(ellipse at center, #1e1800, #0f0d08)',
                      border: '1px solid #1a1a1a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem'
                    }}>
                      {tx.product?.metalType === 'GOLD' ? '💍' : '🥈'}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', marginBottom: '4px' }}>
                        {tx.product?.title}
                      </div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.7rem' }}>
                        {tx.seller?.shopName} · {tx.product?.weightGram}g · {tx.product?.purity} proba
                      </div>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1.2rem', marginBottom: '4px' }}>
                        {Number(tx.amountUzs).toLocaleString()} so'm
                      </div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem' }}>
                        {new Date(tx.createdAt).toLocaleDateString('uz-UZ')}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{
                        padding: '4px 14px', fontSize: '0.65rem',
                        fontFamily: 'Montserrat, sans-serif', fontWeight: '600', letterSpacing: '1px',
                        border: `1px solid ${statusColor(tx.status)}33`,
                        color: statusColor(tx.status),
                        background: `${statusColor(tx.status)}10`,
                      }}>
                        {statusLabel(tx.status)}
                      </span>
                    </div>

                    {/* TX Hash */}
                    <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#222', fontSize: '0.65rem', letterSpacing: '1px', minWidth: '100px' }}>
                      {tx.txHash?.slice(0, 10)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '80px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2, marginBottom: '20px' }}>♦</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.5rem', fontWeight: '300', marginBottom: '8px' }}>Sevimlilar</h3>
            <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem' }}>Tez orada qo'shiladi</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '40px' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.3rem', fontWeight: '400', marginBottom: '32px' }}>
              Hisob <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Sozlamalari</em>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
              {[
                { label: 'Telefon raqam', value: user?.phone },
                { label: 'Rol', value: user?.role === 'BUYER' ? 'Xaridor' : 'Sotuvchi' },
                { label: 'ID', value: user?.id?.slice(0, 16) + '...' },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '16px' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem' }}>{item.value}</div>
                </div>
              ))}
              <button onClick={() => { localStorage.clear(); router.push('/') }} style={{
                background: 'none', border: '1px solid #2a1a1a', color: '#ef4444',
                padding: '12px 24px', cursor: 'pointer', marginTop: '16px',
                fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', letterSpacing: '2px',
                textTransform: 'uppercase', transition: 'all 0.3s', width: 'fit-content'
              }}>Hisobdan chiqish</button>
            </div>
          </div>
        )}
      </div>

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