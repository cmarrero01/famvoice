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
  '$ionicModal', 
  '$account',
  '$ionicLoading',

  function($scope, $timeout, $rootScope, $socket, $location, $ionicModal, $account, $ionicLoading) {

    $ionicLoading.show({
      template: 'Loading...'
    });

    $scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {

      $scope.modal = modal;

      if(!$account.isRegister()){
        $ionicLoading.hide();
        $scope.modal.show();
        return;
      }

      $socket.emit('user:login', { credentials: $account.getCredentials(), token: $account.token()}, OnLogin);
    });

    /**
    * Callback for Login emit message
    *
    * @method OnLogin
    */
    function OnLogin(data){
      if(data.code != 200){
        return;
      }
      
      $account.setLogged();
      $ionicLoading.hide();
    }

    /**
    * Open a modal to show the register form
    *
    * @method openModal
    */
    $scope.openModal = function() {
      $scope.modal.show();
    };

    /**
    * Close the modal of register form.
    *
    * @method closeModal
    */
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    /**
    * Callback for register message.
    *
    * @method OnRegister
    */
    function OnRegister(data){
      if(data.code != 200){
        return;
      }

      localStorage.setItem('userId',data.result._id);
      $scope.modal.hide();
    }
    
    /**
    * Action that send the data of new user to the server.
    *
    * @method doRegister
    */
    $scope.doRegister = function() {

      localStorage.setItem("name", $scope.loginData.name);

      var credentials = base64_encode(Sha256.hash($scope.loginData.name+new Date().getTime()));
      localStorage.setItem("credentials", credentials);
      
      $scope.loginData.credentials = credentials;

      $socket.emit('user:register', $scope.loginData, OnRegister);
    };

}]);