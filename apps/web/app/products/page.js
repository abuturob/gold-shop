"use client"
import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{background: '#0a0a0a', minHeight: '100vh'}}>
      {/* Header */}
      <header style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', borderBottom: '1px solid #D4AF37'}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3" style={{textDecoration: 'none'}}>
            <img src="/logo.png" style={{width: '45px', height: '45px', objectFit: 'contain'}} alt="logo" />
            <div>
              <h1 style={{color: '#D4AF37', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '2px'}}>GOLD SHOP</h1>
              <p style={{color: '#888', fontSize: '0.7rem', letterSpacing: '3px'}}>PREMIUM MARKETPLACE</p>
            </div>
          </a>
          <nav className="flex items-center gap-6">
            <a href="/products" style={{color: '#D4AF37', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid #D4AF37', paddingBottom: '2px'}}>Mahsulotlar</a>
            <a href="/sellers" style={{color: '#ccc', textDecoration: 'none', fontSize: '0.9rem'}}>Sotuvchilar</a>
            <a href="/login" style={{color: '#D4AF37', border: '1px solid #D4AF37', padding: '8px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem'}}>Kirish</a>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <section style={{padding: '60px 24px 40px', textAlign: 'center'}}>
        <p style={{color: '#D4AF37', letterSpacing: '4px', fontSize: '0.8rem', marginBottom: '12px'}}>KATALOG</p>
        <h2 style={{color: '#fff', fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px'}}>Oltin Mahsulotlar</h2>
        <p style={{color: '#666', fontSize: '1rem'}}>Sertifikatlangan sotuvchilardan premium oltin va zargarlik buyumlari</p>
      </section>

      {/* Products Grid */}
      <section style={{padding: '0 24px 80px'}}>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div style={{textAlign: 'center', padding: '80px', color: '#D4AF37', fontSize: '1.2rem'}}>
              Yuklanmoqda...
            </div>
          ) : products.length === 0 ? (
            <div style={{textAlign: 'center', padding: '80px'}}>
              <div style={{fontSize: '4rem', marginBottom: '24px'}}>💎</div>
              <p style={{color: '#666', fontSize: '1.2rem', marginBottom: '8px'}}>Hozircha mahsulotlar yo'q</p>
              <p style={{color: '#444', fontSize: '0.9rem'}}>Sotuvchilar tez orada mahsulot qo'shishadi</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} style={{background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden'}}>
                  <div style={{background: 'linear-gradient(135deg, #1a1500, #2d2400)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem'}}>
                    {product.metalType === 'GOLD' ? '🥇' : '🥈'}
                  </div>
                  <div style={{padding: '24px'}}>
                    <div className="flex justify-between items-start" style={{marginBottom: '12px'}}>
                      <h3 style={{color: '#fff', fontSize: '1.1rem', fontWeight: '700'}}>{product.title}</h3>
                      <span style={{background: '#1a1500', color: '#D4AF37', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'}}>
                        {product.metalType === 'GOLD' ? 'OLTIN' : 'KUMUSH'}
                      </span>
                    </div>
                    <div style={{marginBottom: '16px'}}>
                      <p style={{color: '#666', fontSize: '0.85rem', marginBottom: '4px'}}>Og'irlik: <span style={{color: '#ccc'}}>{product.weightGram}g</span></p>
                      <p style={{color: '#666', fontSize: '0.85rem', marginBottom: '4px'}}>Sifat: <span style={{color: '#ccc'}}>{product.purity}</span></p>
                      {product.seller && (
                        <p style={{color: '#666', fontSize: '0.85rem'}}>Sotuvchi: <span style={{color: '#ccc'}}>{product.seller.shopName}</span></p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p style={{color: '#D4AF37', fontSize: '1.3rem', fontWeight: '800'}}>
                        {Number(product.priceUzs).toLocaleString()} so'm
                      </p>
                      <button style={{background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem'}}>
                        Xarid qilish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{background: '#111', borderTop: '1px solid #222', padding: '40px 24px', textAlign: 'center'}}>
        <p style={{color: '#D4AF37', fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px'}}>👑 GOLD SHOP</p>
        <p style={{color: '#444', fontSize: '0.85rem'}}>© 2026 Gold Shop. Barcha huquqlar himoyalangan.</p>
      </footer>
    </main>
  )
}