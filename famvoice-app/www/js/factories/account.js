/**
 * Account service
 * @module account
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$account', [

  '$rootScope', 
  '$socket', 

  function($rootScope, $socket) {

    /**
    * Credentials that are stored on the device
    *
    * @property credentials
    * @private
    */
    var credentials = localStorage.getItem('credentials');

    /**
    * UserId that are stored on the device
    *
    * @property userId
    * @private
    */
    var userId = localStorage.getItem('userId');

    /**
    * Flag to detect if the user is loged or not.
    *
    * @property _isLoged
    * @private
    */
    var _isLoged = false;

    /**
    * Check if the user is registered.
    *
    * @method isRegister
    */
    function isRegister(){
      return (userId)?true:false;
    }

    /**
    * Get credentials encripted from localStorage
    *
    * @method getCredentials
    */
    function getCredentials(){
      if(!credentials){
        return null;
      }

      return credentials;
    }

    /**
    * Create a token based on credentials and socket.io session.
    *
    * @method token
    */
    function token(){

      if(!credentials){
        return null;
      }

      return base64_encode($socket.id()+credentials);;
    }

    /**
    * Get the user Id that have the device.
    *
    * @method userId
    */
    function getUserId(){
      return userId;
    }

    /**
    * Get the user Id that have the device.
    *
    * @method userId
    */
    function isLogged(){
      return _isLoged;
    }

    /**
    * Set that the user is loged
    *
    * @method userId
    */
    function setLogged(){
      _isLoged = true;
    }

    /**
    * Make autologin when the user is reconnected
    *
    * @method autoLogin
    */
    function autoLogin(){

      if(!credentials){
        return null;
      }

      $socket.emit('user:login', { credentials: credentials, token:token()}, OnAutoLogin);
    }

    /**
    * Callback for autologin on $account
    *
    * @method OnAutoLogin
    */
    function OnAutoLogin(result){
      console.log('AUTOLOGIN TRUE');
      setLogged();
    }

    return {
      isRegister: isRegister,
      getCredentials: getCredentials,
      token:token,
      getUserId:getUserId,
      setLogged:setLogged,
      isLogged:isLogged,
      login:autoLogin
    };
}]);