/**
 * Socket service
 * @module socket
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$socket', [

  '$rootScope', 

  function($rootScope) {

  /**
  * Socket.io property, have all methods and propertios of socket.io
  *
  * @property socket
  * @private
  */
  var socket = io.connect('http://127.0.0.1:9564');

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
    return socket.io.engine.id;
  }

  return {
    on: on,
    emit: emit,
    id:id
  };
}]);