const { PrismaClient } = require('../../../database/node_modules/@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Ro'yxatdan o'tish
const register = async (req, res) => {
  try {
    const { phone, password, role } = req.body

    // Telefon raqam tekshiruvi
    if (!phone || !password) {
      return res.status(400).json({ error: 'Telefon va parol kiritish shart' })
    }

    // Foydalanuvchi mavjudmi?
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan' })
    }

    // Parolni shifrlash
    const passwordHash = await bcrypt.hash(password, 10)

    // Foydalanuvchi yaratish
    const user = await prisma.user.create({
      data: {
        phone,
        passwordHash,
        role: role || 'BUYER'
      }
    })

    // Token yaratish
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    res.status(201).json({
      message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

// Kirish
const login = async (req, res) => {
  try {
    const { phone, password } = req.body

    // Foydalanuvchini qidirish
    const user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return res.status(401).json({ error: 'Telefon yoki parol noto\'g\'ri' })
    }

    // Parolni tekshirish
    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ error: 'Telefon yoki parol noto\'g\'ri' })
    }

    // Token yaratish
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    res.json({
      message: 'Muvaffaqiyatli kirdingiz',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

module.exports = { register, login }