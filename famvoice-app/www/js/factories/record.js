/**
 * Record service
 * @module record
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$record', [

  '$rootScope', 

  function($rootScope) {

    var recordName = 'record.mp3';

  /**
  * Start a record
  *
  * @method startRecord
  */
  function startRecord(){
    return true;
  }

  /**
  * Stop record
  *
  * @method stopRecord
  */
  function stopRecord(){
    return true;
  }


  return {
    startRecord: startRecord,
    stopRecord: stopRecord
  };
}]);