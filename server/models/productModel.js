import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        slug : {
            type : String,
            required : true,
            unique : true
        },
        description : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        quantity : {
            type : String,
            required : true
        },
        category : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Category',
            required : true
        },
        image : {
           type :  String
        },
        path : String,
        shipping : {
            type : Boolean
        }

    },{
        timestamps : true
    }
)

export default mongoose.model('Product',productSchema)