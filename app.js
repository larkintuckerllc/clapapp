var myApp = angular.module('myApp', [
	'ngRoute',
	'blockUI',
	'navigatorServices',
	'myFirebaseServices',
	'standardControllers',
	'validatorDirectives',
	'customControllers'
])
.config(function(blockUIConfigProvider) {
	blockUIConfigProvider.autoBlock(false);
});
