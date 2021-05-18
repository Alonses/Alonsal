'use strict';

var prompt = require('prompt');
var fs = require('fs');

function isNull(value) {
	return [null, undefined, ''].indexOf(value) > -1;
}

function setDefaults(envs, options) {
	var defaults = {};

	if (typeof options.defaults === 'object') {
		defaults = options.defaults;
	}

	for (var env in defaults) {
		var defaultValue = defaults[env];
		var value = envs[env];
		if (isNull(value)) {
			envs[env] = defaultValue;
		}
	}
}

function writeEnvFile(envs, file) {
	file = file || '.env';
	var lines = ['#'];

	for (var env in envs) {
		var value = envs[env].toString();
		lines.push([env, value].join('='));
	}
	fs.writeFileSync(file, lines.join('\n'));
}

function initParams(options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	if (typeof callback !== 'function') {
		throw new Error('callback param is required');
	}
	options = options || {};
	options.message = options.message || 'env';

	return {
		options: options,
		callback: callback
	};
}

/**
 * Get environment variables from console input.
 * @param  {PromptObject} data - Variables to get.
 * @param  {Object} [options] - Options
 * @param  {Function} callback - A callback function
 */
function get(data, options, callback) {
	var params = initParams(options, callback);
	options = params.options;
	callback = params.callback;

	if (Array.isArray(data) && data.length === 0 || typeof data === 'object' && Object.keys(data).length === 0) {
		return callback(null, {});
	}

	prompt.message = options.message;
	prompt.start();
	prompt.get(data, function(error, envs) {
		if (error) {
			return callback(error);
		}
		setDefaults(envs, options);
		callback(null, envs);
	});
}

function save(envs, file) {
	writeEnvFile(envs, file);
}

/**
 * Get environment variables from console input and save to .env file.
 * @param  {PromptObject} data - Variables to get.
 * @param  {Object} [options] - Options
 * @param  {Function} callback - A callback function
 */
function create(data, options, callback) {
	var params = initParams(options, callback);
	options = params.options;
	callback = params.callback;

	get(data, options, function(error, envs) {
		if (error) {
			return callback(error);
		}
		save(envs, options.file);
		return callback(null, envs);
	});
}

exports.create = create;
exports.get = get;
exports.save = save;
