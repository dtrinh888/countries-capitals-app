angular.module('ccApp', ['ngAnimate', 'ngRoute'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/', {
			templateUrl: 'home.html',
		})
		.when('/countries/', {
			templateUrl: 'countries.html',
			controller: 'CountriesCtrl'
		})
		.when('/countries/:country/capital', {
			templateUrl: 'country-detail.html',
			controller: 'CDCtrl'
		})
		.when('/404', {
			template: '<p>Error - Page Not Found</p>'
		})
		.otherwise('/404');
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
	.controller('CountriesCtrl', ['$scope', 'countries', function($scope, countries){
		countries().then(function(data){
			console.log(data.data);
			$scope.countries = data.data.geonames;
		});
	}])
	.controller('CDCtrl', ['$scope', '$route', 'capital', 'neighbours', 'countries', 'countryDetail', function($scope, $route, capital, neighbours, countries, countryDetail ) {

		countryDetail($route.current.params.country).then(function(data){
			console.log('countrydetail', data);
			$scope.country = data.data.geonames[0];
			capital($scope.country.capital, $scope.country.countryCode).then(function(capitalData){
				console.log('capital',capitalData);
				$scope.capital = capitalData.data.geonames[0];
			});
			neighbours($scope.country.geonameId).then(function(neighbourData){
				console.log('neighbours',neighbourData);
				$scope.neighbours = neighbourData.data.geonames;
			});
			countryDetail($scope.country.countryCode).then(function(countryDetailData){
				console.log('cd',countryDetailData);
				$scope.countryDetail = countryDetailData.data.geonames[0];
			});
		});
	}]);