const cloudinary = require('../utils/cloudinary');
const uploadModel = require('../models/upload.model');
const userModel = require('../models/user.model');
const listUploadModel = require('../models/listUpload.model');
const _jwt = require('../helpers/jwt.helper');

module.exports.post = async (req, res) => {        
    let checkHeaders = req.headers['authorization'];
    let email = '';
    if(checkHeaders) {
        let token = checkHeaders.split(' ')[1];
        try {
            let verifyToken = _jwt.verifyToken(token, 'secret');
            email = verifyToken.email;           
        } catch(err) {
            throw err;
        }        
    } else {
        let data = {
            "success": false,
            "errors": ["Authorizaion"],
            "status": 401
        }
        return res.status(401).json(data)
    }
    try {
        const result = await cloudinary.uploader.upload(req.files[0].path);    
        let uploadNew = new uploadModel({            
            cloudinary_id: result.public_id,
            image: result.secure_url,
            title: result.original_filename,
            created_at: result.created_at,
            isLike: false
        });        
        let upload = await uploadNew.save();        
        let user = await userModel.findOne({email: email});
        let idUpload = upload._id;
        let idUser = user._id;
        let listUploadNew = new listUploadModel({
            _user: idUser,
            _upload: idUpload
        });
        await listUploadNew.save();       
        const data = {
            "success": true,
            "data": {
                upload: upload
            },
            "status": 200
        }
        return res.json(data);
    }
    catch (err) {
        console.log(err);
    }
}
module.exports.update = async (req, res) => {
    let id = req.body.id;
    let findId = await listUploadModel.findById(id).populate('_upload');
    let update = await uploadModel.findByIdAndUpdate(findId._upload._id, {isLike: true}, {new: true});
    let findAfterUpdate = await listUploadModel.findById(id).populate('_upload');
    let data = {
        "success": true,
        "data": {
            listUpload: findAfterUpdate
        },
        "status": 200
    }
    return res.json(data);
}
module.exports.delete = async (req, res) => {
    let id = req.params['id'];
    let findListUpload = await listUploadModel.findById(id).populate('_upload');
    await uploadModel.findByIdAndDelete(findListUpload._upload._id);
    await listUploadModel.findByIdAndDelete(id);
    let data = {
        "success": true,
        "status": 200
    }
    return res.json(data);
}