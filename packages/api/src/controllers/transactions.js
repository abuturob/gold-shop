const path = require('path')
const dotenv = require('dotenv')
const crypto = require('crypto')
dotenv.config({ path: path.join(__dirname, '../.env') })

const { PrismaClient } = require('../../../database/node_modules/@prisma/client')
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

// Xarid qilish
const createTransaction = async (req, res) => {
  try {
    const { productId } = req.body
    const buyerId = req.user.userId

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true }
    })

    if (!product) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' })
    }

    if (product.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Mahsulot mavjud emas' })
    }

    if (product.seller.userId === buyerId) {
      return res.status(400).json({ error: 'O\'z mahsulotingizni xarid qila olmaysiz' })
    }

    const txHash = crypto.createHash('sha256')
      .update(`${buyerId}-${productId}-${Date.now()}`)
      .digest('hex')

    const transaction = await prisma.transaction.create({
      data: {
        buyerId,
        sellerId: product.sellerId,
        productId,
        amountUzs: product.priceUzs,
        txHash,
        status: 'PENDING'
      }
    })

    await prisma.product.update({
      where: { id: productId },
      data: { status: 'SOLD' }
    })

    res.status(201).json({
      message: 'Tranzaksiya yaratildi',
      transaction: {
        id: transaction.id,
        amountUzs: transaction.amountUzs.toString(),
        status: transaction.status,
        txHash: transaction.txHash,
        createdAt: transaction.createdAt
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

// O'z tranzaksiyalarini ko'rish (xaridor)
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { buyerId: req.user.userId },
      include: {
        product: {
          select: { title: true, metalType: true, weightGram: true, purity: true }
        },
        seller: {
          select: { shopName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      transactions: transactions.map(tx => ({
        ...tx,
        amountUzs: tx.amountUzs.toString()
      }))
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

// Sotuvchi tranzaksiyalari
const getSellerTransactions = async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.userId }
    })
    if (!seller) {
      return res.status(404).json({ error: 'Sotuvchi topilmadi' })
    }

    const transactions = await prisma.transaction.findMany({
      where: { sellerId: seller.id },
      include: {
        product: {
          select: { title: true, metalType: true, weightGram: true }
        },
        buyer: {
          select: { phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      transactions: transactions.map(tx => ({
        ...tx,
        amountUzs: tx.amountUzs.toString()
      }))
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

// Admin — barcha tranzaksiyalar
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        product: { select: { title: true } },
        buyer: { select: { phone: true } },
        seller: { select: { shopName: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      transactions: transactions.map(tx => ({
        ...tx,
        amountUzs: tx.amountUzs.toString()
      }))
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server xatosi' })
  }
}

module.exports = { createTransaction, getMyTransactions, getSellerTransactions, getAllTransactions }