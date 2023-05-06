import express from  'express'
import { handleLogin,
         handleLogout,
         handleRefreshToken,
         isAuthenticated,
         registerController,
         resetPassword,
         sendResetPasswordEmail } from '../controllers/authController.js'
         
import { isAdmin, verifyJwt } from '../middleware/authMiddleWare.js'

const router = express.Router()

router.post('/register',registerController)
router.post('/login',handleLogin)
router.post('/refresh',handleRefreshToken)
router.post('/logout',handleLogout)
router.post('/isUserAuthenticated',verifyJwt,isAuthenticated)
router.post('/isAdminAuthenticated',verifyJwt,isAdmin,isAuthenticated)
router.post('/passwordResetLink',sendResetPasswordEmail)
router.post('/resetPassword',resetPassword)

export default router