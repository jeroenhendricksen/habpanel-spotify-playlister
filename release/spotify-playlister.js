"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module('app.widgets').service('spotifyPlaylisterService', SpotifyPlaylisterService).controller('SpotifyPlaylisterController', SpotifyPlaylisterController);
SpotifyPlaylisterController.$inject = ['$scope', '$timeout', 'OHService', 'spotifyPlaylisterService'];

function SpotifyPlaylisterController($scope, $timeout, OHService, spotifyPlaylisterService) {
  var ctrl = this;

  var initController = function initController() {
    ctrl.state = {
      noConfig: !$scope.config || !$scope.config.accessToken,
      accessToken: null,
      userId: null,
      results: null,
      query: null,
      error: false
    };
    ctrl.model = {
      query: ''
    };
  };

  initController();

  var loadPlaylists = function loadPlaylists() {
    ctrl.state.error = false;
    var _ctrl$state = ctrl.state,
        userId = _ctrl$state.userId,
        accessToken = _ctrl$state.accessToken;
    spotifyPlaylisterService.getUserPlaylists(accessToken, userId).then(function (playlists) {
      ctrl.state.results = [{
        name: 'Your Playlists',
        items: playlists
      }];
    }).catch(function () {
      return ctrl.state.error = true;
    });
  };

  var init = function init(accessTokenItemName) {
    var accessTokenItem = OHService.getItem(accessTokenItemName);

    if (!accessTokenItem || !accessTokenItem.state) {
      return;
    }

    if (ctrl.state.accessToken !== accessTokenItem.state) {
      ctrl.state.accessToken = accessTokenItem.state;
      spotifyPlaylisterService.getUserId(ctrl.state.accessToken).then(function (userId) {
        ctrl.state.userId = userId;
        loadPlaylists();
      }).catch(function () {
        return ctrl.state.error = true;
      });
    }
  };

  ctrl.reset = function () {
    initController();

    if ($scope.config && $scope.config.accessToken) {
      init($scope.config.accessToken);
    }
  };

  ctrl.play = function (item) {
    OHService.sendCmd($scope.config.spotifyPlayer, item.uri);
  };

  $scope.$watch('config.accessToken', function (accessTokenItemName) {
    if (accessTokenItemName) {
      ctrl.state.noConfig = false;
      var accessTokenItem = OHService.getItem(accessTokenItemName);

      if (accessTokenItem && accessTokenItem.state) {
        init(accessTokenItemName);
      } else {
        //XXX: needed when habpanel loaded with refresh. should be a better way
        $timeout(function () {
          init(accessTokenItemName);
        }, 1000);
      }
    }
  });
}

SpotifyPlaylisterService.$inject = ['$http', '$cacheFactory'];

function SpotifyPlaylisterService($http, $cacheFactory) {
  var cache = $cacheFactory('spotify-playlister');

  var baseHeaders = function baseHeaders(accessToken) {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    };
  };

  var enqueueCacheRemove = function enqueueCacheRemove(key) {
    setTimeout(function () {
      cache.remove(key);
    }, 10000);
  };

  var doGet = function doGet(url, accessToken) {
    enqueueCacheRemove(url);
    return $http({
      method: 'GET',
      url: url,
      headers: baseHeaders(accessToken)
    });
  };

  return {
    getUserId: function getUserId(accessToken) {
      var url = 'https://api.spotify.com/v1/me';
      return doGet(url, accessToken).then(function (_ref) {
        var data = _ref.data;
        return data.id;
      });
    },
    getUserPlaylists: function getUserPlaylists(accessToken, userId) {
      var url = "https://api.spotify.com/v1/users/".concat(userId, "/playlists?limit=50&offset=0");
      return doGet(url, accessToken).then(function (_ref2) {
        var data = _ref2.data;
        return data.items;
      });
    }
  };
}