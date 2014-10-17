
/**
 * playlist Model Schema
 * @module _Famvoice
 * @submodule playlist_model
 * @author Claudio A. Marrero
 * @class _Famvoice.playlist_model
 */
'use strict';
module.exports = function(params){

    if(!params.Famvoice){
        return;
    }

    /**
    * A Schema for playlist
    * @property playlistSchema
    * @type {params.mongoose.Schema}
    * @private
    */
    var playlistSchema = new params.mongoose.Schema({
        user:{ type: params.mongoose.Schema.Types.ObjectId, ref:'user'},
        title:{ type: String},
        text:{ type: String},
        file:{ type: String}
    });

    playlistSchema.index({text: "text", title: "text"});
    
    /**
    * The model for playlist schema
    * @property playlist
    * @type {params.mongoose.model}
    */
    var playlist = params.mongoose.model('playlist', playlistSchema, 'playlist');

    return playlist;
};