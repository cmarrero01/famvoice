/**
 * Record service
 * @module record
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$record', [

  '$q',
  '$rootScope', 

  function($q, $rootScope) {

    var recordName = 'record.mp3';

    var mediaRec = null;

    /**
    * Start a record
    *
    * @method startRecord
    */
    function startRecord(){
      var q = $q.defer();
      mediaRec = new Media(recordName,
          function() {
              q.resolve(true);
          },
          function(err) {
              q.reject(err);
          });
      mediaRec.startRecord();
      return q.promise;
    }

    /**
    * Stop record
    *
    * @method stopRecord
    */
    function stopRecord(){
      var q = $q.defer();
      mediaRec.stopRecord();
      return q.promise;
    }

    /**
    * Stop record
    *
    * @method stopRecord
    */
    function playRecord(){
      var q = $q.defer();
      mediaRec.play();
      return q.promise;
    }

    /**
    * Get the name of the record
    *
    * @method getRecord
    */
    function getRecord(){
      return recordName;
    }

  return {
    startRecord: startRecord,
    stopRecord: stopRecord,
    getRecord:getRecord
  };
}]);