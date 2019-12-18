"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const _require = require('https'),
      request = _require.request;

const querystring = require('querystring');

const xml2js = require('xml2js');

function prowlRequest(endpoint, params, method) {
  const formattedParams = querystring.encode(params);
  const options = {
    host: 'api.prowlapp.com',
    path: `/publicapi/${endpoint}?${formattedParams}`,
    method
  };
  return new Promise((resolve, reject) => {
    const APIrequest = request(options, response => {
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

function transformSuccessResponse(response) {
  return {
    code: parseInt(response.success.code, 10),
    remaining: parseInt(response.success.remaining, 10),
    resetdate: new Date(parseInt(response.success.resetdate, 10))
  };
}

function transformErrorResponse(response) {
  return {
    code: parseInt(response.error.code, 10),
    message: response.error._
  };
}

function add(_x, _x2, _x3) {
  return _add.apply(this, arguments);
}

function _add() {
  _add = _asyncToGenerator(function* (apikey, application, options) {
    if (!options.event && !options.description) {
      throw new Error('options.event or options.description is required.');
    }

    const parameters = {};
    parameters.apikey = Array.isArray(apikey) ? apikey.join(',') : apikey;
    Object.assign(parameters, options);
    Object.assign(parameters, {
      application
    });
    const response = yield prowlRequest('add', parameters, 'POST');

    if (response.error) {
      throw transformErrorResponse(response);
    }

    return transformSuccessResponse(response);
  });
  return _add.apply(this, arguments);
}

function verify(_x4, _x5) {
  return _verify.apply(this, arguments);
}

function _verify() {
  _verify = _asyncToGenerator(function* (apikey, providerkey) {
    let response;

    if (providerkey) {
      response = yield prowlRequest('verify', {
        apikey,
        providerkey
      }, 'GET');
    }

    response = yield prowlRequest('verify', {
      apikey
    }, 'GET');

    if (response.success) {
      return transformSuccessResponse(response);
    }

    throw transformErrorResponse(response);
  });
  return _verify.apply(this, arguments);
}

function retrieveToken(_x6) {
  return _retrieveToken.apply(this, arguments);
}

function _retrieveToken() {
  _retrieveToken = _asyncToGenerator(function* (providerkey) {
    const response = yield prowlRequest('retrieve/token', {
      providerkey
    }, 'GET');

    if (response.error) {
      throw transformErrorResponse(response);
    }

    const success = transformSuccessResponse(response);
    Object.assign(success, response.retrieve);
    return success;
  });
  return _retrieveToken.apply(this, arguments);
}

function retrieveAPIKey(_x7, _x8) {
  return _retrieveAPIKey.apply(this, arguments);
}

function _retrieveAPIKey() {
  _retrieveAPIKey = _asyncToGenerator(function* (providerkey, token) {
    const response = yield prowlRequest('retrieve/apikey', {
      providerkey,
      token
    }, 'GET');

    if (response.error) {
      throw transformErrorResponse(response);
    }

    const success = transformSuccessResponse(response);
    Object.assign(success, response.retrieve);
    return success;
  });
  return _retrieveAPIKey.apply(this, arguments);
}

function isKeyValid(_x9, _x10) {
  return _isKeyValid.apply(this, arguments);
}

function _isKeyValid() {
  _isKeyValid = _asyncToGenerator(function* (apikey, providerkey) {
    if (Array.isArray(apikey)) {
      return Promise.all(apikey.map(key => isKeyValid(key, providerkey)));
    }

    let result;

    try {
      if (providerkey) {
        result = yield verify(apikey, providerkey);
      }

      result = yield verify(apikey);
    } catch (_) {
      return false;
    }

    return result.code === 200;
  });
  return _isKeyValid.apply(this, arguments);
}

const areKeysValid = isKeyValid;
module.exports = {
  add,
  verify,
  retrieveToken,
  retrieveAPIKey,
  isKeyValid,
  areKeysValid
};