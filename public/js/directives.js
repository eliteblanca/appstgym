/**
*  Module
*
* Description
*/
angular.module('gymApp').directive('login', function(){
	// Runs during compile
	return {
		//name: 'loginDirective',
		// priority: 1,
		// terminal: true,
		scope: true, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		 replace: false,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, element, iAttrs, controller) {
			scope.$watch('estadoLogin',function(estadoLogin){
				if (estadoLogin == 'login rechazado') {
					angular.element('#usuario').addClass('btn-danger');
					angular.element('#password').addClass('btn-danger');
				}else if(estadoLogin == 'login aceptado'){
					angular.element('#usuario').addClass('btn-success');
					angular.element('#password').addClass('btn-success');
				}
			});
		}
	};
}).
directive('subscripciones',function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: '/views/clientes/listaSubs.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
});;
