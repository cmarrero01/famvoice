/**
 * Socket service
 * @module socket
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$socket', [

  '$rootScope',

  function($rootScope) {

    var socketId = socket.io.engine.id;

    socket.on('connect',function(){
      socketId = socket.io.engine.id;
    });

    socket.on('error',function(err){
      console.log(err);
    });

    socket.on('reconnect',function(){
      socketId = socket.io.engine.id;
      var credentials = localStorage.getItem('credentials');
      var token = base64_encode(socketId+credentials);

      socket.emit('user:login', { 
        credentials: credentials, 
        token:token
      }, OnAutoLogin);

    });

    /**
    * Auto login after reconexcion.
    *
    * @method OnAutoLogin
    */
    function OnAutoLogin(result){
      if(result.code !== 200){
        return;
      }
    }

    /**
    * Listen some messages from the server
    *
    * @method on
    */
    function on(eventName, callback){
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    }

    /**
    * Send messages to the server, if send the acknowleage, when
    * is recived is fired.
    *
    * @method emit
    */
    function emit(eventName, data, callback){
      socket.emit(eventName, data, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    }

    /**
    * Get the ID of socket.io session.
    *
    * @method id
    */
    function id(){
      return socketId;
    }

    /**
    * Get the ID of socket.io session.
    *
    * @method id
    */
    function expose(){
      return socket;
    }

  return {
    on: on,
    emit: emit,
    id:id,
    expose:expose
  };
}]);