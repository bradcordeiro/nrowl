const Prowl = require('./dist');

// Prowl.isKeyValid('be8907c8c8eeab9c4d36ae4969dd6f566b948728');

Prowl.areKeysValid(['be8907c8c8eeab9c4d36ae4969dd6f566b948728', '4372156b0d917af31cd835fe66ea774691f1cb25'])
  .then(console.log);
