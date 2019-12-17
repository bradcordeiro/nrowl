"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const _require = require('https'),
      request = _require.request;

const querystring = require('querystring');

const xml2js = require('xml2js');

const endpointBase = 'https://api.prowlapp.com/publicapi/';

function prowlRequest(endpoint, params, method) {
  const formattedParams = querystring.encode(params);
  const APIrequest = request(`${endpointBase}/${endpoint}?${formattedParams}`, method);
  return new Promise((resolve, reject) => {
    APIrequest.on('response', response => {
      response.setEncoding('utf-8');
      let xml = '';
      response.on('data', chunk => {
        xml += chunk;
      });
      response.on('error', error => reject(error));
      response.on('end', () => {
        xml2js.parseStringPromise(xml, {
          explicitArray: false,
          mergeAttrs: true
        }).then(result => resolve(result.prowl));
      });
    });
    APIrequest.end();
  });
}

function send(apikey, application, options) {
  if (!options.event && !options.description) {
    throw new Error('options.event or options.description is required.');
  }

  const parameters = {};
  parameters.apikey = Array.isArray(apikey) ? apikey.join(',') : apikey;
  Object.assign(parameters, options);
  Object.assign(parameters, {
    application
  });
  return prowlRequest('add', parameters, 'POST');
}

function isKeyValid(_x, _x2) {
  return _isKeyValid.apply(this, arguments);
}

function _isKeyValid() {
  _isKeyValid = _asyncToGenerator(function* (apikey, providerkey) {
    let result;

    if (Array.isArray(apikey)) {
      return Promise.all(apikey.map(key => isKeyValid(key, providerkey)));
    }

    if (providerkey) {
      result = yield prowlRequest('verify', {
        apikey,
        providerkey
      }, 'GET');
    }

    result = yield prowlRequest('verify', {
      apikey
    }, 'GET');
    return result.success !== undefined;
  });
  return _isKeyValid.apply(this, arguments);
}

const areKeysValid = isKeyValid;

function retrieveToken(providerkey) {
  return prowlRequest('retrieve/token', {
    providerkey
  }, 'GET');
}

function retrieveAPIKey(providerkey, token) {
  return prowlRequest('retrieve/apikey', {
    providerkey,
    token
  }, 'GET');
}

module.exports = {
  send,
  isKeyValid,
  areKeysValid,
  retrieveToken,
  retrieveAPIKey
};