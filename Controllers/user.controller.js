const Users = require('../models/usersModel.js');
const jwt = require('jsonwebtoken')
const secretConfig = 'api-key-secret'
// login page
exports.login = (req, res) => {
    // Validate request
    if(!req.body.email || !req.body.password) {
        return res.status(401).send({
            error:true,
            message: "l'email/password est manquant"
        });
    }

    Users.find(req.body.email, req.body.password)
    .then(user => {
        if(!user) {
            return res.status(401).send({
                error:true,
                message: "Votre email ou password est érroné "
            });            
        }
        return res.status(200).send({
            error:false,
            message:'L\'utilisateur a été authentifié avec succès',
            tokens:{
                token:'xxxxxx',
                refreshToken:'xxxxxxxxxxxx',
                createdAt:'xxxxxxxxxxx'
            }
        });
    })
};

// register page
exports.register = (req, res) => {
    if(!req.body.email || !req.body.password || !req.body.firtname || !req.body.lastname || !req.body.date_naissance || !req.body.sexe) {
        return res.status(401).send({
            error:true,
            message: "L'une ou plusieurs des données obligatoires sont manquantes"
        });
    }

    //check si email exist
    let email = req.body.email
    const existMail = Users.findOne({email})
    if(existMail){
        return res.status(401).send({
            error:true,
            message: "Votre email existe déjà"
        });
    }

    const user = new Users({
        firtname: req.body.firtname,
        lastname: req.body.lastname,
        date_naissance: req.body.date_naissance,
        sexe: req.body.sexe,
        password: bcrypt.hash(req.body.password,10),
        email: req.body.email,
        created_at: Date()
    });
    const token = jwt.sign(
        {email:req.body.email},
        secretConfig,
        {expiresIn:86400} //24 heures
    )
    user.token = token
    user.save()
    .then(data => { 
        res.status(201).send({
            error:false,
            message:'L\'utilisateur a bien été céer avec succès',
            tokens:{
                token:data.token,
                refreshToken:'xxxxxxxxxxxx',
                createdAt:data.created_at
            }
        });
    }).catch(err => {
        res.status(401).send({
            error:true,
            message: err.message || "L'un des données obligatoires ne sont pas conformes"
        });
    });
};

// get user
exports.get = (req, res) => {

    jwt.verify(req.params.token, secretConfig, (err, decoded) =>{
        if(err.name=='TokenExpiredError'){
            return res.status(401).send({
                error:true,
                message: "Votre token n'est plus valide, veillez réinitialiser"
            });
        }

        if(err.name=='JsonWebTokenError'){
            return res.status(401).send({
                error:true,
                message: "Le token envoyé n'est pas conforme"
            });
        }
    })

    
    if(!req.params.token) {
        return res.status(401).send({
            error:true,
            message: "Aucun données n'a été envoyée"
        });
    }

    const token = req.params.token
    const existToken = Users.findOne({token})
    if(!existToken){
        return res.status(401).send({
            error:true,
            message: "Le token envoyé n'existe pas"
        });
    }
    else{
        res.status(200).send({
            error:false,
            user:{
                firtname: existToken.firtname,
                lastname: existToken.lastname,
                date_naissance: existToken.date_naissance,
                sexe: existToken.sexe,
                createdAt:existToken.created_at
            }
        });
    }
};

//update user
exports.update = (req, res) => {
    if(!(req.body.firtname && req.body.lastname && req.body.date_naissance && req.body.sexe) && !req.params.token) {
        return res.status(401).send({
            error:true,
            message: "Aucun données envoyés"
        });
    }
    jwt.verify(req.params.token, secretConfig, (err, decoded) =>{
        if(err.name=='TokenExpiredError'){
            return res.status(401).send({
                error:true,
                message: "Votre token n'est plus valide, veillez réinitialiser"
            });
        }

        if(err.name=='JsonWebTokenError'){
            return res.status(401).send({
                error:true,
                message: "Le token envoyé n'est pas conforme"
            });
        }
    })

    Users.findOneAndUpdate(req.params.token, {
        firtname: req.body.firtname,
        lastname: req.body.lastname,
        date_naissance: req.body.date_naissance,
        sexe: req.body.sexe
    })
    .then(user => {
        res.status(201).send({
            error:false,
            message:'L\'utilisateur a été modifer avec succès'
        });
    })
};

//update password user
exports.updatepwd = (req, res) => {
    if(!req.body.password && !req.params.id) {
        return res.status(401).send({
            error:true,
            message: "Aucun données envoyés"
        });
    }

    Users.findByIdAndUpdate(req.params.id, {
        password: bcrypt.hash(req.body.password,10)
    })
    .then(user => {
        res.status(201).send({
            error:false,
            message:'Le mot de passe a été modifer avec succès'
        });
    })
};

//recuperer all users
exports.findAll = (req, res) => {
    jwt.verify(req.params.token, secretConfig, (err, decoded) =>{
        if(err.name=='TokenExpiredError'){
            return res.status(401).send({
                error:true,
                message: "Votre token n'est plus valide, veillez réinitialiser"
            });
        }

        if(err.name=='JsonWebTokenError'){
            return res.status(401).send({
                error:true,
                message: "Le token envoyé n'est pas conforme"
            });
        }
    })
    Users.find()
    .then(users => {
        res.status(200).send({
            error:false,
            users:users
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Le token envoyé n'existe pas."
        });
    });
};

//user logout
exports.logout = (req, res) => {
    req.user.deleteToken(req.params.token,(err, user)=>{
        if(err) return res.status(400).send(err)

        res.status(200).send({
            error:false,
            message:'L\'utilisateur a été déconnecter avec succès'
        });
    })
};