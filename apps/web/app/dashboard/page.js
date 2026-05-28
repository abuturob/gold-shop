"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) { router.push('/login'); return }
    if (userData) setUser(JSON.parse(userData))

    const headers = { 'Authorization': `Bearer ${token}` }

    Promise.all([
      fetch('http://localhost:5000/api/sellers/my/stats', { headers }).then(r => r.json()),
      fetch('http://localhost:5000/api/sellers/my/products', { headers }).then(r => r.json())
    ]).then(([statsData, productsData]) => {
      setStats(statsData)
      setProducts(productsData.products || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const deleteProduct = async (id) => {
    if (!confirm('Mahsulotni o\'chirishni tasdiqlaysizmi?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <main style={{ background: '#080808', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .tab-btn {
          padding: 12px 28px; background: none; border: none;
          border-bottom: 1px solid transparent; color: #444;
          font-family: 'Montserrat', sans-serif; font-size: 0.7rem;
          font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
        }
        .tab-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
        .tab-btn:hover { color: #C9A84C; }
        .action-btn {
          background: linear-gradient(135deg, #A07830, #C9A84C);
          color: #000; border: none; padding: 10px 24px;
          font-family: 'Montserrat', sans-serif; font-size: 0.7rem;
          font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s; text-decoration: none;
          display: inline-block;
        }
        .action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .delete-btn {
          background: none; border: 1px solid #2a1a1a; color: #555;
          padding: 6px 16px; font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem; letter-spacing: 1px; cursor: pointer;
          transition: all 0.3s;
        }
        .delete-btn:hover { border-color: #ef4444; color: #ef4444; }
        .stat-card {
          background: #0f0f0f; border: 1px solid #1a1a1a; padding: 28px;
          position: relative; overflow: hidden;
        }
        tr:hover td { background: rgba(201,168,76,0.02); }
      `}</style>

      <Navbar active="dashboard" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 60px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
              <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '3px' }}>SHAXSIY KABINET</span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '2.5rem', fontWeight: '300' }}>
              {stats?.seller?.shopName || 'Sotuvchi'} <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Dashboard</em>
            </h1>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: stats?.seller?.status === 'ACTIVE' ? 'rgba(34,197,94,0.05)' : 'rgba(245,158,11,0.05)',
            border: `1px solid ${stats?.seller?.status === 'ACTIVE' ? '#22c55e33' : '#f59e0b33'}`,
            padding: '8px 20px'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: stats?.seller?.status === 'ACTIVE' ? '#22c55e' : '#f59e0b' }} />
            <span style={{ fontFamily: 'Montserrat, sans-serif', color: stats?.seller?.status === 'ACTIVE' ? '#22c55e' : '#f59e0b', fontSize: '0.7rem', letterSpacing: '1px' }}>
              {stats?.seller?.status === 'ACTIVE' ? 'FAOL' : 'KUTMOQDA'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#111', marginBottom: '48px' }}>
          {[
            { label: 'Jami mahsulotlar', value: stats?.stats?.totalProducts || 0, color: '#C9A84C' },
            { label: 'Faol mahsulotlar', value: stats?.stats?.activeProducts || 0, color: '#22c55e' },
            { label: 'Umumiy qiymat', value: stats?.stats?.totalValue ? Number(stats.stats.totalValue).toLocaleString() + " so'm" : "0 so'm", color: '#C9A84C' },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', color: stat.color, fontSize: '2.5rem', fontWeight: '300', lineHeight: 1 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #111', marginBottom: '32px', display: 'flex' }}>
          {[
            { id: 'products', label: 'Mahsulotlarim' },
            { id: 'orders', label: 'Buyurtmalar' },
            { id: 'settings', label: 'Sozlamalar' },
          ].map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>

        {/* Products */}
        {activeTab === 'products' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.3rem', fontWeight: '400' }}>
                Mening <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Mahsulotlarim</em>
              </h2>
              <a href="/products/add" className="action-btn">+ Yangi mahsulot</a>
            </div>

            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '2rem', opacity: 0.3 }}>♦</div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '12px' }}>YUKLANMOQDA...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2, marginBottom: '20px' }}>♦</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.5rem', fontWeight: '300', marginBottom: '12px' }}>Mahsulot yo'q</h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem', marginBottom: '32px' }}>Birinchi mahsulotingizni qo'shing</p>
                <a href="/products/add" className="action-btn">+ Mahsulot qo'shish</a>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #111' }}>
                    {['Mahsulot', 'Metal', 'Vazn', 'Proba', 'Narx', 'Status', 'Amal'].map(h => (
                      <th key={h} style={{
                        padding: '16px 24px', textAlign: 'left',
                        fontFamily: 'Montserrat, sans-serif', color: '#2a2a2a',
                        fontSize: '0.65rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #0f0f0f' }}>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1rem' }}>{product.title}</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '1px' }}>
                          {product.metalType === 'GOLD' ? 'OLTIN' : product.metalType === 'SILVER' ? 'KUMUSH' : 'PLATINA'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.8rem' }}>{product.weightGram}g</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.8rem' }}>{product.purity}</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1rem' }}>
                          {Number(product.priceUzs).toLocaleString()} so'm
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{
                          padding: '4px 12px', fontSize: '0.65rem',
                          fontFamily: 'Montserrat, sans-serif', fontWeight: '600', letterSpacing: '1px',
                          border: '1px solid',
                          borderColor: product.status === 'ACTIVE' ? '#22c55e33' : '#f59e0b33',
                          color: product.status === 'ACTIVE' ? '#22c55e' : '#f59e0b',
                          background: product.status === 'ACTIVE' ? 'rgba(34,197,94,0.05)' : 'rgba(245,158,11,0.05)',
                        }}>
                          {product.status === 'ACTIVE' ? 'FAOL' : 'KUTMOQDA'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <button className="delete-btn" onClick={() => deleteProduct(product.id)}>O'chirish</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '80px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '3rem', opacity: 0.2, marginBottom: '20px' }}>♦</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.5rem', fontWeight: '300', marginBottom: '8px' }}>Buyurtmalar</h3>
            <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem' }}>Tez orada qo'shiladi</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '40px' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.3rem', fontWeight: '400', marginBottom: '32px' }}>
              Do'kon <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Sozlamalari</em>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {[
                { label: "Do'kon nomi", value: stats?.seller?.shopName },
                { label: 'Litsenziya', value: stats?.seller?.licenseNo },
                { label: 'Status', value: stats?.seller?.status },
                { label: 'Reyting', value: stats?.seller?.rating + ' / 5' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '12px' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}