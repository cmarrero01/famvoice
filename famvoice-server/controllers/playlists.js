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

		var sock = null;

		/**
		* Listen the user sockets events.
		*
		* @method on
		* @param socket {Object} Connection of socket.io
		*/
		function on(socket){

			sock = socket;

			socket.on('playlists:get',function(data,fn){
				get(socket,data,fn);
			});
			socket.on('playlists:file',function(data,fn){
				record(socket,data,fn);
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

		/**
		* Get file for straming
		*
		* @method stream
		* @param file {String}
		*/
		function stream(file){
			var file = params.Famvoice.fs.createReadStream("./records/"+file);
 			client.send(file); 
		}

		/**
		* Save a new record
		*
		* @method record
		* @param socket {Object}
		* @param data {Object} Buffer
		* @param fn {Object} Acknowleage
		* @async
		* @example
		* socket.emit('playlist:file',{token:THE_TOKEN,limit:25,skip:25});
		*/
		function record(socket,data,fn){

			var res = {
				code:400,
				result:null
			};

			var token = data.token;

			if(!params.Famvoice.user.validateSession(socket,token)){
				if(params.debug)console.log('Error geting playlist, token error: ', token);
				res.code = 500;
				res.result = {error:"Token is not valid"};
				params.Famvoice.user.response(socket,'playlists:file',fn,res);
				return;
			}

			var binaryData  =   new Buffer(data.file, 'base64').toString('binary');
			
			var now = new Date().getTime();
			var recordName = socket.user._id+now+data.name;

			params.fs.writeFile("./records/"+recordName, binaryData, "binary", function (err) {
			    
			    if(err){
			    	if(params.debug)console.log('Error saving the new record');
			    	params.Famvoice.user.response(socket,'playlists:file',fn,res);
			    	return;
			    }

			    saveRecord(recordName,data.info);

			    res.code = 200;
			    res.result = {};
			    console.log(res);
			    params.Famvoice.user.response(socket,'playlists:file',fn,res);
			});
		}

		/**
		* Save new record on database
		*
		* @method saveRecord
		* @param name {String}
		* @param info {Object} Info data about the file
		* @async
		*/
		function saveRecord(name,info){
			
			var playlistSave = {
				user: sock.user._id,
		        name: info.name,
		        text: info.text,
		        file: name,
		        tags: info.tags
			};

			var playlistCb = function(err,playlistDoc){
				if(err){
			    	if(params.debug)console.log('Error saving the new record');
			    	return;
			    }
			};

			params.Famvoice.playlist_model.create(playlistSave,playlistCb);
		}

		return {
			on:on
		};
	})();

	return Playlists;
		
};