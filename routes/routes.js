angular.module('myApp').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
      	  		templateUrl: 'views/update.html',
       			controller: 'UpdateCtrl'
      		}).
		when('/home', {
      	  		templateUrl: 'views/home.html',
       			controller: 'HomeCtrl'
      		}).
		when('/error', {
      	  		templateUrl: 'views/error.html',
       			controller: 'ErrorCtrl'
      		}).
		when('/room/:key', {
      	  		templateUrl: 'views/room.html',
       			controller: 'RoomCtrl'
      		}).
		when('/rooms_create', {
      	  		templateUrl: 'views/rooms_create.html',
       			controller: 'RoomsCreateCtrl'
      		}).
      		otherwise({
       			redirectTo: '/'
      		});
}]);
