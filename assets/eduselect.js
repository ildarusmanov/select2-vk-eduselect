var EduSelect = {
	options: {
		countrySelect: '.js-eduselect-country',
		citySelect: '.js-eduselect-city',
		universitySelect: '.js-eduselect-university',
		schoolSelect: '.js-eduselect-school',
		apiUrl: 'https://crossorigin.me/https://api.vk.com/method/'//vk_api_proxy.php?q='
	},

	loadValues: function() {
		var self = this;
		var select = $(self.options.countrySelect);
		var selectValue = select.attr('data-value');

		if (selectValue == '') {
			return;
		}

		$.ajax({
			method: 'GET',
		    url: this.options.apiUrl + "database.getCountries",
		    dataType: 'json',
		    data: { lang: 'ru' },
		    success: function(data) {
		    	for(var i in data.response) {
		    		var item = data.response[i];

		    		if (item.title.toLowerCase() == selectValue.toLowerCase()) {
		    			self.loadCity(item.cid);
		    			select.html('<option selected="true" value="' + item.cid + '">' + item.title + '</option>');

		    			return;
		    		}
		    	}
		    }
		});
	},

	loadCity: function(countryId) {
		var self = this;
		var select = $(self.options.citySelect);
		var selectValue = select.attr('data-value');

		if (selectValue == '') {
			return;
		}

		$.ajax({
			method: 'GET',
		    url: this.options.apiUrl + "database.getCities",
		    dataType: 'json',
		    data: { lang: 'ru', q:  selectValue, country_id: countryId },
		    success: function(data) {
		    	for(var i in data.response) {
		    		var item = data.response[i];

		    		if (item.title.toLowerCase() == selectValue.toLowerCase()) {
		    			self.loadSchool(item.cid);
		    			self.loadUniversity(item.cid);
		    			
		    			select.html('<option selected="true" value="' + item.cid + '">' + item.title + '</option>');

		    			return;
		    		}
		    	}
		    }
		});
	},

	loadUniversity: function(cityId) {
		var self = this;
		var select = $(self.options.universitySelect);
		var selectValue = select.attr('data-value');

		if (selectValue == '') {
			return;
		}

		$.ajax({
			method: 'GET',
		    url: this.options.apiUrl + "database.getUniversities",
		    dataType: 'json',
		    data: { lang: 'ru', q:  selectValue, city_id: cityId },
		    success: function(data) {
		    	for(var i in data.response) {
		    		if (i == 0) {
		    			continue;
		    		}

		    		var item = data.response[i];

		    		if (item.title.toLowerCase() == selectValue.toLowerCase()) {
		    			select.html('<option selected="true" value="' + item.id + '">' + item.title + '</option>');

		    			return;
		    		}
		    	}
		    }
		});
	},

	loadSchool: function(cityId) {
		var self = this;
		var select = $(self.options.schoolSelect);
		var selectValue = select.attr('data-value');

		if (selectValue == '') {
			return;
		}

		$.ajax({
			method: 'GET',
		    url: this.options.apiUrl + "database.getSchools",
		    dataType: 'json',
		    data: { lang: 'ru', q:  selectValue, city_id: cityId },
		    success: function(data) {
		    	for(var i in data.response) {
		    		if (i == 0) {
		    			continue;
		    		}

		    		var item = data.response[i];

		    		if (item.title.toLowerCase() == selectValue.toLowerCase()) {
		    			select.html('<option selected="true" value="' + item.id + '">' + item.title + '</option>');

		    			return;
		    		}
		    	}
		    }
		});
	},

	init: function() {
		this.initCountrySelect();
		this.initCitySelect();
		this.initUniversitySelect();
		this.initSchoolSelect();
	},

	toggleSelects: function() {
		if (this.getCountryId() == 0) {
			$(this.options.citySelect).hide(0);
			$(this.options.universitySelect).hide(0);
			$(this.options.schoolSelect).hide(0);

			return;
		}

		$(this.options.citySelect).show(0);

		if (this.getCityId() == 0) {
			$(this.options.schoolSelect).hide(0);
			return;
		}

		$(this.options.universitySelect).show(0);
		$(this.options.schoolSelect).show(0);
	},

	bindEvents: function() {
		var self = this;

		$(this.options.countrySelect).on('change', function(e) {
			self.toggleSelects();
		});
		$(this.options.citySelect).on('change', function(e) {
			self.toggleSelects();
		});

		$(this.options.universitySelect).on('change', function(e) {
			self.toggleSelects();
		});

		$(this.options.schoolSelect).on('change', function(e) {
			self.toggleSelects();
		});
	},

	getCountryId: function() {
		var val = $(this.options.countrySelect).val();
		
		if ( val != '' && val > 0) {
			return val;
		}

		return 0;
	},

	getCityId: function() {
		var val = $(this.options.citySelect).val();
		
		if ( val != '' && val > 0) {
			return val;
		}

		return 0;
	},

	getUniversityId: function() {
		var val = $(this.options.universitySelect).val();
		
		if ( val != '' && val > 0) {
			return val;
		}

		return 0;
	},

	getSchoolId: function() {
		var val = $(this.options.schoolSelect).val();
		
		if ( val != '' && val > 0) {
			return val;
		}

		return 0;
	},

    formatResult: function(item) {
    	return item.title;
    },

    formatSelection: function(item) {
    	return item.cid;
    },

	initCountrySelect: function() {
		$(this.options.countrySelect).select2({
		  placeholder: $(this.options.countrySelect).attr('data-placeholder'),
		  ajax: {
		  	method: 'GET',
		    url: this.options.apiUrl + "database.getCountries",
		    dataType: 'json',
		    delay: 250,
		    data: function (params) {
		      return {lang: 'ru'};
		    },
		    processResults: function (data, params) {
		    	var term = '';
		    	var results = data.response;

		    	if (params.term != 'undefined'
		    		&& typeof params.term !== 'undefined'
		    	) {
		    		term = params.term.toLowerCase();
		    	}

		    	if (term != '' && term.length > 0) {
			    	results = data.response.filter(function(item) {
			    		//console.log(termRgxp);
			    		return item.title.toLowerCase().startsWith(term);
			    	});		    		
		    	}


		    	results = results.map(function (item) {
                    return {
                        text: item.title,
                        id: item.cid
                    };
                });

	            return {results: results};
		    },
		    cache: true
		  },
		  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
		});
	},

	initCitySelect: function() {
		var self = this;

		$(this.options.citySelect).select2({
		  placeholder: $(this.options.citySelect).attr('data-placeholder'),
		  ajax: {
		  	method: 'GET',
		    url: this.options.apiUrl + "database.getCities",
		    dataType: 'json',
		    delay: 250,
		    data: function (params) {
		      return {
		        q: params.term,
		        lang: 'ru',
		        country_id: self.getCountryId()
		      };
		    },
		    processResults: function (data, params) {
		    	var results = data.response.map(function (item) {
                    return {
                        text: item.title,
                        id: item.cid
                    };
                });

	            return {
	                results: results 
	            };
		    },
		    cache: true
		  },
		});
	},

	initUniversitySelect: function() {
		var self = this;

		$(this.options.universitySelect).select2({
		  placeholder: $(this.options.universitySelect).attr('data-placeholder'),
		  ajax: {
		  	method: 'GET',
		    url: this.options.apiUrl + "database.getUniversities",
		    dataType: 'json',
		    delay: 250,
		    data: function (params) {
		      return {
		        q: params.term,
		        lang: 'ru',
		        city_id: self.getCityId()
		      };
		    },
		    processResults: function (data, params) {
		    	var results = data.response.map(function (item) {
                    return {
                        text: item.title,
                        id: item.id
                    };
                });

	            return {
	                results: results 
	            };
		    },
		    cache: true
		  },
		});
	},

	initSchoolSelect: function() {
		var self = this;

		$(this.options.schoolSelect).select2({
		  placeholder: $(this.options.schoolSelect).attr('data-placeholder'),
		  ajax: {
		  	method: 'GET',
		    url: this.options.apiUrl + "database.getSchools",
		    dataType: 'json',
		    delay: 250,
		    data: function (params) {
		      return {
		        q: params.term,
		        lang: 'ru',
		        city_id: self.getCityId()
		      };
		    },
		    processResults: function (data, params) {
		    	var results = data.response.map(function (item) {
		    		if (item)
                    return {
                        text: item.title,
                        id: item.id
                    };
                });

	            return {
	                results: results 
	            };
		    },
		    cache: true
		  }
		});
	},
};

$(document).ready(function(){
	EduSelect.init();
	EduSelect.loadValues();
	EduSelect.bindEvents();
});