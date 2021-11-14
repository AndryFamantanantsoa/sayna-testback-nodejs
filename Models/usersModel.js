const mongoose = require("mongoose");
 
// create an schema
var userSchema = mongoose.Schema({
            firtname:{
                type: String,
                required: true,
                maxlength: 100
            } ,
            lastname: {
                type: String,
                required: true,
                maxlength: 100
            },
            date_naissance: {
                type: Date,
                required: true
                
            },
            sexe: {
                type: String,
                required: true,
                maxlength: 30
            },
            password:{
                type: String,
                required: true,
                minlength: 8
            },
            email:{
                type: String,
                required: true,
                trim: true,
                unique: 1
            },
            token:{
                type: String
            },
            created_at: {
                type: Date,
                default: Date.now
            }
        });
 
var userModel=mongoose.model('users',userSchema);
 
module.exports = userModel;