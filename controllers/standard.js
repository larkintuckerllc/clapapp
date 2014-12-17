var standardControllers = angular.module('standardControllers', []);

standardControllers.controller('ErrorCtrl', ['$scope', '$window', function ($scope, $window) {
	$scope.reloadApplication = function() {
		$window.location.href = '/';
	}
}]);

standardControllers.controller('UpdateCtrl', ['$scope', '$window', '$timeout', 'navigator', 'myFirebase', function ($scope, $window, $timeout, navigator, myFirebase) {

	// CATCHING UP TO COUNT STARTED EARLIER IN INDEX.HTML
	$scope.cachedCount = $window.myGlobalCachedCount;
	$scope.updateReady = false;
	$scope.reloadApplication = function() {
		$window.location.href = '/';
	}
	
	// HACK TO WORK AROUND ANDROID 4.4.2 STOCK BROWSER ISSUE - SUBMITTED TO FIREBASE 
        myFirebase.onConnected(function(snapshot) {
        }, function() {
        });

        if ($window.applicationCache) {
                $window.applicationCache.addEventListener('noupdate', function(e) {
			$timeout(function() {
				navigator.navigate('/home');
			});
                });
		$window.applicationCache.addEventListener('progress', function() {
			$timeout(function() {
				$scope.cachedCount += 1; 
			});
		});
                $window.applicationCache.addEventListener('cached', function(e) {
			$timeout(function() {
				$scope.updateReady = true;	
			});
                });
                $window.applicationCache.addEventListener('updateready', function(e) {
			$timeout(function() {
				$scope.updateReady = true;	
			});
                });
		if ($window.applicationCache.status == $window.applicationCache.IDLE) {
                	navigator.navigate('/home');	
		}
		if ($window.applicationCache.status == $window.applicationCache.UPDATEREADY) {
                	$scope.updateReady = true;
		}
        } else {
		navigator.navigate('/home');
	}
}]);
