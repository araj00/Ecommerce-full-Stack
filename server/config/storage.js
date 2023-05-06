import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});



export const uploads = (file) => {
    return new Promise((resolve,reject) => {
        cloudinary.uploader.upload(file.path,
            {
                folder: 'ecommerce',
                allowed_formats: ['jpg', 'png','jpeg'],
                transformation: [{ width: 500, height: 500, crop: 'limit' }],
                resource_type : "auto"
              },
            (error,result) => {
                if(error){
                    console.log(error)
                    reject(error)
                }
            resolve({
                url : result?.secure_url,
                id : result?.public_id
            })
        })
    })
}



export const updatePhoto = async(url,file) => {

  if (url) {
    const public_id = url.split("/").pop().split(".")[0];;
    console.log(public_id)
    await cloudinary.uploader.destroy(`ecommerce/${public_id}`, function(error, result) {
      if (error) {
        console.log('Error deleting image:', error);
      } else {
        console.log('Image deleted successfully:', result);
      }
    })
   return new Promise((resolve,reject) => {
    cloudinary.uploader.upload(file.path,
          {
              folder: 'ecommerce',
              allowed_formats: ['jpg', 'png','jpeg'],
              transformation: [{ width: 500, height: 500, crop: 'limit' }],
              resource_type : "auto"
            },
          (error,result) => {
              if(error){
                  console.log(error)
                  reject(error)
              }
          resolve({
              url : result?.secure_url,
              id : result?.public_id
          })
      })
  })
    
  } else {
    res.status(400).send('url is not provided of Cloudinary image URL');
  }
}

export const destroy = async(public_id) =>{ 
    
    await cloudinary.uploader.destroy(`ecommerce/${public_id}`, function(error, result) {
    if (error) {
      console.log('Error deleting image:', error);
    } else {
      console.log('Image deleted successfully:', result);
    }
  })
}