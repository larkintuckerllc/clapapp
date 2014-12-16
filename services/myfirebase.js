var module = angular.module('myFirebaseServices', []);

module.factory('myFirebase', ['blockUI', '$timeout', '$window', function(blockUI, $timeout, $window) {
	var service = {
	};
	service.ref = new $window.Firebase('https://clapapp.firebaseio.com');
	service.onConnected = function(success, error) {
		service.ref.child('.info').child('connected').on('value', function(snapshot) {
			$timeout(function() {
				success(snapshot);
			});
		}, function() {
			$timeout(function() {
				error();
			});
		});
	};
	service.onceValue = function(ref, success, error, noblock) {
		var hasTimedOut = false;
		var hasCalled = false;
		if (! noblock) {
			blockUI.start();
		}
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				error();
				if (! noblock) {
					blockUI.stop();
				}
			}
		}, 5000);
		ref.once('value', function(snapshot) {
			// SUCCESS
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					success(snapshot);
					if (! noblock) {
						blockUI.stop();
					}
				});
			}
		}, function() {
			// ERROR
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					error();
					if (! noblock) {
						blockUI.stop();
					}
				});
			}
		});
	};
	service.onChildAdded = function(ref, success, error) {
		ref.on('child_added', function(snapshot) {
			$timeout(function() {
				success(snapshot);
			});
		}, function() {
			$timeout(function() {
				error();
			});
		});
	};
	service.onChildRemoved = function(ref, success, error) {
		ref.on('child_removed', function(snapshot) {
			$timeout(function() {
				success(snapshot);
			});
		}, function() {
			$timeout(function() {
				error();
			});
		});
	};
	service.push = function(ref, obj, callback, noblock) {
		var hasTimedOut = false;
		var hasCalled = false;
		if (! noblock) {
			blockUI.start();
		}
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				if (! noblock) {
					blockUI.stop();
				}
			}
		}, 5000);
		return ref.push(obj, function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					if (! noblock) {
						blockUI.stop();
					}
				});
			}
		});
	};
	service.set = function(ref, obj, callback, noblock) {
		var hasTimedOut = false;
		var hasCalled = false;
		if (! noblock) {
			blockUI.start();
		}
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				if (! noblock) {
					blockUI.stop();
				}
			}
		}, 5000);
		ref.set(obj, function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					if (! noblock) {
						blockUI.stop();
					}
				});
			}
		});
	};
	service.update = function(ref, obj, callback, noblock) {
		var hasTimedOut = false;
		var hasCalled = false;
		if (! noblock) {
			blockUI.start();
		}
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				if (! noblock) {
					blockUI.stop();
				}
			}
		}, 5000);
		ref.update(obj, function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					if (! noblock) {
						blockUI.stop();
					}
				});
			}
		});
	};
	service.remove = function(ref, callback, noblock) {
		var hasTimedOut = false;
		var hasCalled = false;
		if (! noblock) {
			blockUI.start();
		}
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				if (! noblock) {
					blockUI.stop();
				}
			}
		}, 5000);
		ref.remove(function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					if (! noblock) {
						blockUI.stop();
					}
				});
			}
		});
	};
	return service;
}]);
