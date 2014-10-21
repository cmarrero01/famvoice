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
	'$stream',

	function($scope, $account, $socket, $stream) {

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

		$scope.play = function(recordId){
			var stream = new BinaryClient('ws://192.168.1.37:9000');
			stream.on('stream', function(file, meta){ 
		        console.log('STRAMING');
		        var parts = [];

		        file.on('data', function(data){
		          console.log('STRAMING DATA RECIVED',data);
		          parts.push(data);
		        });

		        file.on('end', function(){
		          console.log('END AND PLAY');
		          console.log(parts);
		          console.log(window.webkitURL);
		          var audioUrl = window.webkitURL.createObjectURL(new Blob(parts));
		          console.log(audioUrl);
		          var myaudio = new Audio(audioUrl);
		          myaudio.play();
		        });
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
