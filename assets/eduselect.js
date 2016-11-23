var EduSelect = {
	options: {
		countrySelect: '.js-eduselect-country',
		citySelect: '.js-eduselect-city',
		universitySelect: '.js-eduselect-university',
		schoolSelect: '.js-eduselect-school'
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
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getCountries",
		    dataType: 'json',
		    data: { lang: 'ru' },
		    success: function(data) {
		    	for(var i in data.response) {
		    		var item = data.response[i];

		    		if (item.title == selectValue) {
		    			self.loadCity(item.cid);
		    			select.html('<option selected="true" value="' + item.cid + '">' + item.title + '</option>');
		    			self.init();
		    			
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
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getCities",
		    dataType: 'json',
		    data: { lang: 'ru', q:  selectValue, country_id: countryId },
		    success: function(data) {
		    	for(var i in data.response) {
		    		var item = data.response[i];

		    		if (item.title == selectValue) {
		    			self.loadUniversity(item.cid);
		    			self.loadSchool(item.cid);

		    			select.html('<option selected="true" value="' + item.cid + '">' + item.title + '</option>');
		    			self.init();

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
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getUniversities",
		    dataType: 'json',
		    data: { lang: 'ru', q:  selectValue, city_id: cityId },
		    success: function(data) {
		    	for(var i in data.response) {
		    		var item = data.response[i];

		    		if (item.title == selectValue) {
		    			select.html('<option selected="true" value="' + item.id + '">' + item.title + '</option>');
		    			self.init();

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
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getSchools",
		    dataType: 'json',
		    data: { lang: 'ru', q:  selectValue, city_id: cityId },
		    success: function(data) {
		    	for(var i in data.response) {
		    		var item = data.response[i];

		    		if (item.title == selectValue) {
		    			select.html('<option selected="true" value="' + item.id + '">' + item.title + '</option>');
		    			self.init();

		    			return;
		    		}
		    	}
		    }
		});
	},

	init: function() {
		this.initCountrySelect();

		if (this.getCountryId() == 0) {
			$(this.options.citySelect).hide(0);
			$(this.options.universitySelect).hide(0);
			$(this.options.schoolSelect).hide(0);

			return;
		}

		this.initCitySelect();
		
		$(this.options.citySelect).show(0);

		if (this.getCityId() == 0) {
			$(this.options.schoolSelect).hide(0);
			return;
		}

		this.initUniversitySelect();
		this.initSchoolSelect();

		$(this.options.universitySelect).show(0);
		$(this.options.schoolSelect).show(0);
	},

	bindEvents: function() {
		var self = this;

		$(this.options.countrySelect).on('change', function(e) {
			self.init();
		});
		$(this.options.citySelect).on('change', function(e) {
			self.init();
		});

		$(this.options.universitySelect).on('change', function(e) {
			self.init();
		});

		$(this.options.schoolSelect).on('change', function(e) {
			self.init();
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
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getCountries",
		    dataType: 'json',
		    delay: 250,
		    data: function (params) {
		      return {
		        lang: 'ru'
		      };
		    },
		    processResults: function (data, params) {
		    	var results = $.map(data.response, function (item) {
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
		  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
		});
	},

	initCitySelect: function() {
		var self = this;

		$(this.options.citySelect).select2({
		  placeholder: $(this.options.citySelect).attr('data-placeholder'),
		  ajax: {
		  	method: 'GET',
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getCities",
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
		    	var results = $.map(data.response, function (item) {
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
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getUniversities",
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
		    	var results = $.map(data.response, function (item) {
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
		    url: "https://crossorigin.me/https://api.vk.com/method/database.getSchools",
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
		    	var results = $.map(data.response, function (item) {
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