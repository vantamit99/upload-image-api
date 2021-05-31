const _jwt = require('../helpers/jwt.helper');
const listUploadModel = require('../models/listUpload.model');
const userModel = require('../models/user.model');

module.exports.manager = async (req, res) => {
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
    let user = await userModel.findOne({email: email});
    let userId = user._id;
    let listUpload = await listUploadModel.find({_user: userId}).populate('_upload');   
    let data = {
        "success": true,
        "data": {
            list_upload: listUpload
        },
        "status": 200
    }
    return res.status(200).json(data);
}
