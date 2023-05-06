import express from 'express'
import { isAdmin, 
         verifyJwt, } from '../middleware/authMiddleWare.js'
import { createProduct,
         deleteProduct,
         filterProduct,
         getAllProduct,
         getProduct, 
         getProductImage,
         isExistImage,
         paginatedProductResult,
         totalProductCount,
         updateProduct} from '../controllers/productController.js'
import { upload } from '../config/multer.js'


const router = express.Router()

router.post('/create-product',verifyJwt,isAdmin, upload.single("image"),isExistImage,createProduct)

router.get('/getProductById/:slug',getProduct)

router.put('/updateProduct/:id',verifyJwt,isAdmin,upload.single("image"),updateProduct)

router.get('/getAllProducts',getAllProduct)
router.get('/getProductImage/:id',getProductImage)

router.delete('/deleteProduct/:id',deleteProduct)

router.post('/filterProduct',filterProduct)

router.get('/totalProductCount',totalProductCount)
router.post('/products',paginatedProductResult)

export default router