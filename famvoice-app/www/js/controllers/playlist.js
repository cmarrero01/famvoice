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

	function($scope, $account, $socket) {

		/**
	    * Wait for login for get the list of playlists.
	    *
	    * @method OnPlaylists
	    */
		$scope.$watch($account.isLogged, function (value, oldValue) {
		    if(!value) {
		    	return;
		    }
		    $socket.emit('playlists:get',{token: $account.token(), limit: 25, skip:0},OnPlaylists);
		}, true);

		/**
	    * Callback for playlist get.
	    *
	    * @method OnPlaylists
	    */
		function OnPlaylists(data){
			
			if(data.code != 200){
				return;
			}

			$scope.playlists = data.result;
		};

		$scope.record = function(){
			console.log('test');
		};
}])

.controller('PlaylistCtrl', [

	'$scope', 
	'$stateParams',
	'$account',
	'$socket',

	function($scope, $stateParams, $account, $socket) {

}]);
