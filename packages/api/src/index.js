const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config({ path: './src/.env' })

const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Tekshirish
app.get('/', (req, res) => {
  res.json({ 
    message: 'Gold Shop API ishlayapti!',
    version: '1.0.0'
  })
})

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlamoqda`)
})