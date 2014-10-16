/**
 * User controller
 *
 * @module UserCtrl
 * @author Claudio A. Marrero
 * @class famvoice.controllers
 */
app.controller('UserCtrl', [

  '$scope', 
  '$timeout', 
  '$rootScope', 
  '$socket', 
  '$location', 

  function($scope, $timeout, $rootScope, $socket, $location) {

    $scope.loginData = {};

    function OnLogin(data){
      $location.path('/app/playlists');
      console.log(data);
    }
      
    $scope.doLogin = function() {

      localStorage.setItem("name", $scope.loginData.name);

      var credentials = base64_encode(Sha256.hash($scope.loginData.name));
      localStorage.setItem("credentials", credentials);
      
      $scope.loginData.credentials = credentials;

      $socket.emit('user:login', $scope.loginData, OnLogin);
    };

}]);