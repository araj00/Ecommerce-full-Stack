import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const verifyJwt = async (req, res, next) => {
    try {
        if (req.headers.authorization.startsWith('Bearer') || (req.headers.Authorization.startsWith('Bearer'))) {
            const token = req.headers.authorization.split(' ')[1] || req.headers.Authorization.split(' ')[1]
            if (token) {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                    if (err) {
                       return res.status(401).json({
                        message : 'Token expired.Login Again'
                      }
                        )
                    }
                    console.log(decoded)
                    const user = await User.findById(decoded.id)
                    req.login = user
                    next()
                })
            }
            
        else {
             res.status(403).json(
                {message : 'token is not present in headers'}
            )
        }
    }
    else{
        res.status(403).json(
            {message : 'headers does not have a bearer token'}
        )
    }
}
    catch (err) {
           console.log(err)
    }
}

export const isAdmin = async(req,res,next) => {
    const {email} = req.login

    const findUser = await User.findOne({email})

    const isAdmin = findUser.role
    if(isAdmin === 'admin'){
       next()
    }
    else{
      return res.status(403).json(
        {
            message : 'unauthorized'
        }
      )
    }
}