/* eslint-env mocha */
const { expect } = require('chai');
const nock = require('nock');
const nrowl = require('../src');
const Fixtures = require('./fixtures');


describe('verify()', () => {
  it('Returns a success object for a valid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.validKey })
      .reply(200, Fixtures.verify.validKeyResponse);

    return nrowl.verify(Fixtures.verify.validKey)
      .then((response) => {
        expect(typeof response).to.equal('object');
        expect(typeof response.success).to.equal('object');

        expect(response.success.code).to.equal('200');
        expect(response.success.remaining).to.equal('999');
        expect(response.success.resetdate).to.equal('1576613400');
      });
  });

  it('Returns an error object for an invalid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.invalidKey })
      .reply(401, Fixtures.verify.invalidKeyResponse);

    return nrowl.verify(Fixtures.verify.invalidKey)
      .then((response) => {
        expect(typeof response).to.equal('object');
        expect(typeof response.error).to.equal('object');

        expect(response.error.code).to.equal('401');
        expect(response.error._).to.equal('Invalid API key');
      });
  });
});

describe('isKeyValid()', () => {
  it('returns true for a valid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.validKey })
      .reply(200, Fixtures.verify.validKeyResponse);

    return nrowl.isKeyValid(Fixtures.verify.validKey)
      .then((response) => expect(response).to.equal(true));
  });

  it('Returns an false for an invalid key', () => {
    nock('https://api.prowlapp.com')
      .get('/publicapi/verify')
      .query({ apikey: Fixtures.verify.invalidKey })
      .reply(401, Fixtures.verify.invalidKeyResponse);

    return nrowl.isKeyValid(Fixtures.verify.invalidKey)
      .then((response) => expect(response).to.equal(false));
  });
});
