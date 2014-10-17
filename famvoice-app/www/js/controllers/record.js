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
	'$record',

	function($scope, $account, $socket, $record) {

		$scope.record = {
			tags:[],
			text:"",
			name:""
		};

		$scope.startRecord = function(){
			$record.startRecord();
		};

		$scope.stopRecord = function(){
			$record.stopRecord();
		};

		$scope.saveRecord = function(){		
			var recordName = $record.getRecord();
			$socket.stream(recordName);
		}
		
}]);