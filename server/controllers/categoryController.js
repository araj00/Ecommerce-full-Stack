import slugify from "slugify"
import Category from "../models/categoryModel.js"

const errorMessage = (err,res) => {
    console.log(err.message)
     return res.status(500).json(
        {
            message : err.message,
            success : false
        }
    )
}


const addCategory = async(req,res) => {
    const {name} = req.body
    try{
    if(!name){
        return res.status(401).json(
            {
                message : 'category name is required'
            }
        )
    }

    const existedCategory = await Category.findOne({name})
    if(existedCategory){
        return res.status(409).json(
            {
                message : 'category already exists',
                success : false
            }
        )
    }

    
       const newCategory = await new Category({
        name
        }).save()
       
       return res.status(201).json(
        {
            message : 'new category created successfully',
            success : true,
            newCategory
        }
       )
    }
    catch(err){
        errorMessage(err,res)
}
}

const updateCategory = async(req,res) => {
    const {id} = req.params

    const {name} = req.body

    try{

    if(!id){
        return res.status(400).json(
            {
                message : 'id is required to update the category'
            }
        )
    }
    const foundCategory = await Category.findOne({name}) 
    
    if(foundCategory){
        return res.status(200).json({
            message : 'category already exist '
        })
    }
    const updatedCategory = await Category.findByIdAndUpdate(id,{
          name,slug:slugify(name)
    },{
        new : true
    }).catch(err => {throw new Error(err)})

    if(!updatedCategory){
        return res.status(200).json(
            {
                message : `id not found with ${id}`,
                success : false
            }
        )
    }

    return res.status(200).json(
        {
            message : 'updated document successfully',
            success : true,
            updatedCategory
        }
    )
    }
    catch(err){
        errorMessage(err,res)
    }

}

const getCategory = async(req,res) => {
    const {id} = req.params
    
    try{
        if(!id){
            return res.status(400).json(
                {
                    message : 'id is required to update the category'
                }
            )
        }


        const foundCategory = await Category.findById(id) 
    
        if(!foundCategory){
            return res.status(200).json({
                message : 'not found any such category'
            })
        }     

        return res.status(200).json({
            message : 'found the category successfully',
            success : true,
            foundCategory
        })
    }
    catch(err){
          errorMessage(err,res)
    }
    
}

const getAllCategories = async(req,res) => {

    try{
      const allCategories = await Category.find()

      if(!allCategories.length){
        return res.status(200).json(
            {
                message : 'no any category found',
                success : true
            }
        )
      }
      return res.status(200).json({
        message :'all categories fetched successfully',
        success : true,
        allCategories
      })
    }
    catch(err){
         errorMessage(err,res)
    }
}

const deleteCategory = async(req,res) => {
    try{
       const {id} = req.params

       if(!id){
        return res.status(400).json(
            {
                message : 'id is required to delete the category'
            }
        )
       }

       const deletedCategory = await Category.findByIdAndDelete(id).then(dltdoc => dltdoc)
                                                                   .catch(err => {
                                                                    throw new Error(err)
                                                                   })
                                             
       if(!deletedCategory){
        return res.status(404).json(
            {
                message : `no category with id ${id}`
            }
        )
       }                                                                   
       return res.status(200).json({
           message : `successfully deleted the category with id ${id}`,
           success : true,
           deletedCategory
       })
    }
    catch(err){
        errorMessage(err,res)
    }
}

export {
    addCategory,
    deleteCategory,
    updateCategory,
    getCategory,
    getAllCategories
}