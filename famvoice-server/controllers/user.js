/**
* The user controller have the login, login with facebook and register stuff, is the one of the main controllers for the app,
* 
* @module _Famvoice
* @submodule user
* @author Claudio A. Marrero
* @class _Famvoice.user
*/
'use strict';
module.exports = function(params){

	if(!params.Famvoice){
		return;
	}

	var User = (function(){

		/**
		* List users that are connected
		*
		* @property users
		*/
		var users = [];

		/**
		* Create a token with socket.id and credentials of the user
		*
		* @method createToken
		* @param socket {Object} Conexion of socket.io
		* @param credentials {String} Base64 string of user and password of the user
		* @return {string} A valid token
		* @private
		*/
		function createToken(socket,credentials){
			var token = new Buffer(socket.id+credentials).toString('base64');
			socket.token = token;
			return token;
		}

		/**
		* Validate the token, check with the server token.
		*
		* @method isTokenOk
		* @param socket {Object} Conexion of socket.io
		* @param clientToken {String} This is setting by the client
		* @return {boolean}
		* @private
		*/
		function isTokenOk(socket,clientToken){
			return (clientToken === socket.token);
		}

		/**
		* If user Loged.
		*
		* @method isUserLoged
		* @param socket {Object} Conexion of socket.io
		* @return {boolean}
		* @private
		*/
		function isUserLoged(socket){
			return (typeof socket.user !== "undefined");
		}

		/**
		* Validate connection of user.
		*
		* @method validateSession
		* @param socket {Object} Conexion of socket.io
		* @param token {String} This is the client token, is setting by the client
		* @return {boolean}
		*/
		function validateSession(socket,token){
			return (isTokenOk(socket,token) && isUserLoged(socket));
		}

		/**
		* Listen the user sockets events.
		*
		* @method on
		* @param socket {Object} Connection of socket.io
		*/
		function on(socket){
			socket.on('user:login',function(data,fn){
				login(socket,data,fn);
			});

			socket.on('user:register',function(data,fn){
				register(socket,data,fn);
			});

			socket.on('user:profile',function(data,fn){
				profile(socket,data,fn);
			});
		}

		/**
		* Login users
		*
		* @method login
		* @param socket {Object}
		* @param data {Object} Request data form the client
		* @param fn {Function} Acknowleage
		* @async
		* @example
		* socket.emit('user:login',{token:THE_TOKEN,credentials:THE_CREDENTIALS});
		*/
		function login(socket,data,fn){

			var res = {
				code:400,
				result:null
			};

			var credentials = data.credentials;
			var clientToken = data.token;

			var loginCb = function(err,userDoc){
				if(err || !userDoc){
					if(params.debug)console.log('Error in mongo or dont find user: ', userDoc, err);
					res.result = err;
					response(socket,'user:login',fn,res);
					return;
				}

				createToken(socket,userDoc.credentials);

				socket.user = userDoc;

				if(!validateSession(socket,clientToken)){
					if(params.debug)console.log('Login error, totken no valid: ', clientToken);
					res.code = 500;
					res.result = {error: 'Token Failed'};
					response(socket,'user:login',fn,res);
					return;
				}

				res.code = 200;
				res.result = userDoc;

				response(socket,'user:login',fn,res);
			};

			var query = {credentials:credentials};
			var fields = "_id credentials name";

			params.Famvoice.user_model.findOne(query,fields,loginCb);
		}

		/**
		* Register users
		*
		* @method register
		* @param socket {Object}
		* @param data {Object} Request data form the client
		* @param fn {Function} Acknowleage
		* @async
		* @example
		* socket.emit('user:register',{name:"String name",credentials:THE_CREDENTIALS});
		*/
		function register(socket,data,fn){

			var res = {
				code:400,
				result:null
			};

			var name = data.name;
			var credentials = data.credentials;

			createToken(socket,credentials);

			var userObject = {
				credentials:credentials,
				name:name
			};

			var registerCb = function(err,userDoc){
				if(err){
					if(params.debug)console.log('MOngo eror on register: ', err);
					res.result = {error:err};
					response(socket,'user:register',fn,res);
					return;
				}

				res.code = 200;
				res.result = userDoc;
				socket.user = userDoc;

				response(socket,'user:register',fn,res);
			};

			params.Famvoice.user_model.create(userObject,registerCb);
		}


		/**
		* Get Profile of 1 user
		*
		* @method profile
		* @param socket {Object}
		* @param data {Object} [token,uId] Request data form the client
		* @param fn {Function} Acknowleage
		* @async
		* @example
		* socket.emit('user:profile',{token:THE_TOKEN,uId:THE_USER_ID (optional)});
		*/
		function profile(socket,data,fn){

			var res = {
				code:400,
				result:null
			};

			var token = data.token;

			if(!validateSession(socket,token)){
				if(params.debug)console.log('Profile error session: ', token);
				res.code = 500;
				res.result = {error:"Token is not valid or user notlogout"};
				response(socket,'user:profile',fn,res);
				return;
			}

			var userId = data.uId;

			if(!userId){
				userId = socket.user._id;
			}

			var profileCb = function(err,profileDoc){
				
				if(err){
					if(params.debug)console.log('Profile DOc error: ', err);
					res.result = {error:err};
					response(socket,'user:profile',fn,res);
					return;
				}

				if(!profileDoc){
					if(params.debug)console.log('User profile, profileDoc is: ', profileDoc);
					res.result = {error:"The user does'nt exist"};
					response(socket,'user:profile',fn,res);
					return;
				}

				res.code = 200;
				res.result = profileDoc;
				response(socket,'user:profile',fn,res);
			};

			var fields = "_id name";

			params.Famvoice.user_model.findById(userId,profileCb);
		}


		/**
		* Send a response to the client
		*
		* @method response
		* @param socket {Object} COnnection of socket.io
		* @param verb {String} Verb that you whant to use if acknowleage is undefined
		* @param fn {Function} Acknowleage
		* @param res {Object} Result that you whant to sent to the client.
		* @async
		* @example
		* response(socket,'verv:someSubVerb',function(){},res);
		*/
		function response(socket,verb,fn,res){

			//Check if acknowleage is sended
			if(typeof fn === 'function'){
				fn(res);
				return;
			}

			//If Acknowleage is not sended, I emit a socket with the same verb.
			socket.emit(verb,res);
		}

		return {
			on:on,
			response:response,
			validateSession:validateSession
		};
	})();

	return User;
		
};