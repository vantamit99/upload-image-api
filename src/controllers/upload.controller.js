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
        console.log(upload)
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