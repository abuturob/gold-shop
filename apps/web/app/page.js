"use client"
import { useState, useEffect } from 'react'

const slides = [
  { img: '/rings.png', label: 'Uzuk', sub: '585 proba · 3.2g', price: '2 800 000' },
  { img: '/necklace.png', label: 'Marjon', sub: '750 proba · 12g', price: '9 500 000' },
  { img: '/bracelet.png', label: 'Braslet', sub: '585 proba · 8g', price: '6 200 000' },
  { img: '/earring.png', label: 'Sirga', sub: '585 proba · 2.1g', price: '1 900 000' },
]

function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const icons = ['💍', '📿', '⌚', '✨']

  return (
    <div style={{position: 'relative', width: '100%', height: '100%', background: '#0f0d08'}}>
      {slides.map((slide, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: current === i ? 1 : 0,
          transform: current === i ? 'scale(1)' : 'scale(1.05)',
          transition: 'all 0.8s ease',
          background: 'radial-gradient(ellipse at center, #2a2000 0%, #1a1500 40%, #0a0800 100%)',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '7rem',
            filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.3))',
            marginBottom: '8px'
          }}>{icons[i]}</div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#F5F0E8', fontSize: '1.8rem',
            fontWeight: '300', letterSpacing: '2px'
          }}>{slide.label}</div>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#555', fontSize: '0.7rem',
            letterSpacing: '2px', textTransform: 'uppercase'
          }}>{slide.sub}</div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#C9A84C', fontSize: '1.4rem',
            fontWeight: '400', marginTop: '8px'
          }}>{slide.price} so'm</div>
        </div>
      ))}

      <div style={{
        position: 'absolute', bottom: '24px', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: '8px'
      }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? '24px' : '6px',
            height: '1px',
            background: i === current ? '#C9A84C' : '#333',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }} />
        ))}
      </div>

      <div style={{position: 'absolute', top: '16px', left: '16px', width: '20px', height: '20px', borderTop: '1px solid #C9A84C', borderLeft: '1px solid #C9A84C'}} />
      <div style={{position: 'absolute', top: '16px', right: '16px', width: '20px', height: '20px', borderTop: '1px solid #C9A84C', borderRight: '1px solid #C9A84C'}} />
      <div style={{position: 'absolute', bottom: '16px', left: '16px', width: '20px', height: '20px', borderBottom: '1px solid #C9A84C', borderLeft: '1px solid #C9A84C'}} />
      <div style={{position: 'absolute', bottom: '16px', right: '16px', width: '20px', height: '20px', borderBottom: '1px solid #C9A84C', borderRight: '1px solid #C9A84C'}} />
    </div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main style={{background: '#080808', minHeight: '100vh', fontFamily: "'Georgia', serif", overflowX: 'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .nav-link {
          color: #999;
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: color 0.3s;
          position: relative;
        }
        .nav-link:hover { color: #C9A84C; }
        .btn-primary {
          display: inline-block;
          background: linear-gradient(135deg, #A07830, #C9A84C, #E8C96A);
          color: #000;
          padding: 16px 48px;
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: all 0.3s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary {
          display: inline-block;
          border: 1px solid #333;
          color: #888;
          padding: 16px 48px;
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: all 0.3s;
        }
        .btn-secondary:hover { border-color: #C9A84C; color: #C9A84C; }
        .feature-card {
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          padding: 40px 32px;
          transition: all 0.4s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 0;
          background: linear-gradient(180deg, #C9A84C, transparent);
          transition: height 0.4s;
        }
        .feature-card:hover { border-color: #2a2a2a; transform: translateY(-4px); }
        .feature-card:hover::before { height: 100%; }
        .marquee-track {
          display: flex;
          gap: 80px;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 60px',
        height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s'
      }}>
        <a href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px'}}>
          <img src="/logo.png" style={{width: '48px', height: '48px', objectFit: 'contain'}} alt="logo" />
          <div>
            <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '4px'}}>GOLD SHOP</div>
            <div style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.55rem', letterSpacing: '3px', marginTop: '-2px'}}>PREMIUM MARKETPLACE</div>
          </div>
        </a>

        <div style={{display: 'flex', gap: '48px', alignItems: 'center'}}>
          <a href="/products" className="nav-link">Mahsulotlar</a>
          <a href="/sellers" className="nav-link">Sotuvchilar</a>
          <a href="/login" className="nav-link">Kirish</a>
          <a href="/register" className="btn-primary" style={{padding: '10px 28px'}}>Boshlash</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '120px 60px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '20%', right: '8%',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{maxWidth: '600px', position: 'relative', zIndex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px'}}>
            <div style={{width: '60px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)'}} />
            <span style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase'}}>O'zbekiston № 1 Oltin Platformasi</span>
          </div>

          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3.5rem, 6vw, 6rem)',
            fontWeight: '300',
            lineHeight: '1.05',
            color: '#F5F0E8',
            letterSpacing: '-1px',
            marginBottom: '32px'
          }}>
            Eng Ishonchli<br/>
            <em style={{fontStyle: 'italic', color: '#C9A84C'}}>Oltin Bozori</em>
          </h1>

          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#666', fontSize: '0.95rem',
            lineHeight: '1.8', maxWidth: '480px',
            marginBottom: '48px', fontWeight: '300'
          }}>
            Sertifikatlangan sotuvchilardan xavfsiz oltin xarid qiling. Har bir tranzaksiya davlat nazoratida va kriptografik himoya ostida.
          </p>

          <div style={{display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '80px'}}>
            <a href="/products" className="btn-primary">Katalogni Ko'rish</a>
            <a href="/register" className="btn-secondary">Sotuvchi Bo'lish</a>
          </div>

          <div style={{
            display: 'flex', gap: '48px',
            paddingTop: '48px', borderTop: '1px solid #1a1a1a'
          }}>
            {[
              {num: '500+', label: 'Sertifikatlangan sotuvchi'},
              {num: '10K+', label: 'Tranzaksiya'},
              {num: '99.9%', label: 'Xavfsizlik'},
            ].map((s, i) => (
              <div key={i}>
                <div style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', fontWeight: '300', color: '#C9A84C', lineHeight: '1'}}>{s.num}</div>
                <div style={{fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.7rem', letterSpacing: '1px', marginTop: '4px'}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

{/* Slider */}
        <div style={{
          position: 'absolute', right: '0', top: '0',
          width: '45%', height: '100%',
          overflow: 'hidden',
          border: 'none',
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          background: 'radial-gradient(ellipse at center, #2a2000 0%, #1a1500 40%, #0a0800 100%)',
        }}>
          <HeroSlider />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{background: '#C9A84C', padding: '14px 0', overflow: 'hidden'}}>
        <div className="marquee-track">
          {[...Array(2)].map((_, j) => (
            ['♦ OLTIN', '♦ KUMUSH', '♦ PLATINA', '♦ XAVFSIZ YETKAZIB BERISH', '♦ DAVLAT NAZORATI', '♦ SERTIFIKATLANGAN', '♦ 24/7 QOLLAB-QUVVATLASH'].map((t, i) => (
              <span key={`${j}-${i}`} style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.65rem', fontWeight: '700',
                letterSpacing: '3px', color: '#000',
                textTransform: 'uppercase'
              }}>{t}</span>
            ))
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{padding: '120px 60px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{marginBottom: '80px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
              <div style={{width: '60px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)'}} />
              <span style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '4px'}}>XIZMATLAR</span>
            </div>
            <h2 style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '3rem', fontWeight: '300'}}>
              Nima uchun <em style={{fontStyle: 'italic', color: '#C9A84C'}}>Gold Shop</em>?
            </h2>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1a1a1a'}}>
            {[
              {icon: '⬡', title: 'Xavfsiz Tranzaksiya', desc: 'Har bir tranzaksiya SHA-256 kriptografik imzo bilan himoyalangan va blockchain texnologiyasida qayd etiladi.'},
              {icon: '⬡', title: 'Davlat Nazorati', desc: "Barcha oltin tranzaksiyalari davlat nazorat tizimi orqali o'tadi. Noqonuniy tranzaksiyalar avtomatik aniqlanadi."},
              {icon: '⬡', title: 'Sertifikatlangan Oltin', desc: "Faqat sertifikatlangan sotuvchilar platformada faoliyat yurita oladi. Har bir mahsulot tekshiruvdan o'tadi."},
              {icon: '⬡', title: 'Premium Yetkazib Berish', desc: 'Professional inkasso xizmati orqali xavfsiz va sugurtalangan yetkazib berish xizmati.'},
              {icon: '⬡', title: 'Real Vaqt Narxlar', desc: "Dunyo bozoridagi oltin narxlari real vaqtda yangilanib turadi. London Bullion Market bilan sinxronizatsiya."},
              {icon: '⬡', title: "Qulay To'lov", desc: "Click, Payme, UzCard va Humo orqali qulay to'lov. Tez va xavfsiz moliyaviy operatsiyalar."},
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1.5rem', marginBottom: '24px', opacity: 0.6}}>{f.icon}</div>
                <h4 style={{fontFamily: 'Montserrat, sans-serif', color: '#F5F0E8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase'}}>{f.title}</h4>
                <p style={{fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.85rem', lineHeight: '1.8', fontWeight: '300'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '120px 60px',
        background: 'linear-gradient(135deg, #0f0d08, #0a0a0a, #0f0d08)',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a',
        textAlign: 'center'
      }}>
        <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '4rem', marginBottom: '24px', opacity: 0.3}}>♦</div>
        <h2 style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '3.5rem', fontWeight: '300', marginBottom: '16px'}}>Bugun Boshlang</h2>
        <p style={{fontFamily: 'Montserrat, sans-serif', color: '#555', fontSize: '0.85rem', marginBottom: '48px', letterSpacing: '1px'}}>
          O'zbekistondagi eng ishonchli oltin platformasiga qo'shiling
        </p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
          <a href="/register" className="btn-primary">Royxatdan Otish</a>
          <a href="/products" className="btn-secondary">Katalog</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background: '#080808', padding: '60px', borderTop: '1px solid #111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
              <img src="/logo.png" style={{width: '36px', height: '36px', objectFit: 'contain'}} alt="logo" />
              <span style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1rem', letterSpacing: '3px'}}>GOLD SHOP</span>
            </div>
            <p style={{fontFamily: 'Montserrat, sans-serif', color: '#333', fontSize: '0.75rem', lineHeight: '1.8'}}>
              O'zbekiston № 1 oltin marketplace<br/>
              © 2026 Gold Shop. Barcha huquqlar himoyalangan.
            </p>
          </div>
          <div style={{display: 'flex', gap: '80px'}}>
            {[
              {title: 'Platforma', links: ['Mahsulotlar', 'Sotuvchilar', 'Narxlar']},
              {title: 'Kompaniya', links: ['Biz haqimizda', 'Boglanish', 'Blog']},
            ].map((col, i) => (
              <div key={i}>
                <div style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '3px', marginBottom: '20px', textTransform: 'uppercase'}}>{col.title}</div>
                {col.links.map((l, j) => (
                  <div key={j} style={{fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.8rem', marginBottom: '10px', cursor: 'pointer'}}>{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}