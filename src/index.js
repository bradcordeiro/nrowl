const { request } = require('https');
const querystring = require('querystring');
const xml2js = require('xml2js');

function prowlRequest(endpoint, params, method) {
  const formattedParams = querystring.encode(params);

  const options = {
    host: 'api.prowlapp.com',
    path: `/publicapi/${endpoint}?${formattedParams}`,
    method,
  };

  return new Promise((resolve, reject) => {
    const APIrequest = request(options, (response) => {
      response.setEncoding('utf-8');
      let xml = '';

      response.on('data', (chunk) => { xml += chunk; });
      response.on('error', (error) => reject(error));
      response.on('end', () => {
        xml2js.parseStringPromise(xml, { explicitArray: false, mergeAttrs: true })
          .then((result) => resolve(result.prowl));
      });
    });

    APIrequest.end();
  });
}

function transformSuccessResponse(response) {
  return {
    code: parseInt(response.success.code, 10),
    remaining: parseInt(response.success.remaining, 10),
    resetdate: new Date(parseInt(response.success.resetdate, 10)),
  };
}

function transformErrorResponse(response) {
  return {
    code: parseInt(response.error.code, 10),
    message: response.error._,
  };
}

async function add(apikey, application, options) {
  if (!options.event && !options.description) {
    throw new Error('options.event or options.description is required.');
  }

  const parameters = {};
  parameters.apikey = Array.isArray(apikey) ? apikey.join(',') : apikey;

  Object.assign(parameters, options);
  Object.assign(parameters, { application });

  const response = await prowlRequest('add', parameters, 'POST');

  if (response.error) {
    throw transformErrorResponse(response);
  }

  return transformSuccessResponse(response);
}

async function verify(apikey, providerkey) {
  let response;

  if (providerkey) {
    response = await prowlRequest('verify', { apikey, providerkey }, 'GET');
  }

  response = await prowlRequest('verify', { apikey }, 'GET');

  if (response.success) {
    return transformSuccessResponse(response);
  }

  throw transformErrorResponse(response);
}

async function retrieveToken(providerkey) {
  const response = await prowlRequest('retrieve/token', { providerkey }, 'GET');

  if (response.error) {
    throw transformErrorResponse(response);
  }

  const success = transformSuccessResponse(response);
  Object.assign(success, response.retrieve);

  return success;
}

async function retrieveAPIKey(providerkey, token) {
  const response = await prowlRequest('retrieve/apikey', { providerkey, token }, 'GET');

  if (response.error) {
    throw transformErrorResponse(response);
  }

  const success = transformSuccessResponse(response);
  Object.assign(success, response.retrieve);

  return success;
}

async function isKeyValid(apikey, providerkey) {
  if (Array.isArray(apikey)) {
    return Promise.all(apikey.map((key) => isKeyValid(key, providerkey)));
  }

  let result;

  try {
    if (providerkey) {
      result = await verify(apikey, providerkey);
    }

    result = await verify(apikey);
  } catch (_) {
    return false;
  }

  return result.code === 200;
}
const areKeysValid = isKeyValid;

module.exports = {
  add,
  verify,
  retrieveToken,
  retrieveAPIKey,
  isKeyValid,
  areKeysValid,
};
