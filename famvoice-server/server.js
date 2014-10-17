/**
* Main Class Famvoice
* @module _Famvoice
* @author Claudio A. Marrero
* @class _Famvoice
* @main Famvoice
*/

var Debug = require('./config/debug.js')(null);

'use strict';
var Famvoice = (function(){

  	/**
	* Driver for mongodb
	* @property _mongoose
	* @type {Object}
	* @private
	*/
	var _mongoose = require('mongoose');

	/**
	* Validate module for schems of mongoose
	* @property _validate
	* @type {Object}
	* @private
	*/
	var _validate = require('mongoose-validate');

	/**
	* Crypo library for encrypt a lot of stuff
	* @property _bCrypt
	* @type {Object}
	* @private
	*/
	var _bCrypt = require('bcrypt-nodejs');

	/**
	* File Helper module
	* @property _fs
	* @type {Object}
	* @private
	*/
	var _fs = require('fs');

	/**
	* Mailer module, usefull for send emails only
	* @property _eMails
	* @type {Object}
	* @private
	*/
	var _eMails = require('mailer');

	/**
	* Http helper library to make request with http protocol
	* @property _request
	* @type {Object}
	* @private
	*/
	var _request = require('request');

	/**
	* A list of modules that need to load before everything
	* @property _InitLoad
	* @type {Object}
	* @private
	*/
	var _InitLoad = ['./config/'];

	/**
	* A main object that have all modules, controlers, models, etc.
	* @property _Famvoice
	* @type {Object}
	* @private
	*/
	var _Famvoice = null;

	/**
	* Crypo module to encrypt and decrypt request to coinbase and other stuff
	*
	* @property _crypto
	* @type {Object}
	* @private
	*/
	var _crypto = require('crypto');

	/**
	* Module to mix templagte engine with express
	*
	* @property _cons
	* @type {Object}
	* @private
	*/
	var _cons = require('consolidate');

	/**
	* Express module to public some endpoints from http
	*
	* @property _express
	* @type {Object}
	* @private
	*/
	var _express = require('express');

	/**
	* Express module to public some endpoints from http
	*
	* @property _express
	* @type {Object}
	* @private
	*/
	var _bodyParser = require('body-parser')

	/**
	* Instance of express
	*
	* @property _app
	* @type {Object}
	* @private
	*/
	var _app = _express();

	_app.engine('html', _cons.hogan);
	_app.set('view engine', 'html');
	_app.set('views', __dirname + '/tpl');
	_app.use(_bodyParser.urlencoded({ extended: false }));
	_app.use(_bodyParser.json());
	_app.use('/',_express.static('../famvoice-app/www/'));
	_app.listen(8080);

	/**
	* This method make the initialization of all Famvoice server, 
	* Makes a load of all modules and shot the connection to mongodb
	*
	* @method init
	* @example Famvoice.init();
	*/
	function init(){

		var _io = require('socket.io')();

		_io.use(function(socket, next) {
			next();
		});

		_io.listen(9564);

		var _params = {
			mongoose:_mongoose,
			io:_io,
			validate:_validate,
			bCrypt:_bCrypt,
			fs:_fs,
			emails:_eMails,
			request:_request,
			load:_InitLoad,
			crypto:_crypto,
			app:_app,
			express:_express,
			debug:Debug.debug
		};

		var _loader = require('./load.js')(_params);
		_Famvoice = _loader.init();
		_Famvoice.deph = _params;

		connect();
	}

	/**
	* Listen all sockets, and make the real magician stuff, 
	*
	* @method listener
	* @example listener();
	*/
	function listener(){
		_Famvoice.deph.io.on('connection',function(socket){
			//Put here all that you want listiner. 
			_Famvoice.user.on(socket);
			_Famvoice.playlists.on(socket);
		});
	}

	/**
	* Make a conexion to the database, 
	*
	* @method connect
	* @example connect();
	*/
	function connect(){

		if(!_Famvoice){
			console.log('_Famvoice is null');
			return;
		}

		_mongoose.connect(_Famvoice.database.servers.connectString,_Famvoice.database.db,function(err) {
			if(err)throw err;
			listener();
		});

	}

	return {
		init:init
	};
	
})();

Famvoice.init();