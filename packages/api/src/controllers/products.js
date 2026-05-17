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

// Barcha mahsulotlarni ko'rish
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        seller: {
          select: {
            shopName: true,
            rating: true
          }
        }
      }
    })
    res.json({ products })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

// Mahsulot qo'shish (faqat sotuvchilar)
const createProduct = async (req, res) => {
  try {
    const { title, metalType, weightGram, purity, priceUzs } = req.body

    if (!title || !metalType || !weightGram || !purity || !priceUzs) {
      return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' })
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.userId }
    })

    if (!seller) {
      return res.status(403).json({ error: 'Siz sotuvchi emassiz' })
    }

    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        title,
        metalType,
        weightGram: parseFloat(weightGram),
        purity,
        priceUzs: BigInt(priceUzs)
      }
    })

    res.status(201).json({
      message: 'Mahsulot qo\'shildi',
      product: {
        id: product.id,
        title: product.title,
        metalType: product.metalType,
        weightGram: product.weightGram,
        purity: product.purity,
        priceUzs: product.priceUzs.toString()
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

// Bitta mahsulotni ko'rish
const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            shopName: true,
            rating: true
          }
        }
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' })
    }

    res.json({
      product: {
        ...product,
        priceUzs: product.priceUzs.toString()
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

module.exports = { getProducts, createProduct, getProduct }