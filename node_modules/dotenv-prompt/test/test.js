'use strict';

var assert = require('assert');
var dotenv = require('../index');

describe('#create', function() {
	this.timeout(1000 * 60 * 10);

	it('should create an empty .env file', function(done) {
		dotenv.create({}, done);
	});

	it('should create an .env file', function(done) {
		dotenv.create(['PORT'], done);
	});

});
