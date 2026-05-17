const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../.env') })

const { PrismaClient } = require('../../../database/node_modules/@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

const register = async (req, res) => {
  try {
    const { phone, password, role } = req.body

    if (!phone || !password) {
      return res.status(400).json({ error: 'Telefon va parol kiritish shart' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Bu telefon raqam allaqachon royxatdan otgan' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        phone,
        passwordHash,
        role: role || 'BUYER'
      }
    })

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    res.status(201).json({
      message: 'Muvaffaqiyatli royxatdan otdingiz',
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

const login = async (req, res) => {
  try {
    const { phone, password } = req.body

    const user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return res.status(401).json({ error: 'Telefon yoki parol notogri' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ error: 'Telefon yoki parol notogri' })
    }

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