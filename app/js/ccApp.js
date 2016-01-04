/* need to include ngRoute to configure and define routes */
angular.module('ccApp', ['ngAnimate', 'ngRoute'])
	/* inject $routeProvider to set URL routing rules */
	.config(['$routeProvider', function($routeProvider){
		/* $routeProvider.when() is used to specify when users request the root URL
		 * the app should respond with the home.html template */
		$routeProvider
			.when('/', {
				/* 	from the templateUrl property, the app will expect to find 
					file home.html */
				templateUrl: 'home.html'
			})
			.when('/countries/', {
				/* 	the app will expect to find 
					file countries.html and controller CountriesCtrl */
				templateUrl: 'countries.html',
				controller: 'CountriesCtrl'
			})
			/* placed :country variable in path so that whenever a user selects a 
			 * country in the country list the country code will be placed into
			 * :country variable */
			.when('/countries/:country/capital', {
				templateUrl: 'country-detail.html',
				controller: 'CDCtrl'
			})
			/* error message when unfamiliar page selected */
			.when('/404', {
				template: '<p>Error - Page Not Found</p>'
			})
			.otherwise('/404');
	}])
	/* factory to call countries list API
	 * factories are created so that we can use multiple APIs in our controllers
	 * $http is built in by Angular to make AJAX requests to same and cross-domain servers */
	.factory('countries', ['$http', function($http){
		return function() {
			return $http({
				/* countries API endpoint */
				url: 'http://api.geonames.org/countryInfoJSON',
				params: {
					username: 'dtrinh888'
				}
			});
		};
	}])
	/* factory to call capitals API */
	.factory('capital', ['$http', function($http){
		
		return function(capitalName, countryCode){
			return $http({
				url: 'http://api.geonames.org/search',
				params: {
					/* passed the parameters created in function to required API 
					 * parameters: q, name_equals and country*/
					q: capitalName,
					name_equals: capitalName,
					country: countryCode,
					/* at least one of the search term needs to be part of the place name 
					 * if we want to find places with example: 'Berlin' we set it to true*/
					isNameRequired: true,
					username: 'dtrinh888',
					/* type default is XML but we need JSON*/
					type: 'JSON'
				}
			});
		};
	}])
	/* factory to call neighbouring countries */
	.factory('neighbours', ['$http', function($http){
		/* pass in parameter to retrieve nameID in geonameId*/
		return function(nameID){
			return $http({
				url: 'http://api.geonames.org/neighboursJSON?',
				params: {
					/* the geonameId for the neighbours*/
					geonameId: nameID,
					username: 'dtrinh888'
				}
			});
		};
	}])
	/* factory to call countries API again but need to pass in countryCode
	 * so that we can retrieve country details after clicking on a country 
	 * in coutnries list */
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
	/* countries controller to control the data from the countries API */
	.controller('CountriesCtrl', ['$scope', '$location', 'countries', function($scope, $location, countries){
		$scope.loading = true;
		$scope.countries = countries;
		/* .then() method is used to supply callbacks to be executed when AJAX requests completes 
		 * data parameter passes in the data from the countries API */
		countries().then(function(data){
			/* console logged data.data to view the data object in countries API to find data needed */
			console.log(data.data);
			$scope.loading = false;
			/* scope variable created to grab all data from countries API data.geonames
			 * all info needed for countries list is in geonames */
			$scope.countries = data.data.geonames;	
		});
		$scope.goToCountry = function(countries) {
			if (countries.countryCode) {
				$location.path('/countries/'+countries.countryCode+'/capital');
			}
		};
	}])
	/* injecting $route provider into controller to access the route parameters
	 * since one of our routes has a parameter in the url ":country" we need to inject $route*/
	.controller('CDCtrl', ['$scope', '$route', 'capital', 'neighbours', 'countries', 'countryDetail', function($scope, $route, capital, neighbours, countries, countryDetail){ 
		$scope.loading = true;
		/* to access route parameter ":country", we have to use $route provider in controller
		 * and then get params for current route with $route.current.params
		 * once parameters get passed in .then retrieve country API in data parameter*/
		countryDetail($route.current.params.country).then(function(data){
			$scope.loading = false;
			console.log('countrydetail', data);
			/* once we retrieve country API details stick it in the scope 
			 * taking the first object in the array per assignment */
			$scope.country = data.data.geonames[0];
			/* passed in capital and country code to retrieve data for captials */
			capital($scope.country.capital, $scope.country.countryCode).then(function(capitalData){
				console.log('capital',capitalData);
				$scope.capital = capitalData.data.geonames[0];
			});
			/* need geonameId from neighbours API to loop all neighbours for selected country */
			neighbours($scope.country.geonameId).then(function(neighbourData){
				console.log('neighbours',neighbourData);
				$scope.neighbours = neighbourData.data.geonames;
			});
		});
	}]);