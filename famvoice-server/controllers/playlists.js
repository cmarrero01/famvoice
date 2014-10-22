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

		function init(){
			params.app.get('/record/:userId/:playListId/:recordName',play);
		}

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
		* Play streaming record
		*
		* @method play
		* @param req {Object}
		* @param res {Object} Buffer
		*/
		function play(req,res){
			
			var userId = req.params.userId;
			var playListId = req.params.playListId;
			var recordName = req.params.recordName;

			if(!userId || !playListId || !recordName){
				res.end();
				return;
			}

			var path = "./records/"+recordName;

			if (!params.fs.existsSync(path)) {
				res.end();
			    return;
			}
			
			/*var playlistCb = function(err,playDoc){
				if(err || !playDoc){
					res.end();
					return;
				}
				var fileName = playDoc.file;
			};
			params.Famvoice.playlist_model.findById(playListId,playlistCb);*/

			res.setHeader("content-type", "audio/mpeg");
    		params.fs.createReadStream(path).pipe(res);

    		console.log('Streaming'+recordName);
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

			// if(!params.Famvoice.user.validateSession(socket,token)){
			// 	if(params.debug)console.log('Error geting playlist, token error: ', token);
			// 	res.code = 500;
			// 	res.result = {error:"Token is not valid"};
			// 	params.Famvoice.user.response(socket,'playlists:file',fn,res);
			// 	return;
			// }

			var binaryData  =   new Buffer(data.file, 'base64').toString('binary');
			
			var now = new Date().getTime();
			var recordName = socket.user._id+now+data.name;

			params.fs.writeFile("./records/"+recordName, binaryData, "binary", function (err) {
			    
			    if(err){
			    	if(params.debug)console.log('Error saving the new record');
			    	params.Famvoice.user.response(socket,'playlists:file',fn,res);
			    	return;
			    }

			    saveRecord(socket,recordName,data.info);

			    res.code = 200;
			    res.result = {};
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
		function saveRecord(socket,name,info){
			
			var playlistSave = {
				user: socket.user._id,
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
			on:on,
			init:init
		};
	})();

	Playlists.init();

	return Playlists;
		
};