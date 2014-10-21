/**
 * Record service
 * @module record
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$record', [

  '$rootScope',
  '$socket',
  '$account',

  function($rootScope, $socket, $account) {

    var enumerator = 0;
    var recordName = 'record-'+enumerator+'.mp3';
    var mediaRec = null;
    var OnCallback = null;
    var OnAppendData = {};

    /**
    * Start a record
    *
    * @method startRecord
    */
    function startRecord(){
      enumerator++;
      recordName = 'record-'+enumerator+'.mp3';
      mediaRec = new Media(recordName,
          function() {
          },
          function(err) {
          });
      mediaRec.startRecord();
    }

    /**
    * Stop record
    *
    * @method stopRecord
    */
    function stopRecord(){
      mediaRec.stopRecord();
    }

    /**
    * Stop record
    *
    * @method stopRecord
    */
    function playRecord(){
      mediaRec.play();
    }

    /**
    * Get the name of the record
    *
    * @method getRecord
    */
    function getRecord(){
      return recordName;
    }

    /**
    * Save the recorded file to the server
    *
    * @method save
    */
    function save(callback,appendData){
      OnCallback = callback;
      OnAppendData = appendData;
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, OnFileSystem, fail);
    }

    /**
    * Callback for setting the file system to persistent.
    *
    * @method OnFileSystem
    */
    function OnFileSystem(fileSystem){
      fileSystem.root.getFile(recordName, null, OnGetFile, fail);
    }

    /**
    * Callback for geting the file for disk
    *
    * @method OnGetFile
    */
    function OnGetFile(fileEntry){
      fileEntry.file(OnFileEntry, fail);
    }

    /**
    * Callback for file entry, this get the file.
    *
    * @method OnFileEntry
    */
    function OnFileEntry(file){
      var reader = new FileReader();
      reader.onloadend = function(evt) {

          var image = evt.target.result;
          var base64Data  =   image.replace(/^data:audio\/mpeg;base64,/, "");
          base64Data  +=  base64Data.replace('+', ' ');

          $socket.emit('playlists:file',{file:base64Data,name:recordName, token: $account.token(), info:OnAppendData},OnCallback);
      };
      reader.readAsDataURL(file);
    }

    /**
    * When any process of saving file fail, this console the error.
    *
    * @method OnFileEntry
    */
    function fail(err){
      console.log('Error');
      console.log(err);
    }

    /**
    * Play record
    *
    * @method playRecord
    */
    function playRecord(){
      var mediaFile = new Media(recordName,
          function() {
            console.log("playAudio():Audio Success");
          },
          function(err) {
            console.log("playAudio():Audio Error: "+err);
          }
      );
      // Play audio
      mediaFile.play();
    }

  return {
    start: startRecord,
    stop: stopRecord,
    play:playRecord,
    name:getRecord,
    save:save
  };
}]);