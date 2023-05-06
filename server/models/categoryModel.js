import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            lowercase: true 
        }
    },
    {
        timestamps: true
    }
)

categorySchema.pre('save', async function (next) {

    try { 
        if(!this.isModified('name')){
            console.log('categoryname field is not changed')
            return next()
        }
        this.slug = slugify(this.name,{lower  : true})
        console.log(this.slug);
        return next()
    }
    catch (err) {
        console.log(err)
        return next(err)
    }
})

export default mongoose.model('Category', categorySchema)