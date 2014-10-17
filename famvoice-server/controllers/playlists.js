/**
* The playlists.
* 
* @module _Famvoice
* @submodule Playlists
* @author Claudio A. Marrero
* @class _Famvoice.Playlists
*/
'use strict';
module.exports = function(params){

	if(!params.Famvoice){
		return;
	}

	var Playlists = (function(){

		/**
		* Listen the user sockets events.
		*
		* @method on
		* @param socket {Object} Connection of socket.io
		*/
		function on(socket){
			socket.on('playlists:get',function(data,fn){
				get(socket,data,fn);
			});
		}

		/**
		* Get a list of sounds
		*
		* @method get
		* @param socket {Object}
		* @param data {Object} [token,uId] Request data form the client
		* @param fn {Function} Acknowleage
		* @async
		* @example
		* socket.emit('playlists:get',{token:THE_TOKEN,limit:25,skip:25});
		*/
		function get(socket,data,fn){

			var res = {
				code:400,
				result:null
			};

			var token = data.token;

			if(!params.Famvoice.user.validateSession(socket,token)){
				if(params.debug)console.log('Error geting playlist, token error: ', token);
				res.code = 500;
				res.result = {error:"Token is not valid"};
				params.Famvoice.user.response(socket,'playlists:get',fn,res);
				return;
			}

			var playlistCb = function(err,playListDoc){
				
				if(err){
					if(params.debug)console.log('Profile DOc error: ', err);
					res.result = {error:err};
					params.Famvoice.user.response(socket,'playlists:get',fn,res);
					return;
				}

				res.code = 200;
				res.result = playListDoc;
				params.Famvoice.user.response(socket,'playlists:get',fn,res);
			};

			params.Famvoice.playlist_model.find({},playlistCb);
		}

		return {
			on:on
		};
	})();

	return Playlists;
		
};