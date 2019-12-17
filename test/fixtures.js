module.exports = {
  verify: {
    validKey: 'be8907c8c8eeab9c4d36ae4969dd6f566b948728',
    validKeyResponse: '<?xml version="1.0" encoding="UTF-8"?>\n<prowl>\n<success code="200" remaining="999" resetdate="1576613400" />\n</prowl>\n',
    invalidKey: '0123456789012345678901234567890123456789',
    invalidKeyResponse: '<?xml version="1.0" encoding="UTF-8"?><prowl><error code="401">Invalid API key</error></prowl>',
  },
};
