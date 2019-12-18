/* eslint-env mocha */
const { expect } = require('chai');
const nock = require('nock');
const Prowl = require('../dist');
const Fixtures = require('./fixtures');

describe('add()', () => {
  it('Returns a Promise that resolves with a success object on successful push');
  it('Returns a Promise that rejects with an error object on successful push');
});

describe('verify()', () => {
  it('Returns a Promise resolving with a success object for a valid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.validKey })
      .reply(200, Fixtures.verify.validKeyResponse);

    return Prowl.verify(Fixtures.verify.validKey)
      .then((response) => {
        expect(typeof response).to.equal('object');
        expect(response).to.deep.equal(Fixtures.verify.validKeyResponseJSON);
      });
  });

  it('Returns a Promise rejecting with an error object for an invalid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.invalidKey })
      .reply(401, Fixtures.verify.invalidKeyResponse);

    return Prowl.verify(Fixtures.verify.invalidKey)
      .then(() => Promise.reject(new Error('Expected function to reject')))
      .catch((response) => {
        expect(typeof response).to.equal('object');
        expect(response).to.deep.equal(Fixtures.verify.invalidKeyResponseJSON);
      });
  });
});

describe('retrieveToken()', () => {
  it('Returns a Promise resolving with a success object with token and url', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/retrieve/token')
      .query({ providerkey: Fixtures.retrieveToken.validProviderKey })
      .reply(401, Fixtures.retrieveToken.validProviderKeyResponse);

    return Prowl.retrieveToken(Fixtures.retrieveToken.validProviderKey)
      .then((response) => {
        expect(typeof response).to.equal('object');
        expect(response).to.deep.equal(Fixtures.retrieveToken.validProviderKeyResponseJSON);
      });
  });

  it('Returns a Promise rejecting with an error object for an invalid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/retrieve/token')
      .query({ providerkey: Fixtures.retrieveToken.invalidProviderKey })
      .reply(401, Fixtures.retrieveToken.invalidProviderKeyResponse);

    return Prowl.retrieveToken(Fixtures.retrieveToken.invalidProviderKey)
      .then(() => Promise.reject(new Error('Expected function to reject')))
      .catch((response) => {
        expect(typeof response).to.equal('object');
        expect(response).to.deep.equal(Fixtures.retrieveToken.invalidProviderKeyResponseJSON);
      });
  });
});

describe('retrieveAPIKey()', () => {
  it('Returns a Promise that resolves with a success object on successful retrieval', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/retrieve/apikey')
      .query({
        providerkey: Fixtures.retrieveKey.ValidProviderKey,
        token: Fixtures.retrieveKey.ValidToken,
      })
      .reply(401, Fixtures.retrieveKey.ValidResponse);

    return Prowl.retrieveAPIKey(Fixtures.retrieveKey.ValidProviderKey, Fixtures.retrieveKey.ValidToken)
      .then((response) => {
        expect(typeof response).to.equal('object');
        expect(response).to.deep.equal(Fixtures.retrieveKey.ValidResponseJSON);
      });
  });

  it('Returns a Promise that rejects with an error ojbect on invalid token');
});

describe('isKeyValid()', () => {
  it('Returns a Promise resolving to true for a valid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.validKey })
      .reply(200, Fixtures.verify.validKeyResponse);

    return Prowl.isKeyValid(Fixtures.verify.validKey)
      .then((response) => expect(response).to.equal(true));
  });

  it('Returns a Promise resolving to false for an invalid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.invalidKey })
      .reply(401, Fixtures.verify.invalidKeyResponse);

    return Prowl.isKeyValid(Fixtures.verify.invalidKey)
      .then((response) => expect(response).to.equal(false));
  });
});
