/**
* A list of URL for diferentes actions, base url, coinbase urls, etc
*
* @module _Famvoice
* @submodule endpoints
* @author Claudio A. Marrero
* @class _Famvoice.endpoints
*/
'use strict';
module.exports = function(params){

	var Endpoints = (function(){
		return {
			base:'http://127.0.0.1',
			ip:'127.0.0.1',
			port:'9564',
			tmpFiles:"./tmp_files"
		};
	})();
	
	return Endpoints;
};