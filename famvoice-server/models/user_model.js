
/**
 * User Model Schema
 * @module _Famvoice
 * @submodule user_model
 * @author Claudio A. Marrero
 * @class _Famvoice.user_model
 */
'use strict';
module.exports = function(params){

    if(!params.Famvoice){
        return;
    }

    /**
    * A Schema for User
    * @property userSchema
    * @type {params.mongoose.Schema}
    * @private
    */
    var userSchema = new params.mongoose.Schema({
        credentials:{type: String, required: true, unique: true},
        name:{ type: String}
    });

    userSchema.index({credentials: 1});
    
    /**
    * The model for user schema
    * @property User
    * @type {params.mongoose.model}
    */
    var User = params.mongoose.model('user', userSchema, 'user');

    return User;
};