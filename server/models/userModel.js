import mongoose from "mongoose";
import bcrypt, { hash } from 'bcrypt'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim : true
        },
        password: {
            type: String,
            required: true,
            },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        refreshTokens: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next()
        }

        this.password = await bcrypt.hash(this.password, 10)
        return next()
    }
    catch (err) {
        return next(err)

    }
})

userSchema.methods.passwordMatch = async function (enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword,this.password)
    return isMatch
}

userSchema.methods.resetPassword = async function () {
    let resetToken = crypto.randomBytes(32).toString('hex')
    console.log(resetToken)
    let hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    console.log('hashedtoken to be saved',hashedToken)
    this.passwordResetToken = hashedToken;
    console.log(this.passwordResetToken)
    this.passwordResetExpires = Date.now() + (300*1000)
    console.log(this.passwordResetExpires)
    return resetToken
}

export default mongoose.model('User', userSchema)