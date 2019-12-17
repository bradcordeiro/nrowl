const { request } = require('https');
const querystring = require('querystring');
const xml2js = require('xml2js');

const endpointBase = 'https://api.prowlapp.com/publicapi/';

function prowlRequest(endpoint, params, method) {
  const formattedParams = querystring.encode(params);

  const APIrequest = request(`${endpointBase}/${endpoint}?${formattedParams}`, method);

  return new Promise((resolve, reject) => {
    APIrequest.on('response', (response) => {
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

function send(apikey, application, options) {
  if (!options.event && !options.description) {
    throw new Error('options.event or options.description is required.');
  }

  const parameters = {};
  parameters.apikey = Array.isArray(apikey) ? apikey.join(',') : apikey;

  Object.assign(parameters, options);
  Object.assign(parameters, { application });

  return prowlRequest('add', parameters, 'POST');
}

async function isKeyValid(apikey, providerkey) {
  let result;

  if (Array.isArray(apikey)) {
    return Promise.all(apikey.map((key) => isKeyValid(key, providerkey)));
  }

  if (providerkey) {
    result = await prowlRequest('verify', { apikey, providerkey }, 'GET');
  }

  result = await prowlRequest('verify', { apikey }, 'GET');

  return result.success !== undefined;
}
const areKeysValid = isKeyValid;

function retrieveToken(providerkey) {
  return prowlRequest('retrieve/token', { providerkey }, 'GET');
}

function retrieveAPIKey(providerkey, token) {
  return prowlRequest('retrieve/apikey', { providerkey, token }, 'GET');
}

module.exports = {
  send,
  isKeyValid,
  areKeysValid,
  retrieveToken,
  retrieveAPIKey,
};
