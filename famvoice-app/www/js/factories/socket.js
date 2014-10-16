services.factory('$socket', ['$rootScope', function($rootScope) {

  var socket = io.connect('http://127.0.0.1:9564');

  function on(eventName, callback){
    
    console.log(eventName);

    socket.on(eventName, function () {  
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(socket, args);
      });
    });
  }

  function emit(eventName, data, callback){
    socket.emit(eventName, data, function () {  
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(socket, args);
      });
    });
  }

  return {
    on: on,
    emit: emit
  };
}]);