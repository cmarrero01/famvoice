/**
 * Initialization of famvoice app
 * @module famvoice
 * @author Claudio A. Marrero
 * @class famvoice
 */

/**
 * Angular app, and dependencies.
 * @property app
 */
var app = angular.module('famvoice', ['ionic', 'ngCordova','famvoice.controllers', 'famvoice.services', 'ngTagsInput','Scope.safeApply']);

/**
 * Module of services.
 * @property services
 */
var services = angular.module('famvoice.services', []);

/**
 * Intial run of the aplication.
 * @method run
 */
app.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
  return function(val) {
      return $sce.trustAsResourceUrl(val);
  };
}])

/**
 * Configurations of routes, uis, and controllers dependecies.
 * @method config
 */
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: "UserCtrl"
    })

    .state('app.record', {
      url: "/record",
      views: {
        'menuContent' :{
          templateUrl: "templates/record.html",
          controller: 'RecordCtrl'
        }
      }
    })

    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile.html"
        }
      }
    })

    .state('app.MyRequests', {
      url: "/my-requests",
      views: {
        'menuContent' :{
          templateUrl: "templates/my-requests.html"
        }
      }
    })

    .state('app.requests', {
      url: "/requests",
      views: {
        'menuContent' :{
          templateUrl: "templates/requests.html"
        }
      }
    })

    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/playlists');
});

