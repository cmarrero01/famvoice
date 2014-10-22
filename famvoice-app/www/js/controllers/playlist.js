/**
 * Play list controller
 *
 * @module PlaylistsCtrl
 * @author Claudio A. Marrero
 * @class famvoice.controllers
 */

app.controller('PlaylistsCtrl', [

	'$scope',
	'$account',
	'$socket',
	'$ionicModal',

	function($scope, $account, $socket, $ionicModal) {

		var playlists = [];

		/**
	    * Wait for login for get the list of playlists.
	    *
	    * @method OnPlaylists
	    */
		$scope.$watch($account.isLogged, function (value, oldValue) {
		    if(!value) {
		    	return;
		    }
		    
			$scope.userId = $account.getUserId();
		    $socket.emit('playlists:get',{token: $account.token(), limit: 25, skip:0},OnPlaylists);

		}, true);
		
		function parseList(results){
			var res = [];
			for(var r in results){
				results[r].url = 'http://192.168.0.2:8080/record/'+$scope.userId+"/"+results[r]._id+"/"+results[r].file;
				res[results[r]._id] = results[r];
			}
			return res;
		}

		/**
	    * Callback for playlist get.
	    *
	    * @method OnPlaylists
	    */
		function OnPlaylists(data){
			if(data.code != 200){
				return;
			}
			playlists = parseList(data.result);
			$scope.playlists = data.result;
		}

		

		$scope.play = function(recordId){
			$scope.audioPlay = playlists[recordId].url;

			$ionicModal.fromTemplateUrl('templates/records/play.html', {
		      scope: $scope,
		      animation: 'slide-in-up'
		    }).then(function(modal) {
		      $scope.modal = modal;
		      $scope.modal.show();
		    });

			
		};
}])

.controller('PlaylistCtrl', [

	'$scope', 
	'$stateParams',
	'$account',
	'$socket',

	function($scope, $stateParams, $account, $socket) {

}]);
