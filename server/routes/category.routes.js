import express from 'express'
import { addCategory, 
         deleteCategory,
         getAllCategories,
         getCategory,
         updateCategory,
 } from '../controllers/categoryController.js'
import { isAdmin, verifyJwt } from '../middleware/authMiddleWare.js'

const router = express.Router()

router.post('/addCategory',verifyJwt,isAdmin, addCategory)
router.delete('/deleteCategory/:id',verifyJwt,isAdmin, deleteCategory)
router.put('/updateCategory/:id',verifyJwt,isAdmin,updateCategory)
router.get('/getAllCategories',getAllCategories)
router.get('/getCategory/:id',getCategory)

export default router