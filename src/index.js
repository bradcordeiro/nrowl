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

function verify(apikey, providerkey) {
  if (providerkey) {
    return prowlRequest('verify', { apikey, providerkey }, 'GET');
  }

  return prowlRequest('verify', { apikey }, 'GET');
}

function retrieveToken(providerkey) {
  return prowlRequest('retrieve/token', { providerkey }, 'GET');
}

function retrieveAPIKey(providerkey, token) {
  return prowlRequest('retrieve/apikey', { providerkey, token }, 'GET');
}

async function isKeyValid(apikey, providerkey) {
  if (Array.isArray(apikey)) {
    return Promise.all(apikey.map((key) => isKeyValid(key, providerkey)));
  }

  let result;

  if (providerkey) {
    result = await verify(apikey, providerkey);
  }

  result = await verify(apikey);

  return result.success !== undefined;
}
const areKeysValid = isKeyValid;

module.exports = {
  send,
  verify,
  retrieveToken,
  retrieveAPIKey,
  isKeyValid,
  areKeysValid,
};
