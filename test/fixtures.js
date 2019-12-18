
/*
  All XML string responses are actual responses from the Prowl API.
*/

module.exports = {
  verify: {
    invalidKey: '0000000000000000000000000000000000000000',
    invalidKeyResponse: '<?xml version="1.0" encoding="UTF-8"?><prowl><error code="401">Invalid API key</error></prowl>',
    invalidKeyResponseJSON: { code: 401, message: 'Invalid API key' },
    validKey: '1111111111111111111111111111111111111111',
    validKeyResponse: '<?xml version="1.0" encoding="UTF-8"?>\n<prowl>\n<success code="200" remaining="999" resetdate="1576613400" />\n</prowl>\n',
    validKeyResponseJSON: {
      code: 200,
      remaining: 999,
      resetdate: new Date(parseInt(1576613400, 10)),
    },
  },
  retrieveToken: {
    invalidProviderKey: '2222222222222222222222222222222222222222',
    invalidProviderKeyResponse: '<?xml version="1.0" encoding="UTF-8"?><prowl><error code="401">Unknown providerkey \'0000000000000000000000000000000000000000\'</error></prowl>',
    invalidProviderKeyResponseJSON: {
      code: 401,
      message: "Unknown providerkey '0000000000000000000000000000000000000000'",
    },
    validProviderKey: '3333333333333333333333333333333333333333',
    validProviderKeyResponse: '<?xml version="1.0" encoding="UTF-8"?><prowl><success code="200" remaining="999" resetdate="1576705548" /><retrieve token="4444444444444444444444444444444444444444" url="https://www.prowlapp.com/retrieve.php?token=4444444444444444444444444444444444444444" /></prowl>',
    validProviderKeyResponseJSON: {
      code: 200,
      remaining: 999,
      resetdate: new Date(parseInt(1576705548, 10)),
      token: '4444444444444444444444444444444444444444',
      url: 'https://www.prowlapp.com/retrieve.php?token=4444444444444444444444444444444444444444',
    },
  },
  retrieveKey: {
    ValidProviderKey: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    ValidToken: 'cccccccccccccccccccccccccccccccccccccccc',
    ValidResponse: '<?xml version="1.0" encoding="UTF-8"?><prowl><success code="200" remaining="997" resetdate="1576709500" /><retrieve apikey="dddddddddddddddddddddddddddddddddddddddd" /></prowl>',
    ValidResponseJSON: {
      code: 200,
      remaining: 997,
      resetdate: new Date(parseInt(1576709500, 10)),
      apikey: 'dddddddddddddddddddddddddddddddddddddddd',
    },

  },
};
