const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');
const _jwt = require('../helpers/jwt.helper');
const cloudinary = require('../utils/cloudinary');

module.exports.register = async (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    let arrError = [];
    if(!email) arrError.push('Email is required!');
    if(!password) arrError.push('Password is required!');
    if(!email || !password) {
        let data = {
            "success": false,
            "errors": arrError,
            "status": 422
        }
        return res.status(422).json(data);
    } else {
        let checkEmail = await userModel.findOne({email: email});
        if(checkEmail) {
            arrError.push('Email already exists')
            let data = {
                "success": false,
                "errors": arrError,
                "status": 409
            }
            return res.status(409).json(data);
        }
    }
    let userNew = new userModel({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
    });  
    let saveUser = userNew.save();
    saveUser.then(resolve => {
        let data = {
            "success": true,                
            "data": {
                "firstname": firstname,
                "lastname": lastname,
                "email": email,                                   
            },
            "status": 200
        }
        return res.status(200).json(data);
    })
}

module.exports.login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let arrError = [];
    if(!email) arrError.push('Email is required!');
    if(!password) arrError.push('Password is required!');
    if(!email || !password) {
        let data = {
            "success": false,
            "errors": arrError,
            "status": 422
        }
        return res.status(422).json(data);
    }
    let user = await userModel.findOne({email: email, password: password});
    if(!user) {
        arrError.push('Email or password is not correct');
        let data = {
            "success": false,
            "errors": arrError,
            "status": 422
        }
        return res.status(422).json(data);
    }
    let token = _jwt.generateToken({email: user.email, role: user._role});
    let data = {
        "success": true,
        "data": {
            "access_token": token,
            "token_type": "Bearer"
        },
        "status": 200
    }
    return res.status(200).json(data);
}

module.exports.logout = (req, res) => {
    let data = {
        "success": true,          
        "status": 200
    }
    return res.status(200).json(data);
}

module.exports.profileGet = async (req, res) => {
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
    let profile = await userModel.findOne({email: email}).populate('_role');  
    let data = {
        "success": true,
        "data": {
            "id": profile._id,
            "firstname": profile.firstname,
            "lastname": profile.lastname,
            "email": profile.email,
            "image": profile.image,
            "role": {
                id: profile._role ? profile._role._id : '',
                name: profile._role ? profile._role.name : '',
            }
        },
        "status": 200
    }
    return res.send(data)
}
module.exports.profilePut = async (req, res) => {
    let image = '';
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let id = req.body.id;    
    if(req.files.length > 0) {
        try {
            const result = await cloudinary.uploader.upload(req.files[0].path);   
            image = result.secure_url;
        }
        catch (err) {
            console.log(err);
        }
    } else {
        image = 'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png'
    } 
    let objUpdate = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        image: image
    }
    let update = await userModel.findByIdAndUpdate(id, objUpdate, {new: true});
    let data = {
        "success": true,
        "data": {
            profile: update
        },
        "status": 200
    }   
    return res.json(data)
}