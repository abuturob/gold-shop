"use client"
import { useState, useEffect } from 'react'

export default function Admin() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sellers')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    fetch('http://localhost:5000/api/sellers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSellers(data.sellers || [])
        setLoading(false)
      })
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

  return (
    <main style={{background: '#0a0a0a', minHeight: '100vh'}}>
      {/* Header */}
      <header style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', borderBottom: '1px solid #D4AF37'}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" style={{width: '45px', height: '45px', objectFit: 'contain'}} alt="logo" />
            <div>
              <h1 style={{color: '#D4AF37', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '2px'}}>GOLD SHOP</h1>
              <p style={{color: '#ff4444', fontSize: '0.7rem', letterSpacing: '3px'}}>ADMIN PANEL</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/' }}
            style={{color: '#ff4444', border: '1px solid #ff4444', padding: '8px 20px', borderRadius: '4px', background: 'none', cursor: 'pointer', fontSize: '0.9rem'}}
          >
            Chiqish
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6" style={{marginBottom: '40px'}}>
          {[
            {label: 'Jami sotuvchilar', value: sellers.length, icon: '🏪'},
            {label: 'Faol sotuvchilar', value: sellers.filter(s => s.status === 'ACTIVE').length, icon: '✅'},
            {label: 'Kutayotganlar', value: sellers.filter(s => s.status === 'PENDING').length, icon: '⏳'},
            {label: 'Bloklangan', value: sellers.filter(s => s.status === 'SUSPENDED').length, icon: '🚫'},
          ].map((stat, i) => (
            <div key={i} style={{background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '8px'}}>{stat.icon}</div>
              <p style={{color: '#D4AF37', fontSize: '2rem', fontWeight: '800'}}>{stat.value}</p>
              <p style={{color: '#666', fontSize: '0.85rem'}}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4" style={{marginBottom: '24px'}}>
          {['sellers', 'products', 'transactions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: activeTab === tab ? '1px solid #D4AF37' : '1px solid #333',
                background: activeTab === tab ? '#1a1500' : '#111',
                color: activeTab === tab ? '#D4AF37' : '#666',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {tab === 'sellers' ? '🏪 Sotuvchilar' : tab === 'products' ? '💎 Mahsulotlar' : '💳 Tranzaksiyalar'}
            </button>
          ))}
        </div>

        {/* Sellers Table */}
        {activeTab === 'sellers' && (
          <div style={{background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden'}}>
            <div style={{padding: '20px 24px', borderBottom: '1px solid #222'}}>
              <h2 style={{color: '#fff', fontSize: '1.2rem', fontWeight: '700'}}>Sotuvchilar ro'yxati</h2>
            </div>
            {loading ? (
              <div style={{padding: '40px', textAlign: 'center', color: '#D4AF37'}}>Yuklanmoqda...</div>
            ) : sellers.length === 0 ? (
              <div style={{padding: '40px', textAlign: 'center', color: '#666'}}>Sotuvchilar yo'q</div>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '1px solid #222'}}>
                    {['Do\'kon nomi', 'Telefon', 'Litsenziya', 'Status', 'Amal'].map(h => (
                      <th key={h} style={{padding: '16px 24px', color: '#666', fontSize: '0.85rem', textAlign: 'left', fontWeight: '600'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sellers.map(seller => (
                    <tr key={seller.id} style={{borderBottom: '1px solid #1a1a1a'}}>
                      <td style={{padding: '16px 24px', color: '#fff', fontSize: '0.95rem'}}>{seller.shopName}</td>
                      <td style={{padding: '16px 24px', color: '#888', fontSize: '0.9rem'}}>{seller.user?.phone}</td>
                      <td style={{padding: '16px 24px', color: '#888', fontSize: '0.9rem'}}>{seller.licenseNo}</td>
                      <td style={{padding: '16px 24px'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: seller.status === 'ACTIVE' ? '#0a2a0a' : seller.status === 'PENDING' ? '#2a2a0a' : '#2a0a0a',
                          color: seller.status === 'ACTIVE' ? '#44ff44' : seller.status === 'PENDING' ? '#ffff44' : '#ff4444'
                        }}>
                          {seller.status === 'ACTIVE' ? 'Faol' : seller.status === 'PENDING' ? 'Kutmoqda' : 'Bloklangan'}
                        </span>
                      </td>
                      <td style={{padding: '16px 24px'}}>
                        {seller.status === 'PENDING' && (
                          <button
                            onClick={() => approveSeller(seller.id)}
                            style={{background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem'}}
                          >
                            Tasdiqlash
                          </button>
                        )}
                        {seller.status === 'ACTIVE' && (
                          <span style={{color: '#44ff44', fontSize: '0.9rem'}}>✓ Tasdiqlangan</span>
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
          <div style={{background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '16px'}}>💎</div>
            <p style={{color: '#666'}}>Mahsulotlar boshqaruvi tez orada</p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div style={{background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '16px'}}>💳</div>
            <p style={{color: '#666'}}>Tranzaksiyalar boshqaruvi tez orada</p>
          </div>
        )}
      </div>
    </main>
  )
}