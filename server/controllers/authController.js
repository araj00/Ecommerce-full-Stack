import { generateAccessToken, generateRefreshToken } from "../config/refreshToken.js"
import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import crypto from 'crypto' 
import { sendEmail } from '../helpers/sendEmail.js'
import mongoose from 'mongoose'

export const registerController = async (req, res) => {

  const { name, email, phone, address, password } = req.body
  console.log('register data', req.body)
  if (!name || !email || !phone || !address || !password) {
    return res.status(400).json({
      error: 'all important fields are required',
      success: false
    })
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json(
      {
        error: 'user already exists',
        success: false
      }
    )
  }

  const newUser = new User(req.body)
  await newUser.save()

  return res.status(201).json({
    success: true,
    message: 'new user created successfully',
    newUser
  })
}

export const handleLogin = async (req, res) => {

  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json(
        {
          message: 'email or password is wrong'
        }
      )
    }

    const findUser = await User.findOne({ email })

    if (findUser && (await findUser.passwordMatch(password))) {
      const cookies = req.cookies

      let newAccessToken = generateAccessToken(findUser._id)
      let newRefreshToken = generateRefreshToken(findUser._id)

      let refreshTokenArray = cookies?.refreshToken ? findUser.refreshTokens.filter(refreshToken => refreshToken !== cookies.refreshToken) : findUser.refreshTokens

      if (cookies?.refreshToken) {
        const foundUser = await User.findOne({ refreshTokens: cookies.refreshToken })

        if (!foundUser) {
          refreshTokenArray = [];
          res.clearCookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
          })
        }
      }
      refreshTokenArray = [...refreshTokenArray, newRefreshToken]
      findUser.refreshTokens = refreshTokenArray;
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 72 * 60 * 60 * 1000,
        sameSite: 'none'
      })
      await findUser.save()
      res.status(201).json(
        {
          message: 'login successfully',
          success: true,
          user: findUser,
          accessToken: newAccessToken,
        }
      )
    }
    else {
      return res.status(403).json(
        {
          message: 'unauthorized access'
        }
      )
    }

  }

  catch (err) {
    console.log(err)
  }
}

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
  
  const foundUser = await User.findOne({ refreshTokens : {$in : [refreshToken]} }).then(user => {
    
    return  user
  }).catch(err => {
    console.log('catching error in finding user',err)
  });

  // Detected refresh token reuse!
  if (!foundUser) {
      jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          async (err, decoded) => {
              if (err) return res.sendStatus(403); //Forbidden
              console.log('attempted refresh token reuse!')
              const hackedUser = await User.findByIdAndUpdate(decoded.id,{
                $set : {refreshTokens : []}
              },{
                new : true
              });
              
              console.log('hackeduser',hackedUser);
          }
      )
      return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshTokens.filter(rt => rt !== refreshToken);

  // evaluate jwt 
   jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
          if (err) {
              console.log('expired refresh token')
              foundUser.refreshTokens = [...newRefreshTokenArray];
              const result = await foundUser.save();
              console.log(result);
          }
          if (err) return res.sendStatus(403);

          // Refresh token was still valid
          const accessToken = generateAccessToken(decoded.id)

          const newRefreshToken = generateRefreshToken(decoded.id)
          // Saving refreshToken with current user
          foundUser.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
          const result = await foundUser.save();

          // Creates Secure Cookie with refresh token
          res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 72 * 60 * 60 * 1000 });

          res.json({ accessToken })
      }
  );
}

export const handleLogout = async (req, res) => {

  const cookie = req?.cookies

  const refreshToken = cookie?.refreshToken;

  if (!refreshToken) {
    res.clearCookie('refreshToken',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
    return res.status(403).json({
      message: 'logged out successfully'
    })
  }

  const findUser = await User.findOne({ refreshTokens: refreshToken })

  let refreshTokenArray = findUser.refreshTokens.filter(refreshToken => refreshToken !== cookie.refreshToken)
  findUser.refreshTokens = [...refreshTokenArray]

  await findUser.save()
  res.clearCookie('refreshToken',
    {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
  return res.status(200).json(
    {
      message: 'successfully logout',
      success: true
    }
  )

}

export const isAuthenticated = async (req, res) => {

  res.status(200).json(
    {
      ok: true
    }
  )
}

const sendResetPasswordEmail = async (req, res) => {

  const { email } = req.body

  if(!email){
      return res.send({message : 'email required'})
  }
  try {
      const findUser = await User.findOne({ email })
          .then(user => {console.log('email for reset Password', user)
                        return user})
          .catch(err => {
              console.log(err)
          })

      if(!findUser){
          return res.status(400).json(
              {
                  message : 'not a valid '
              }
          )
      }
      
      const resetToken = await findUser.resetPassword()  
      await findUser.save()      
         
      const resetlink = `You have requested a password reset for your account. Please click the following link to reset your password: <a href="http://localhost:3000/passwordReset?token=${resetToken}&id=${findUser._id}">reset link</a>`

      const data = {
          to : email,
          subject :'Password reset',
          text : 'hey this is the message regarding your password reset',
          html : resetlink
      }

      sendEmail(data)
      return res.status(201).json({
          success : true,
          message : `successfully sent the resetlink ${email}`
      })

  }
  catch (err) {
      console.log(err)
  }

}

const resetPassword = async(req,res) => {
 
  const {id,token} = req.query 
  
  const {newPassword} = req.body

const hashedToken = crypto.createHash('sha256').update(token).digest('hex') 
  if(!id || !token){
      return res.status(400).json(
          {
              message : 'invalid reset link'
          }
      )
  }

  if(!newPassword){
      return res.status(400).json(
          {
              message : 'new password is required to update'
          }
      )
  }
  
  const objectId = new mongoose.Types.ObjectId(id)
  const findUserwithreset = await User.findOne({_id : objectId})
  console.log(findUserwithreset)
  const findUser = await User.findOne({passwordResetToken : hashedToken,_id : objectId ,passwordResetExpires : {$gt : Date.now()}})
  
  if(!findUser){
      return res.status(400).json(
          {
              message : 'did not found any user or link is expired'
          }
      )
  }
   
  findUser.password = newPassword
  findUser.passwordResetToken =  undefined
  findUser.passwordResetExpires  = undefined
  findUser.refreshTokens = []

  res.clearCookie('refreshToken',{
    httpOnly : true,
    secure : true,
    sameSite : 'none'
  })
  await findUser.save()

  return res.status(201).json({
      success : true,
          message :  'password resetted successfully'     
  })
  
  
}

export {
  sendResetPasswordEmail,
  resetPassword
}