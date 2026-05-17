const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '.env') })

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const sellerRoutes = require('./routes/sellers')

const app = express()
const PORT = 3000

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sellers', sellerRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Gold Shop API ishlayapti!', version: '1.0.0' })
})

const server = app.listen(PORT, () => {
  console.log('Server ' + PORT + ' portda ishlamoqda')
})

server.on('error', (err) => {
  console.error('Server xatosi:', err)
})

process.on('uncaughtException', (err) => {
  console.error('Kutilmagan xato:', err)
})