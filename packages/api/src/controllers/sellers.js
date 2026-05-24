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

const becomeSeller = async (req, res) => {
  try {
    const { shopName, licenseNo } = req.body

    if (!shopName || !licenseNo) {
      return res.status(400).json({ error: 'Do\'kon nomi va litsenziya raqami shart' })
    }

    const existingSeller = await prisma.seller.findUnique({
      where: { userId: req.user.userId }
    })

    if (existingSeller) {
      return res.status(400).json({ error: 'Siz allaqachon sotuvchisiz' })
    }

    const seller = await prisma.seller.create({
      data: {
        userId: req.user.userId,
        shopName,
        licenseNo,
        status: 'PENDING'
      }
    })

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { role: 'SELLER' }
    })

    res.status(201).json({
      message: 'Sotuvchi arizasi yuborildi, tasdiq kutilmoqda',
      seller: {
        id: seller.id,
        shopName: seller.shopName,
        licenseNo: seller.licenseNo,
        status: seller.status
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

const getSellers = async (req, res) => {
  try {
    const sellers = await prisma.seller.findMany({
      include: {
        user: {
          select: {
            phone: true,
            isVerified: true
          }
        }
      }
    })

    res.json({ sellers })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

const approveSeller = async (req, res) => {
  try {
    const { id } = req.params

    const seller = await prisma.seller.update({
      where: { id },
      data: { status: 'ACTIVE' }
    })

    res.json({
      message: 'Sotuvchi tasdiqlandi',
      seller
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

const getMyProducts = async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.userId }
    })
    if (!seller) {
      return res.status(404).json({ error: 'Sotuvchi topilmadi' })
    }
    const products = await prisma.product.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json({
      products: products.map(p => ({
        ...p,
        priceUzs: p.priceUzs.toString()
      }))
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

const getMyStats = async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.userId }
    })
    if (!seller) {
      return res.status(404).json({ error: 'Sotuvchi topilmadi' })
    }
    const products = await prisma.product.findMany({
      where: { sellerId: seller.id }
    })
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.status === 'ACTIVE').length
    const totalValue = products.reduce((sum, p) => sum + Number(p.priceUzs), 0)

    res.json({
      seller: {
        id: seller.id,
        shopName: seller.shopName,
        licenseNo: seller.licenseNo,
        status: seller.status,
        rating: seller.rating
      },
      stats: {
        totalProducts,
        activeProducts,
        totalValue: totalValue.toString()
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

module.exports = { becomeSeller, getSellers, approveSeller, getMyProducts, getMyStats }
