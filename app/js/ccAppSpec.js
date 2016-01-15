describe("ccApp", function(){
	beforeEach(module("ccApp"));

	var countriesFactoryResponse = {
	  	geonames: [{
	    continent:     'EU',
	    capital:       'Andorra la Vella',
	    languages:     'ca',
	    geonameId:     3041565,
	    south:         42.42849259876837,
	    isoAlpha3:     'AND',
	    north:         42.65604389629997,
	    fipsCode:      'AN',
	    population:    '84000',
	    east:          1.7865427778319827,
	    isoNumeric:    '020',
	    areaInSqKm:    '468.0',
	    countryCode:   'AD',
	    west:          1.4071867141112762,
	    countryName:   'Andorra',
	    continentName: 'Europe',
	    currencyCode:  'EUR'
  	},{
	    continent:     'AS',
	    capital:       'Abu Dhabi',
	    languages:     'ar-AE,fa,en,hi,ur',
	    geonameId:     290557,
	    south:         22.633329391479492,
	    isoAlpha3:     'ARE',
	    north:         26.08415985107422,
	    fipsCode:      'AE',
	    population:    '4975593',
	    east:          56.38166046142578,
	    isoNumeric:    '784',
	    areaInSqKm:    '82880.0',
	    countryCode:   'AE',
	    west:          51.58332824707031,
	    countryName:   'United Arab Emirates',
	    continentName: 'Asia',
	    currencyCode:  'AED'
	  }]
	};


	var countryFactoryCaptialResponse = {
	  totalResultsCount: 41,
	  geonames: [{
	    adminCode1:  'DC',
	    lng:         '-77.03637',
	    geonameId:    4140963,
	    toponymName: 'Washington, D.C.',
	    countryId:   '6252001',
	    fcl:         'P',
	    population:  601723,
	    countryCode: 'US',
	    name:        'Washington',
	    fclName:     'city, village,...',
	    countryName: 'United States',
	    fcodeName:   'capital of a political entity',
	    adminName1:  'Washington, D.C.',
	    lat:         '38.89511',
	    fcode:       'PPLC'
	  },{
	    adminCode1:  'UT',
	    lng:         '-113.50829',
	    geonameId:   5549222,
	    toponymName: 'Washington',
	    countryId:   '6252001',
	    fcl:         'P',
	    population:  18761,
	    countryCode: 'US',
	    name:        'Washington',
	    fclName:     'city, village,...',
	    countryName: 'United States',
	    fcodeName:   'populated place',
	    adminName1:  'Utah',
	    lat:         '37.13054',
	    fcode:       'PPL'
	  }]
	};

	var countryFactoryNeighborsResponse = {
	  totalResultsCount: 3,
	  geonames: [{
	    adminCode1: '00',
	    lng:         '-113.64258',
	    geonameId:   6251999,
	    toponymName: 'Canada',
	    countryId:   '6251999',
	    fcl:         'A',
	    population:  33679000,
	    countryCode: 'CA',
	    name:        'Canada',
	    fclName:     'country, state, region,...',
	    countryName: 'Canada',
	    fcodeName:   'independent political entity',
	    adminName1:  '',
	    lat:         '60.10867',
	    fcode:       'PCLI'
	  },{
	    adminCode1:  '00',
	    lng:         '-79.5',
	    geonameId:   3562981,
	    toponymName: 'Republic of Cuba',
	    countryId:   '3562981',
	    fcl:         'A',
	    population:  11423000,
	    countryCode: 'CU',
	    name:        'Cuba',
	    fclName:     'country, state, region,...',
	    countryName: 'Cuba',
	    fcodeName:   'independent political entity',
	    adminName1:  '',
	    lat:         '22',
	    fcode:       'PCLI'
	  },{
	    adminCode1:  '00',
	    lng:         '-102',
	    geonameId:   3996063,
	    toponymName: 'Mexico',
	    countryId:   '3996063',
	    fcl:         'A',
	    population:  112468855,
	    countryCode: 'MX',
	    name:        'Mexico',
	    fclName:     'country, state, region,...',
	    countryName: 'Mexico',
	    fcodeName:   'independent political entity',
	    adminName1:  '',
	    lat:         '23',
	    fcode:       'PCLI'
	  }]
	};

	describe("/ route", function(){
		it('should load the home template', 
		inject(function($location, $rootScope, $route, $httpBackend){
			$httpBackend.expect('GET', 'home.html').respond(200);
			$rootScope.$apply(function(){
				$location.path('/');
			});
			expect($route.current.loadedTemplateUrl).toBe("home.html");
		}));
	});

	describe("/countries/ route", function(){
		it('should load the countries template', 
		inject(function($location, $rootScope, $route, $httpBackend){
			$httpBackend.expect('GET', 'countries.html').respond(200);
			$rootScope.$apply(function(){
				$location.path('/countries/');
			});
			expect($route.current.controller).toBe("CountriesCtrl");
			expect($route.current.loadedTemplateUrl).toBe("countries.html");
		}));
	});

	describe("/countries/:country/capital", function(){
		it('should load the country template', 
		inject(function($location, $rootScope, $route, $httpBackend){
			$httpBackend.expect('GET', 'country-detail.html').respond(200);
			$rootScope.$apply(function(){
				$location.path('/countries/US/capital');
			});
			expect($route.current.controller).toBe("CDCtrl");
			expect($route.current.loadedTemplateUrl).toBe('country-detail.html');
		}));
	});
	
	describe("countries countriesFactoryResponse", function(){
		it('should return countries endpoint', inject(function(countries, $rootScope, $httpBackend){
			$httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?username=dtrinh888').respond(countriesFactoryResponse);
			var countriesArray = [];
			countries().then(function(res){
				countriesArray = res.data.geonames;
			});
			/* $rootScope.$digest() grabs the API*/
			$rootScope.$digest();
			/* $httpBackend.flush() will flush out the API */
			$httpBackend.flush();
			expect(countriesArray.length).toBe(2);
			/* $httpBackend.verifyNoOutstandingRequest() to see if 
			 * $rootScope.$digest and $httpBackend.flush() to run through 
			 * if we comment out $httpBackend.flush() we rill receive an error on test */
			$httpBackend.verifyNoOutstandingRequest();
			/* $httpBackend.verifyNoOutstandingExpectation(); to see if
			 * expect() all run through, if we comment out the countries().then()
			 * we would receive an error in the test*/
			$httpBackend.verifyNoOutstandingExpectation();			
		}));
	});

	describe("capital countryFactoryCaptialResponse", function(){
		it('should return a single capital', inject(function(capital, $rootScope, $httpBackend){
			$httpBackend.expect('GET', 'http://api.geonames.org/search?country=US&isNameRequired=true&name_equals=Washington&q=Washington&type=JSON&username=dtrinh888').respond(countryFactoryCaptialResponse);
			var cap = null;
			capital('Washington', 'US').then(function(res){
				cap = res.data.geonames[0];
			});
			$rootScope.$digest();
			$httpBackend.flush();
			expect(typeof cap).toBe('object');
			expect(cap.name).toBe('Washington');
			expect(cap.toponymName).toBe('Washington, D.C.');
			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();	
		}));
	});

	describe("neighbours countryFactoryNeighborsResponse", function(){
		it('should return the neighbours' , inject(function(neighbours, $rootScope, $httpBackend){
			/*neighbours();*/
			var neighbour = null;
			$httpBackend.expect('GET', 'http://api.geonames.org/neighboursJSON?&geonameId=6252001&username=dtrinh888').respond(countryFactoryNeighborsResponse);
			/* have to pass in the countryCode in "fake" API */
			neighbours(6252001).then(function(res){
				neighbour = res.data.geonames;
			});
			$rootScope.$digest();
			$httpBackend.flush();
			expect(typeof neighbour).toBe('object');
			expect(neighbour.length).toBe(3);
			$httpBackend.verifyNoOutstandingRequest();
		}));
	});

	describe("countryDetail countriesFactoryResponse", function(){
		it('should return countryDetail', inject(function(countryDetail, $rootScope, $httpBackend){
			$httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?country=AD&username=dtrinh888').respond(countriesFactoryResponse);
			var cd;
			countryDetail('AD').then(function(res){
				cd = res.data.geonames[0];
			});
			$rootScope.$digest();
			$httpBackend.flush();
			expect(cd.countryName).toBe('Andorra');
			$httpBackend.verifyNoOutstandingRequest();
		}));
	});
});