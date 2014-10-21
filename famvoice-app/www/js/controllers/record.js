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
	'$location',
	'$ionicLoading',
	'$ionicModal',

	function($scope, $account, $socket, $record, $location, $ionicLoading, $ionicModal) {

		$scope.record = {
			tags:[],
			text:"",
			name:""
		};

		$scope.startRecordBtn = true;
		$scope.stopRecordBtn = false;
		$scope.saveRecordBtn = false;
		$scope.playRecordBtn = false;

		$ionicModal.fromTemplateUrl('templates/records/save.html', {
	      scope: $scope,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.modal = modal;
	    });

	    $scope.closeModal = function() {
	      $scope.modal.hide();
	    };

	    function OnStart(){
	    	$scope.startRecordBtn = false;
			$scope.stopRecordBtn = true;
	    }

	    function OnStop(){
	    	$scope.startRecordBtn = false;
	    	$scope.stopRecordBtn = false;
	    	$scope.playRecordBtn = true;
	    }

		function OnSaved(result){
			
			$ionicLoading.hide();

			if(result.code != 200){
				return;
			}

	        $scope.modal.show();
	        $scope.startRecordBtn = true;
			$scope.stopRecordBtn = false;
			$scope.saveRecordBtn = false;
			$scope.playRecordBtn = false;
		}

		$scope.startRecord = function(){
			OnStart();
			$record.start();
		};

		$scope.stopRecord = function(){
			OnStop();
			$record.stop();
		};

		$scope.playRecord = function(){
			$record.play();
		}

		$scope.showSaveForm = function(){
			$scope.saveRecordBtn = true;
		}

		$scope.recordAgain = function(){
			$scope.startRecordBtn = true;
			$scope.stopRecordBtn = false;
			$scope.playRecordBtn = false;
			$scope.saveRecordBtn = false;
		}

		$scope.saveRecord = function(){		
			$ionicLoading.show({
		      template: 'Loading...'
		    });
		    console.log('SAVE RECORD');
		    console.log($scope.record);
			$record.save(OnSaved,$scope.record);
		}
		
}]);
