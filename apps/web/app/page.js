"use client"

export default function Home() {
  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      {/* Header */}
      <header style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', borderBottom: '1px solid #D4AF37'}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span style={{fontSize: '2rem'}}>👑</span>
            <div>
              <h1 style={{color: '#D4AF37', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '2px'}}>GOLD SHOP</h1>
              <p style={{color: '#888', fontSize: '0.7rem', letterSpacing: '3px'}}>PREMIUM MARKETPLACE</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/products" style={{color: '#ccc', textDecoration: 'none', fontSize: '0.9rem'}}>Mahsulotlar</a>
            <a href="/sellers" style={{color: '#ccc', textDecoration: 'none', fontSize: '0.9rem'}}>Sotuvchilar</a>
            <a href="/login" style={{color: '#D4AF37', border: '1px solid #D4AF37', padding: '8px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem'}}>Kirish</a>
            <a href="/register" style={{background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000', padding: '8px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700'}}>Ro'yxatdan o'tish</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1200 100%)', padding: '100px 24px', textAlign: 'center'}}>
        <p style={{color: '#D4AF37', letterSpacing: '4px', fontSize: '0.8rem', marginBottom: '16px'}}>O'ZBEKISTON №1 OLTIN PLATFORMASI</p>
        <h2 style={{color: '#fff', fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px'}}>
          Eng Ishonchli<br/>
          <span style={{color: '#D4AF37'}}>Oltin Bozori</span>
        </h2>
        <p style={{color: '#888', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px'}}>
          Sertifikatlangan sotuvchilardan xavfsiz oltin xarid qiling. Har bir tranzaksiya davlat nazoratida.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/products" style={{background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000', padding: '16px 40px', borderRadius: '4px', textDecoration: 'none', fontWeight: '800', fontSize: '1rem'}}>Mahsulotlarni Ko'rish</a>
          <a href="/register" style={{border: '1px solid #D4AF37', color: '#D4AF37', padding: '16px 40px', borderRadius: '4px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem'}}>Sotuvchi Bo'lish</a>
        </div>
      </section>

      {/* Stats */}
      <section style={{background: '#111', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '40px 24px'}}>
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[
            {num: '500+', label: 'Sertifikatlangan sotuvchi'},
            {num: '10,000+', label: 'Muvaffaqiyatli tranzaksiya'},
            {num: '99.9%', label: 'Xavfsizlik darajasi'},
            {num: '24/7', label: 'Qo\'llab-quvvatlash'},
          ].map((s, i) => (
            <div key={i}>
              <p style={{color: '#D4AF37', fontSize: '2rem', fontWeight: '800'}}>{s.num}</p>
              <p style={{color: '#666', fontSize: '0.85rem'}}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{padding: '80px 24px'}}>
        <div className="max-w-7xl mx-auto">
          <h3 style={{color: '#fff', fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '60px'}}>
            Nima uchun <span style={{color: '#D4AF37'}}>Gold Shop</span>?
          </h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              {icon: '🔐', title: 'Xavfsiz Tranzaksiya', desc: 'Har bir tranzaksiya SHA-256 kriptografik imzo bilan himoyalangan'},
              {icon: '🏛️', title: 'Davlat Nazorati', desc: 'Barcha oltin tranzaksiyalari davlat nazorat tizimi orqali o\'tadi'},
              {icon: '💎', title: 'Sertifikatlangan Oltin', desc: 'Faqat sertifikatlangan sotuvchilar platformada faoliyat yurita oladi'},
              {icon: '🚚', title: 'Xavfsiz Yetkazib Berish', desc: 'Professional inkasso xizmati orqali xavfsiz yetkazib berish'},
              {icon: '📊', title: 'Real Vaqt Narxlar', desc: 'Dunyo bozoridagi oltin narxlari real vaqtda yangilanib turadi'},
              {icon: '💳', title: 'Qulay To\'lov', desc: 'Click, Payme, UzCard va Humo orqali qulay to\'lov imkoniyati'},
            ].map((f, i) => (
              <div key={i} style={{background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '32px'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '16px'}}>{f.icon}</div>
                <h4 style={{color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px'}}>{f.title}</h4>
                <p style={{color: '#666', fontSize: '0.9rem', lineHeight: '1.6'}}>{f.desc}</p>
              </div>
            ))}
          </div>
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