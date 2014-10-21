/**
 * Socket service
 * @module socket
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$stream', [

  '$rootScope',

  function($rootScope) {

     

    /**
    * Listen some messages from the server
    *
    * @method on
    */
    // function on(callback){

    //   client.on('stream', function(stream, meta){ 

    //     var parts = [];

    //     stream.on('data', function(data){
    //       parts.push(data);
    //     });

    //     stream.on('end', function(){

    //       var args = arguments;
    //       $rootScope.$apply(function () {
    //         callback.apply(client, args);
    //       });

    //       var img = document.createElement("img");
    //       img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
    //       document.body.appendChild(img);

    //     });
    //   });

    // }

    

  return {
    //on: on
  };
}]);