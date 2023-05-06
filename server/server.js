import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/dbConnect.js'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'
import categoryRouter from './routes/category.routes.js'
import productRouter from './routes/product.routes.js'

const app = express()
dotenv.config()
 
var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionSuccessStatus : 200,
  credentials : true
}  

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan('dev'))
app.use(cookieParser())

const port = process.env.PORT || 8000;

app.use(express.static('public'))

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/product',productRouter)

app.use((err,req,res,next) => {
  return res.status(500).json(
    {
      message : err.message
    }
  )
})


app.listen(port,() => {
    console.log(`app is listening on port ${port}`)
    dbConnect()
})