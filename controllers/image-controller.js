const Image = require('../models/Image');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadImageController = async(req, res) => {
    try {

        // check if file is missing in req object
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image.'
            })
        }

        // upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path)

        // store the image url and public id along with the uploaded user id
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })
        await newlyUploadedImage.save()

        // delete the file from local storage
        fs.unlinkSync(req.file.path);
        
        res.status(201).json({
            success: true,
            message: 'Image uploaded',
            image: newlyUploadedImage,
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        })
    }
}

const fetchImagesController = async(req, res) => {
    try {
        const images = await Image.find({});
        
        if(images) {
            res.status(200).json({
                success: true,
                data: images
            })
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        })
    }
}

const deleteImageController = async(req, res) => {
    try {
        const getCurrentImageIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if(!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // check if this image is uploaded by the current user trying to delete this image
        if(image.upLoadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete thi image'
            })
        }

        // delete this image first from your cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        // delete this image from mongodb
        await Image.findByIdAndUpdate(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: 'Image deleted successful'
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        })
    }
}
module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController,
}