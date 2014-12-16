var module = angular.module('validatorDirectives', []);

var SAFE_REGEXP = /^[a-zA-Z0-9\s]+$/;
module.directive('safe', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$validators.safe = function(modelValue, viewValue) {
				if (ctrl.$isEmpty(modelValue)) {
					return true;
				}
				if (SAFE_REGEXP.test(viewValue)) {
					return true;
				}
				return false;
			};
		}
	};
});
