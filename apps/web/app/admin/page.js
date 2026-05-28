"use client"
import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'

export default function Admin() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sellers')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    fetch('http://localhost:5000/api/sellers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setSellers(data.sellers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const approveSeller = async (sellerId) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5000/api/sellers/${sellerId}/approve`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      setSellers(sellers.map(s => s.id === sellerId ? {...s, status: 'ACTIVE'} : s))
    }
  }

  const stats = [
    { label: 'Jami sotuvchilar', value: sellers.length, icon: '◈', color: '#C9A84C' },
    { label: 'Faol sotuvchilar', value: sellers.filter(s => s.status === 'ACTIVE').length, icon: '◈', color: '#22c55e' },
    { label: 'Kutayotganlar', value: sellers.filter(s => s.status === 'PENDING').length, icon: '◈', color: '#f59e0b' },
    { label: 'Bloklangan', value: sellers.filter(s => s.status === 'SUSPENDED').length, icon: '◈', color: '#ef4444' },
  ]

  const tabs = [
    { id: 'sellers', label: 'Sotuvchilar' },
    { id: 'products', label: 'Mahsulotlar' },
    { id: 'transactions', label: 'Tranzaksiyalar' },
  ]

  return (
    <main style={{ background: '#080808', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .tab-btn {
          padding: 12px 28px;
          background: none;
          border: none;
          border-bottom: 1px solid transparent;
          color: #444;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
        }
        .tab-btn.active {
          color: #C9A84C;
          border-bottom-color: #C9A84C;
        }
        .tab-btn:hover { color: #C9A84C; }
        .approve-btn {
          background: linear-gradient(135deg, #A07830, #C9A84C);
          color: #000;
          border: none;
          padding: 8px 20px;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
        }
        .approve-btn:hover { opacity: 0.9; }
        .stat-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          padding: 28px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 0;
          transition: height 0.3s;
        }
        .stat-card:hover::before { height: 100%; }
        tr { transition: background 0.2s; }
        tr:hover td { background: rgba(201,168,76,0.02); }
      `}</style>

      <Navbar active="admin" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 60px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
            <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '3px' }}>BOSHQARUV PANELI</span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '2.5rem', fontWeight: '300' }}>
            Admin <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Dashboard</em>
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#111', marginBottom: '48px' }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{ '--accent': stat.color }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{stat.label}</span>
                <span style={{ color: stat.color, fontSize: '1rem', opacity: 0.5 }}>{stat.icon}</span>
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', color: stat.color, fontSize: '3rem', fontWeight: '300', lineHeight: 1 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #111', marginBottom: '32px', display: 'flex', gap: '0' }}>
          {tabs.map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sellers Table */}
        {activeTab === 'sellers' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.3rem', fontWeight: '400' }}>
                Sotuvchilar <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Ro'yxati</em>
              </h2>
              <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '1px' }}>
                {sellers.length} ta sotuvchi
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '2rem', opacity: 0.3 }}>♦</div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '12px' }}>YUKLANMOQDA...</p>
              </div>
            ) : sellers.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2 }}>♦</div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.8rem', marginTop: '16px' }}>Sotuvchilar yo'q</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #111' }}>
                    {["Do'kon nomi", 'Telefon', 'Litsenziya', 'Status', 'Amal'].map(h => (
                      <th key={h} style={{
                        padding: '16px 32px', textAlign: 'left',
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#2a2a2a', fontSize: '0.65rem',
                        fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sellers.map(seller => (
                    <tr key={seller.id} style={{ borderBottom: '1px solid #0f0f0f' }}>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1rem', fontWeight: '400' }}>
                          {seller.shopName}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.8rem' }}>
                          {seller.user?.phone}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.75rem', letterSpacing: '1px' }}>
                          {seller.licenseNo}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{
                          padding: '4px 14px',
                          fontSize: '0.65rem',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '600', letterSpacing: '1px',
                          border: '1px solid',
                          borderColor: seller.status === 'ACTIVE' ? '#22c55e33' : seller.status === 'PENDING' ? '#f59e0b33' : '#ef444433',
                          color: seller.status === 'ACTIVE' ? '#22c55e' : seller.status === 'PENDING' ? '#f59e0b' : '#ef4444',
                          background: seller.status === 'ACTIVE' ? 'rgba(34,197,94,0.05)' : seller.status === 'PENDING' ? 'rgba(245,158,11,0.05)' : 'rgba(239,68,68,0.05)',
                        }}>
                          {seller.status === 'ACTIVE' ? 'FAOL' : seller.status === 'PENDING' ? 'KUTMOQDA' : 'BLOKLANGAN'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        {seller.status === 'PENDING' && (
                          <button className="approve-btn" onClick={() => approveSeller(seller.id)}>
                            Tasdiqlash
                          </button>
                        )}
                        {seller.status === 'ACTIVE' && (
                          <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#22c55e', fontSize: '0.7rem', letterSpacing: '1px' }}>✓ TASDIQLANGAN</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '80px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2, marginBottom: '20px' }}>♦</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.5rem', fontWeight: '300', marginBottom: '8px' }}>Mahsulotlar boshqaruvi</h3>
            <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem', letterSpacing: '1px' }}>Tez orada qo'shiladi</p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '80px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2, marginBottom: '20px' }}>♦</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.5rem', fontWeight: '300', marginBottom: '8px' }}>Tranzaksiyalar boshqaruvi</h3>
            <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem', letterSpacing: '1px' }}>Tez orada qo'shiladi</p>
          </div>
        )}
      </div>
    </main>
  )
}