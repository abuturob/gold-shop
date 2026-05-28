"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function Transactions() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

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
      case 'PAID': return 'TO\'LANDI'
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
        tr:hover td { background: rgba(201,168,76,0.02); }
      `}</style>

      <Navbar active="transactions" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px' }}>

        {/* Title */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
            <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '3px' }}>TARIX</span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '2.5rem', fontWeight: '300' }}>
            Tranzaksiyalar <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Tarixi</em>
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#111', marginBottom: '48px' }}>
          {[
            { label: 'Jami xaridlar', value: transactions.length, color: '#C9A84C' },
            { label: 'Yakunlangan', value: transactions.filter(t => t.status === 'COMPLETED' || t.status === 'PAID').length, color: '#22c55e' },
            { label: 'Umumiy summa', value: transactions.reduce((sum, t) => sum + Number(t.amountUzs), 0).toLocaleString() + " so'm", color: '#C9A84C' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#0f0f0f', padding: '28px' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', color: stat.color, fontSize: '2rem', fontWeight: '300' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.3rem', fontWeight: '400' }}>
              Barcha <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Xaridlar</em>
            </h2>
            <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem' }}>
              {transactions.length} ta tranzaksiya
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '2rem', opacity: 0.3 }}>♦</div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '12px' }}>YUKLANMOQDA...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2, marginBottom: '20px' }}>♦</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.5rem', fontWeight: '300', marginBottom: '12px' }}>Tranzaksiyalar yo'q</h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem', marginBottom: '32px' }}>Hali hech narsa xarid qilmadingiz</p>
              <button onClick={() => router.push('/products')} style={{
                background: 'linear-gradient(135deg, #A07830, #C9A84C)', color: '#000',
                border: 'none', padding: '14px 40px', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem',
                fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase'
              }}>Xarid qilish</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #111' }}>
                  {['Mahsulot', 'Sotuvchi', 'Summa', 'Status', 'Sana', 'TX Hash'].map(h => (
                    <th key={h} style={{
                      padding: '16px 24px', textAlign: 'left',
                      fontFamily: 'Montserrat, sans-serif', color: '#2a2a2a',
                      fontSize: '0.65rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #0f0f0f' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1rem' }}>
                        {tx.product?.title || 'Mahsulot'}
                      </div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.65rem', marginTop: '4px' }}>
                        {tx.product?.metalType} · {tx.product?.weightGram}g · {tx.product?.purity}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.8rem' }}>
                        {tx.seller?.shopName}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1.1rem' }}>
                        {Number(tx.amountUzs).toLocaleString()} so'm
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        padding: '4px 12px', fontSize: '0.65rem',
                        fontFamily: 'Montserrat, sans-serif', fontWeight: '600', letterSpacing: '1px',
                        border: `1px solid ${statusColor(tx.status)}33`,
                        color: statusColor(tx.status),
                        background: `${statusColor(tx.status)}10`,
                      }}>
                        {statusLabel(tx.status)}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.75rem' }}>
                        {new Date(tx.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        fontFamily: 'Montserrat, sans-serif', color: '#2a2a2a',
                        fontSize: '0.65rem', letterSpacing: '1px',
                        fontWeight: '500'
                      }}>
                        {tx.txHash?.slice(0, 12)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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