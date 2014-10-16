/**
 * Load methods
 * @module _famvoice
 * @submodule load
 * @author Claudio A. Marrero
 * @class _famvoice.load
 */
  'use strict';
  module.exports = function(params){

	var Loader = (function(){

		/**
		* Total of the initialization modules
		*
		* @property _totalInitModules
		* @private
		*/
		var _totalInitModules = 0;

		/**
		* Total of the initialization files
		*
		* @property _totalInitFiles
		* @private
		*/
		var _totalInitFiles = 0;

		/**
		* Total of all modules before loaded
		*
		* @property _totalModules
		* @private
		*/
		var _totalModules = 0;

		/**
		* Total of files that I want to load
		*
		* @property _totalFiles
		* @private
		*/
		var _totalFiles = 0;

		/**
		* Total files loaded
		*
		* @property _totalFilesLoaded
		* @private
		*/
		var _totalFilesLoaded = 0;

		/**
		* Total Modules loaded
		*
		* @property _totalModulesLoaded
		* @private
		*/
		var _totalModulesLoaded = 0;

		/**
		* This method make the initialization of 
		* each module in load params.
		*
		* @method init
		* @example 
		* var _loader = require('./load.js')(_params);
		* _loader.init();
		*/
		function Init(){
			
			var modules = params.load;
			
			if(!modules.length){
				return;
			}

			_totalInitModules = modules.length;

			for(var i = 0; i < modules.length; i++){
				load(modules[i],params,true);	
			}
			
			loadAll(params);
			
			var famvoice = loadAll(params);

			console.log("\x1b[31m",'************* Stats of loading modules **************');
			console.log('Total initialization Modules: ',_totalInitModules);
			console.log('Total initialization Files: ',_totalInitFiles);
			console.log('Total Modules: ',_totalModules);
			console.log('Total Files: ',_totalFiles / 2);
			console.log('Total loaded Modules: ',_totalModulesLoaded);
			console.log('Total loaded Files: ',_totalFilesLoaded);
			console.log('************* End of Stats of Loader *****************',"\x1b[0m");

			return famvoice;
		}

		/**
		* Walk into the folder and require each file making a exports with the name
		* of the file.
		*
		* @method load
		* @param path {String} path of the module that you want to load
		* @param relation {Object} a list of dependencies and modules loaded before
		* @param init {bool} flag to know if we loading a init modules or others.
		*/
		function load(path,relation,init){
			var dir = params.fs.readdirSync(path);
			
			if(init){
				_totalInitFiles+= dir.length;
			}else{
				_totalFiles+= dir.length;
			}

			dir.forEach(function(file) {
				var moduleName = file.substr(0, file.indexOf('.'));
				exports[moduleName] = require('./' + path + moduleName)(relation);
			});
		}

		/**
		* Load all files that have into the config/loader.js file
		*
		* @method loadAll
		* @param relation {Object} Dependencies and modules loaded before than this.
		*/
		function loadAll(relation){	

			if(!exports.loader){
				return;
			}

			if(!exports.loader.length){
				return;
			}

			_totalModules = exports.loader.length;

			for(var i = 0; i < exports.loader.length; i++){
				load(exports.loader[i],relation,false);	
			}

			_totalModulesLoaded = exports.loader.length;
			_totalFilesLoaded = Object.keys(exports).length;

			return params.Famvoice = exports;
		}

		return {
			init:Init
		}

	})();

	return Loader;
	
};