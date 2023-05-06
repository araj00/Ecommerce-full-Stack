import slugify from 'slugify'
import { uploads, updatePhoto, destroy } from '../config/storage.js'
import Product from '../models/productModel.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const createProduct = async (req, res) => {
    const { name,
        description,
        price,
        category,
        quantity,
        shipping } = req.body

    try {
        if (req.file === undefined) {
            return res.status(400).json(
                {
                    message: 'please upload a file'
                }
            )
        }



        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                message: 'all fields are required'
            })
        }



        const existedProduct = await Product.findOne({ slug: slugify(req.body.name) })

        if (existedProduct) {
            return res.status(400).json(
                {
                    message: 'slug is already used',
                    success: false
                }
            )
        }
        const result = await uploads(req.file)

        const product = await new Product({ ...req.body, image: result.url, path: req.file.path, slug: slugify(req.body.name) }).save()

        return res.status(201).json({
            message: 'created new product successfully',
            product
        })
    }
    catch (err) {
        return res.status(500).json(
            {
                message: `could not uplad a file ${req.file.originalname} ${err}`
            }
        )
    }
}

const isExistImage = async (req, res, next) => {
    const { name } = req.body;

    const foundProduct = await Product.findOne({ slug: slugify(name) })

    if (foundProduct) {

        fs.unlinkSync(req.file.path)
        return res.status(400).json(
            {
                message: 'product already exists',
                success: false
            }
        )
    }

    next()
}

const getProduct = async (req, res) => {

    const { slug } = req.params;
    try {

        if (!slug) {
            return res.status(400).json(
                {
                    message: 'product slug is required',
                    success: false
                }
            )
        }
        const foundProduct = await Product.findOne({ slug: slug }).populate('category');

        if (!foundProduct) {
            return res.status(404).json(
                {
                    message: `product not found with such id ${id}`,
                    success: false
                }
            )
        }

        return res.status(200).json(
            {
                message: 'product found successfully',
                success: true,
                product: foundProduct
            }
        )
    }
    catch (err) {
        return res.status(500).json(
            {
                message: `could not find a product with slug name ${slug} ${err}`
            }
        )
    }
}


const getAllProduct = async (req, res) => {
    try {
        const foundProducts = await Product.find()
            .populate("category")
            .limit(12)
            .sort({ createdAt: -1 })

        return res.status(200).json(

            {
                message: 'all products found successfully',
                success: true,
                countTotal: foundProducts.length,
                products: foundProducts

            }
        )
    }
    catch (err) {
        return res.status(500).json({
            message: 'error occured',
            success: false,
            error: err.message
        })
    }
}

const getProductImage = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json(
                {
                    message: 'product id is required to get its images',
                    success: false
                }
            )
        }

        const url = await Product.findById(req.params.id).select('image')

        if (url == null) {
            return res.status(400).json(
                {
                    message: 'no image for the product available',
                    success: false
                }
            )
        }


        const image = url.image
        res.status(200).json(
            {
                message: `image of id ${req.params.id} found successfully`,
                success: true,
                image
            }
        )
    }
    catch (err) {
        return res.status(500).json(
            {
                message: 'image not found',
                success: false,
                error: err.message
            }
        )
    }

}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: 'id is required to update the product',
                success: false
            })
        }

        const { name,
            description,
            price,
            category,
            quantity,
            shipping } = req.body


        if (req.file === undefined) {
            return res.status(400).json(
                {
                    message: 'please upload a file'
                }
            )
        }

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                message: 'all fields are required'
            })
        }

        const foundProduct = await Product.findById(id)

        if (!foundProduct) {
            return res.status(404).json(
                {
                    message: `no product found with such id ${id}`,
                    success: false
                }
            )
        }

        console.log(foundProduct)
        fs.unlinkSync(foundProduct?.path)
        const result = await updatePhoto(foundProduct.image, req.file)

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            ...req.body,
            path: req.file.path,
            image: result.url,
            slug: slugify(req.body.name)
        },
            {
                new: true
            })

        return res.status(201).json(
            {
                message: 'product updated successfully',
                success: true,
                updatedProduct
            }
        )


    }
    catch (err) {
        return res.status(500).json(
            {
                message: `could not update the product`,
                error: err.message
            }
        )
    }
}

const deleteProduct = async (req, res) => {

    const { id } = req.params

    try {

        if (!id) {
            return res.status(400).json(
                {
                    message: 'id is required to delete the product',
                    success: false
                }
            )
        }

        const foundProduct = await Product.findById(id)

        if (!foundProduct) {
            return res.status(404).json(
                {
                    message: `no such product found with id ${id}`,
                    success: false
                }
            )
        }

        fs.unlinkSync(foundProduct?.path)

        const public_id = foundProduct.image.split('/').pop().split('.')[0];
        console.log(public_id)

        await destroy(public_id)

        const deletedProduct = await Product.findByIdAndDelete(id).then(deletedProduct => deletedProduct).catch(err => {
            console.log(err)
            return res.status(400).json(
                {
                    message: 'product not deleted',
                    success: false
                }
            )
        })

        return res.status(200).json(
            {
                message: 'product deleted successfully',
                success: true
            }
        )



    }
    catch (err) {
        console.log(err)
        return res.status(500).json(
            {
                message: err.message,
                success: false
            }
        )
    }
}

const filterProduct = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {}
        if (checked.length > 0) {
            args.category = checked
        }
        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }
        }

        const filteredProduct = await Product.find({ ...args })

        return res.status(200).json(
            {
                message: 'product filtered out based on search query',
                success: true,
                products: filteredProduct
            }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(
            {
                message: 'something went wrong',
                success: false,
                error: err.message
            }
        )
    }
}

const totalProductCount = async (req, res) => {

    try {
        const totalCount = await Product.find().estimatedDocumentCount()

        return res.status(200).json(
            {
                message: 'Product counted successfully',
                success: true,
                total: totalCount
            }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(
            {
                message: 'something went wrong',
                success: false,
                error: err.message
            }
        )
    }
}

const paginatedProductResult = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const perPage = 3;
        const count = await Product.countDocuments();
        const totalPages = Math.ceil(count / perPage);

        if(page > totalPages){
            return res.status(404).json(
                {
                    message : 'page not found',
                    success : false
                }
            )
        }

        const products = await Product.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })

        return res.status(200).json(
            {
                message : 'product filtered through the pages',
                success : true,
                products
            }
        )


    }
    catch (err) {
        console.log(err)
        return res.status(500).json(
            {
                message: 'something went wrong',
                success: false,
                error: err.message
            }
        )
    }
}

export {
    createProduct,
    getProduct,
    getAllProduct,
    getProductImage,
    isExistImage,
    updateProduct,
    deleteProduct,
    filterProduct,
    totalProductCount,
    paginatedProductResult
}