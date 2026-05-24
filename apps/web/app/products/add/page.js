"use client"
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()
  const [form, setForm] = useState({
    title: '',
    priceUzs: '',
    weightGram: '',
    purity: '585',
    metalType: 'GOLD',
  })

  const handleImage = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.priceUzs || !form.weightGram) {
      alert('Nom, narx va vazn kiritish shart!')
      return
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          metalType: form.metalType,
          weightGram: parseFloat(form.weightGram),
          purity: form.purity,
          priceUzs: form.priceUzs
        })
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/products')
      } else {
        alert(data.error || 'Xato yuz berdi')
      }
    } catch (e) {
      alert('Server bilan ulanishda xato')
    }
    setLoading(false)
  }

  const categories = [
    { value: 'GOLD', label: 'Oltin', icon: '🥇' },
    { value: 'SILVER', label: 'Kumush', icon: '🥈' },
    { value: 'PLATINUM', label: 'Platina', icon: '💎' },
  ]

  const purities = [
    { value: '375', label: '375', sub: '9 karat' },
    { value: '500', label: '500', sub: '12 karat' },
    { value: '585', label: '585', sub: '14 karat' },
    { value: '750', label: '750', sub: '18 karat' },
    { value: '875', label: '875', sub: '21 karat' },
    { value: '999', label: '999', sub: '24 karat' },
  ]

  return (
    <main style={{
      background: '#080808',
      minHeight: '100vh',
      fontFamily: "'Montserrat', sans-serif",
      padding: '0'
    }}>
      {/* Top nav */}
      <nav style={{
        background: 'rgba(8,8,8,0.95)',
        borderBottom: '1px solid #111',
        padding: '0 60px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)'
      }}>
        <a href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px'}}>
          <img src="/logo.png" style={{width: '150px', height: '44px', objectFit: 'contain'}} alt="logo" />
          <div>
            <div style={{fontFamily: 'Cormorant Garamond, serif', color: '#F5F0E8', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '4px'}}>GOLD SHOP</div>
            <div style={{fontFamily: 'Montserrat, sans-serif', color: '#C9A84C', fontSize: '0.55rem', letterSpacing: '3px'}}>PREMIUM MARKETPLACE</div>
          </div>
        </a>
        <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
          <button onClick={() => router.push('/products')} style={{
            background: 'none', border: '1px solid #1a1a1a', color: '#555',
            cursor: 'pointer', fontSize: '0.7rem', padding: '8px 20px',
            fontFamily: 'Montserrat, sans-serif', letterSpacing: '2px', textTransform: 'uppercase',
            transition: 'all 0.3s'
          }}>
            ← Orqaga
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C', boxShadow: '0 0 8px rgba(201,168,76,0.5)'}} />
            <span style={{fontFamily: 'Montserrat, sans-serif', color: '#444', fontSize: '0.7rem', letterSpacing: '1px'}}>Yangi mahsulot</span>
          </div>
        </div>
      </nav>

      <div style={{maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px'}}>
        
        {/* LEFT */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          {/* Rasm yuklash */}
          <div style={{background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '28px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <div>
                <h3 style={{color: '#fff', fontWeight: '700', fontSize: '1rem', margin: 0}}>Mahsulot rasmi</h3>
                <p style={{color: '#444', fontSize: '0.8rem', margin: '4px 0 0'}}>PNG, JPG · Max 10MB</p>
              </div>
              {imagePreview && (
                <button onClick={() => setImagePreview(null)} style={{
                  background: '#1a1a1a', border: '1px solid #333', color: '#888',
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem'
                }}>O'chirish</button>
              )}
            </div>

            {imagePreview ? (
              <div style={{position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '280px'}}>
                <img src={imagePreview} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="preview" />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                  display: 'flex', alignItems: 'flex-end', padding: '20px'
                }}>
                  <button onClick={() => fileRef.current.click()} style={{
                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                    padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                  }}>Rasmni almashtirish</button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImage(e.dataTransfer.files[0]) }}
                style={{
                  border: `2px dashed ${dragOver ? '#D4AF37' : '#2a2a2a'}`,
                  borderRadius: '14px',
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: dragOver ? 'rgba(212,175,55,0.05)' : 'transparent',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1a1500, #2a2200)',
                  border: '1px solid #D4AF3730',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem'
                }}>📸</div>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#D4AF37', fontWeight: '600', margin: 0, fontSize: '0.95rem'}}>Rasmni bu yerga tashlang</p>
                  <p style={{color: '#444', fontSize: '0.8rem', margin: '4px 0 0'}}>yoki bosib faylni tanlang</p>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{display: 'none'}}
              onChange={(e) => handleImage(e.target.files[0])} />
          </div>

          {/* Nom va tavsif */}
          <div style={{background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '28px'}}>
            <h3 style={{color: '#fff', fontWeight: '700', fontSize: '1rem', marginBottom: '20px', marginTop: 0}}>Asosiy ma'lumotlar</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px', fontWeight: '500'}}>MAHSULOT NOMI *</label>
                <input
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: '#0a0a0a', border: '1px solid #222',
                    borderRadius: '10px', color: '#fff', fontSize: '1rem',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  placeholder="Masalan: Oltin uzuk 585 probali"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  onFocus={e => e.target.style.border = '1px solid #D4AF37'}
                  onBlur={e => e.target.style.border = '1px solid #222'}
                />
              </div>
            </div>
          </div>

          {/* Metal turi */}
          <div style={{background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '28px'}}>
            <h3 style={{color: '#fff', fontWeight: '700', fontSize: '1rem', marginBottom: '20px', marginTop: 0}}>Metal turi</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
              {categories.map(cat => (
                <button key={cat.value} onClick={() => setForm({...form, metalType: cat.value})}
                  style={{
                    padding: '16px 12px',
                    background: form.metalType === cat.value ? 'linear-gradient(135deg, #1a1500, #2a2200)' : '#0a0a0a',
                    border: form.metalType === cat.value ? '1px solid #D4AF37' : '1px solid #1e1e1e',
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                  }}>
                  <span style={{fontSize: '1.5rem'}}>{cat.icon}</span>
                  <span style={{color: form.metalType === cat.value ? '#D4AF37' : '#666', fontWeight: '600', fontSize: '0.85rem'}}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toza foiz */}
          <div style={{background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '28px'}}>
            <h3 style={{color: '#fff', fontWeight: '700', fontSize: '1rem', marginBottom: '20px', marginTop: 0}}>Toza foiz (Proba)</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px'}}>
              {purities.map(p => (
                <button key={p.value} onClick={() => setForm({...form, purity: p.value})}
                  style={{
                    padding: '14px 8px',
                    background: form.purity === p.value ? 'linear-gradient(135deg, #D4AF37, #FFD700)' : '#0a0a0a',
                    border: form.purity === p.value ? 'none' : '1px solid #1e1e1e',
                    borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                  }}>
                  <span style={{color: form.purity === p.value ? '#000' : '#fff', fontWeight: '800', fontSize: '0.95rem'}}>{p.label}</span>
                  <span style={{color: form.purity === p.value ? '#000' : '#444', fontSize: '0.65rem'}}>{p.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - Narx va publish */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          {/* Narx */}
          <div style={{background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '28px'}}>
            <h3 style={{color: '#fff', fontWeight: '700', fontSize: '1rem', marginBottom: '20px', marginTop: 0}}>Narx va vazn</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px'}}>NARX (SO'M) *</label>
                <div style={{position: 'relative'}}>
                  <input
                    type="number"
                    style={{
                      width: '100%', padding: '14px 16px 14px 48px',
                      background: '#0a0a0a', border: '1px solid #222',
                      borderRadius: '10px', color: '#D4AF37', fontSize: '1.1rem',
                      fontWeight: '700', outline: 'none', boxSizing: 'border-box'
                    }}
                    placeholder="0"
                    value={form.priceUzs}
                    onChange={e => setForm({...form, priceUzs: e.target.value})}
                  />
                  <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '0.85rem', fontWeight: '600'}}>UZS</span>
                </div>
                {form.priceUzs && (
                  <p style={{color: '#444', fontSize: '0.75rem', marginTop: '6px'}}>
                    ≈ {(parseInt(form.priceUzs) / 12800).toFixed(0)} USD
                  </p>
                )}
              </div>
              <div>
                <label style={{color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px'}}>VAZN (GRAMM) *</label>
                <div style={{position: 'relative'}}>
                  <input
                    type="number"
                    style={{
                      width: '100%', padding: '14px 16px 14px 48px',
                      background: '#0a0a0a', border: '1px solid #222',
                      borderRadius: '10px', color: '#fff', fontSize: '1rem',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                    placeholder="0.0"
                    value={form.weightGram}
                    onChange={e => setForm({...form, weightGram: e.target.value})}
                  />
                  <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '0.85rem', fontWeight: '600'}}>GR</span>
                </div>
              </div>

              {/* Gram narxi */}
              {form.priceUzs && form.weightGram && (
                <div style={{
                  background: 'linear-gradient(135deg, #1a1500, #2a2200)',
                  border: '1px solid #D4AF3730',
                  borderRadius: '10px', padding: '14px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{color: '#888', fontSize: '0.8rem'}}>1 gramm narxi</span>
                  <span style={{color: '#D4AF37', fontWeight: '700', fontSize: '0.95rem'}}>
                    {Math.round(parseInt(form.priceUzs) / parseFloat(form.weightGram)).toLocaleString()} so'm
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Preview card */}
          <div style={{background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '28px'}}>
            <h3 style={{color: '#fff', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', marginTop: 0}}>Ko'rinish</h3>
            <div style={{
              background: '#0a0a0a', borderRadius: '14px', overflow: 'hidden',
              border: '1px solid #1a1a1a'
            }}>
              <div style={{
                height: '140px', background: imagePreview ? 'none' : 'linear-gradient(135deg, #1a1a1a, #111)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
              }}>
                {imagePreview
                  ? <img src={imagePreview} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="preview" />
                  : <span style={{fontSize: '2.5rem', opacity: 0.3}}>💍</span>
                }
              </div>
              <div style={{padding: '14px'}}>
                <p style={{color: '#fff', fontWeight: '600', margin: '0 0 4px', fontSize: '0.9rem'}}>
                  {form.title || 'Mahsulot nomi...'}
                </p>
                <p style={{color: '#D4AF37', fontWeight: '800', margin: '0 0 8px', fontSize: '1rem'}}>
                  {form.priceUzs ? parseInt(form.priceUzs).toLocaleString() + " so'm" : '— so\'m'}
                </p>
                <div style={{display: 'flex', gap: '6px'}}>
                  <span style={{background: '#1a1a1a', color: '#666', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem'}}>
                    {form.purity} proba
                  </span>
                  <span style={{background: '#1a1a1a', color: '#666', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem'}}>
                    {form.weightGram || '—'} gr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Publish tugmasi */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: loading ? '#1a1a1a' : 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
              color: loading ? '#444' : '#000',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.5px',
              boxShadow: loading ? 'none' : '0 8px 32px rgba(212,175,55,0.3)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Saqlanmoqda...' : '✦ Marketplace ga chiqarish'}
          </button>

          <p style={{color: '#333', fontSize: '0.75rem', textAlign: 'center', margin: 0}}>
            Mahsulot admin tekshiruvidan o'tgach ko'rinadi
          </p>
        </div>
      </div>
    </main>
  )
}