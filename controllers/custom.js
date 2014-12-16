var customControllers = angular.module('customControllers', []);

customControllers.controller('HomeCtrl', ['$scope', 'myFirebase', 'navigator', function ($scope, myFirebase, navigator) {
	$scope.navigate = navigator.navigate;
	$scope.rooms = [];
	myFirebase.onceValue(myFirebase.ref.child('rooms_summary'), function(snapshot) {	
		var snapshotVal = snapshot.val();
		if (snapshotVal) {
			$scope.rooms  = Object.keys(snapshotVal).map(function(key) {
				return {key: key, value: snapshotVal[key]}
			});
		}
	}, function() {
		navigator.navigate('/error');
	});

}]);

customControllers.controller('RoomsCreateCtrl', ['$scope', 'myFirebase', 'navigator', function ($scope, myFirebase, navigator) {
	$scope.navigate = navigator.navigate;
	$scope.save = function() {
		var room = {
			name: $scope.name,
		};
		var roomRef = myFirebase.push(myFirebase.ref.child('rooms'), room, function(error) {
			if (! error) {
				var roomKey = roomRef.name();
				myFirebase.set(myFirebase.ref.child('rooms_summary').child(roomKey), room, function(error) {
					if (! error) {
						navigator.navigate('/room/' + roomKey);
					} else {
						navigator.navigate('/error');
					}
				});
			} else {
				navigator.navigate('/error');
			}
		});
	};
}]);

customControllers.controller('RoomCtrl', ['$scope', 'myFirebase', 'navigator', '$routeParams', '$timeout', function ($scope, myFirebase, navigator, $routeParams, $timeout) {
	var roomKey = $routeParams.key;
	var selfRef;
	var clapping = false;
	var cleanUp = function() {
		myFirebase.ref.child('rooms').child(roomKey).child('clappers').off();
		myFirebase.ref.child('rooms').child(roomKey).child('claps').off();
	};
	$scope.navigate = navigator.navigate;
	$scope.circles = [];
	$scope.back = function() {
		cleanUp();
		if (selfRef && selfRef.name) {
			myFirebase.remove(selfRef, function(error) {
				if (! error) {
					navigator.navigate('/home');
				} else {
					navigator.navigate('/error');
				}
			});			
		}
	}
	$scope.clap = function() {
		if (! clapping && selfRef && selfRef.name) {
			clapping = true;
			var clapRef = myFirebase.ref.child('rooms').child(roomKey).child('claps').child(selfRef.name());
			myFirebase.set(clapRef, true, function(error) {
				if (! error) {
					clapRef.onDisconnect().remove(function(error) {
						if (error) {
							cleanUp();		
							navigator.navigate('/error');
						}
					});
					$timeout(function() {
						clapping = false;
		    				clapRef.onDisconnect().cancel();
						myFirebase.remove(clapRef, function(error) {
							if (error) {
								cleanUp();
								navigator.navigate('/error');
							}
						}, true);
					}, 3000);
				} else {
					cleanUp();
					navigator.navigate('/error');
				}
			}, true);	
		}
	};
	selfRef = myFirebase.push(myFirebase.ref.child('rooms').child(roomKey).child('clappers'), true, function(error) {
        	selfRef.onDisconnect().remove(function(error) {
			if (error) {
				cleanUp();
				navigator.navigate('/error');
			}
        	});
	});
	myFirebase.onConnected(function(snapshot) {
		if (snapshot.val() == false) {
			cleanUp();
			navigator.navigate('/error');
		}
	}, function() {
		cleanUp();	
		navigator.navigate('/error');
	});
	myFirebase.onChildAdded(myFirebase.ref.child('rooms').child(roomKey).child('clappers'), function(snapshot) {
		var left, top, red, green, blue, borderWidth;
		left = Math.floor(Math.random() * 60) + 5;
		top = Math.floor(Math.random() * 50) + 15;
		red = Math.floor(Math.random() * 255);
		green = Math.floor(Math.random() * 255);
		blue = Math.floor(Math.random() * 255);
		if (selfRef.name && (snapshot.name() == selfRef.name())) {
		    borderWidth = 3;
		} else {
		    borderWidth = 1;
		}
		$scope.circles.push({
			key: snapshot.name(),
			left: left,
			top: top,
			red: red,
			green: green,
			blue: blue,
			borderWidth: borderWidth,
			throbbing: true
		});
		(function(circle) {
			$timeout(function() {
			    circle.throbbing = false;
			},1000);
		})($scope.circles[$scope.circles.length - 1]);
	}, function() {
		cleanUp();
		navigator.navigate('/error');
	});
	myFirebase.onChildRemoved(myFirebase.ref.child('rooms').child(roomKey).child('clappers'), function(snapshot) {
		var circlePosition = $scope.circles.map(function(circle) {
			return circle.key;
		}).indexOf(snapshot.name());
		$scope.circles.splice(circlePosition, 1);
	}, function() {
		cleanUp();
		navigator.navigate('/error');
	});
	myFirebase.onChildAdded(myFirebase.ref.child('rooms').child(roomKey).child('claps'), function(snapshot) {
		var circlePosition = $scope.circles.map(function(circle) {
			return circle.key;
		}).indexOf(snapshot.name());
		if (circlePosition != -1) {
			$scope.circles[circlePosition].throbbing = true;
			$timeout(function() {
				$scope.circles[circlePosition].throbbing = false;
			}, 3000);
		}
	}, function() {
		cleanUp();
		navigator.navigate('/error');
	});
}]);
