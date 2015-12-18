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
					username: 'dtrinh888',
				}
			});
		};
	}])
	.factory('capital', ['$http', function($http){
		return function(capitalName, countryCode){
			return $http({
				url: 'http://api.geonames.org/search',
				params: {
					q: capitalName,
					name_equals: capitalName,
					country: countryCode,
					isNameRequired: true,
					username: 'dtrinh888',
					type: 'JSON'
				}
			});	
		};
	}])
	.factory('neighbours', ['$http', function($http){
		return function(nameID){
			return $http({
				url: 'http://api.geonames.org/neighboursJSON?',
				params: {
					geonameId: nameID,
					username: 'dtrinh888'
				}
			});
		};
	}])
	.factory('countryDetail', ['$http', function($http){
		return function(countryCode){
			return $http({
				url: 'http://api.geonames.org/countryInfoJSON',
				params: {
					username: 'dtrinh888',
					country: countryCode
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
	.controller('CDCtrl', ['$scope', '$route', 'capital', 'neighbours', 'countries', 'countryDetail', function($scope, $route, capital, neighbours, countries, countryDetail ) {
		countryDetail($route.current.params.country).then(function(data){
			console.log(data);
			$scope.country = data.data.geonames[0];
			capital($scope.country.capital, $scope.country.countryCode).then(function(capitalData){
				console.log(capitalData);
				$scope.capital = capitalData.data.geonames[0];
			});
			neighbours($scope.country.geonameId).then(function(neighbourData){
				console.log(neighbourData);
				$scope.neighbours = neighbourData.data.geonames;
			});
		});
		/*countries().then(function(data){
			console.log(data);
			$scope.countries = data.data.geonames.countryName;
			console.log($scope.countries);
		});
		countryDetail().then(function(data){
			countries(data);
			console.log(data);
		});
		neighbours().then(function(data){
			console.log(data);
		});*/
	}]);