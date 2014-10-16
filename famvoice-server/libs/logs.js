/**
* Logs Library, this library doesnt use for the moment, but is builded to print debugs more confordable.
*
* @module _famvoice
* @submodule logs
* @author Claudio A. Marrero
* @class _famvoice.logs
*/
'use strict';
module.exports = function(params){

	if(!params.famvoice){
		return;
	}
	
	var Logs = (function(){
		
		/**
		* Logs stuff for debug
		*
		* @method log
		* @param msg {String}
		* @return {String} msg
		*/
		function log(msg){
			if(params.debug)console.log("\x1b[0m",msg,"\x1b[0m");
			return msg;
		}

		/**
		* Logs Info stuff for debug
		*
		* @method info
		* @param msg {String}
		* @return {String} msg
		*/
		function info(msg){
			if(params.debug)console.log("\x1b[35m",msg,"\x1b[0m");
			return msg;
		}

		/**
		* Logs Error stuff for debug method Info
		*
		* @method error
		* @param msg {String}
		* @return {String} msg
		*/
		function error(msg){
			if(params.debug)console.log("\x1b[31m",msg,"\x1b[0m");
			return msg;
		}
		
		return {
			log:log,
			info:info,
			error:error
		};
	})();

	return Logs;
		
};