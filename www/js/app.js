angular.module('starter', ['ionic', 'ionic.contrib.ui.cards'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.directive('noScroll', function($document) {

    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {

            $document.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    };
})


.controller('CardsCtrl', function($scope, $ionicSwipeCardDelegate, $http, getAllFeedService, $log, $ionicPopup) {
    var promise = getAllFeedService.getAllFeed();
    promise.then(function(payload) {

        var cardTypes = payload.feeds;
        $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

        $scope.cardSwiped = function(index) {
            $scope.addCard();
        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        };

    }, function(errorPayload) {
        $log.error('Failure contacting Mark', errorPayload);
        var alertPopup = $ionicPopup.alert({
            title: "Network Error",
            template: "Uncle Mark seems to be taking a dump...\n\n"
        });
        alertPopup.then(function(res) {
            $scope.loading = false;
            $scope.errorMessage = getErrorMessageService.getErrorMessage();
        });
    });
})

.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
    $scope.goAway = function() {
        var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
        card.swipe();
    };
})

.factory('getAllFeedService', function($http, $log, $q, $rootScope) {
    ENDPOINT = "http://127.0.0.1:5000";
    return {
        getAllFeed: function() {
            var deferred = $q.defer();
            $http.get(ENDPOINT + '/api/feeds')
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });
            return deferred.promise;
        }
    };
});