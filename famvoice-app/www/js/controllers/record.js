/**
 * Record controller
 *
 * @module RecordCtrl
 * @author Claudio A. Marrero
 * @class famvoice.controllers
 */

app.controller('RecordCtrl', [

	'$scope',
	'$account',
	'$socket',

	function($scope, $account, $socket) {

		$scope.record = {
			tags:[],
			text:"",
			name:""
		};

		$scope.startRecord = function(){
			console.log('Start Record');
		};

		$scope.stopRecord = function(){
			console.log('Stop Record');
		};

		$scope.saveRecord = function(){
			console.log($scope.record);
		}
		
}]);