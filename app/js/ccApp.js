angular.module('ccApp', ['ngAnimate', 'ngRoute'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/', {
			templateUrl: 'home.html',
			controller: 'HomeCtrl'
		})
		.when('/countries/', {
			templateUrl: 'countries.html',
			controller: 'CountriesCtrl'
		})
		.when('/countries/:country/capital', {
			templateUrl: 'country-detail.html',
			controller: 'CDCtrl'
		});
	}])
	.factory('countries', ['$http', function($http){
		return function(){
			return $http({
				url: 'http://api.geonames.org/countryInfoJSON',
				params: {
					username: 'dtrinh888'
				}
			});
		};
	}])
	.factory('countryDetail', ['$http', function($http){
		return function(){
			return $http({
				url: 'http://api.geonames.org/searchJSON',
				params: {
					q: 'q',
					name: 'name',
					name_equals: 'name_equals',
					country: 'country'
				}
			});	
		};
	}])
	.factory('neighbours', ['$http', function($http){
		return function(){
			return $http({
				url: 'http://api.geonames.org/neighboursJSON?',
				params: {

				}
			});
		};
	}])
	.controller('HomeCtrl', ['$scope', function($scope){

	}])
	.controller('CountriesCtrl', ['$scope', 'countries', function($scope, countries){
		countries().then(function(data){
			console.log(data.data);
			$scope.countries = data.data.geonames;
		});
	}])
	.controller('CDCtrl', ['$scope', 'countryDetail', 'neighbours', function($scope, countryDetail, neighbours) {
		countryDetail().then(function(data){
			console.log(data);
		});
		neighbours().then(function(data){
			console.log(data);
		});
	}]);