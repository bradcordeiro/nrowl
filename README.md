# nrowl - Prowl for Node.js API
Send push notifications using the [Prowl](http://www.prowlapp.com/) service.

## Installation

```shell
	npm install nrowl
```

## Usage

The API requires your API Key, which you can generate by [creating a Prowl account](https://www.prowlapp.com/register.php) and visiting your [API Keys page](https://www.prowlapp.com/api_settings.php).

```javascript
const Prowl = require('nrowl');

Prowl.add(YOUR_API_KEY, 'Push Notifier', { description: 'So easy to use!' });

Prowl.add(YOUR_API_KEY, 'Push Notifier', { 
  event: 'Some event',
  description: 'So easy to use!',
  providerkey: YOUR_PROVIDER_KEY,
  priority: 2,
  url: 'http://www.prowlapp.com/',
}
```

## API

### Functions
All functions are static (you don't need to call `new` to instantiate an instance).

#### add()

```javascript
Prowl.add(apikey, application, options)
```
* **apikey** (String): The Prowl API key, or an array of keys, to send the notification to.
* **application** (String): The name of your application, which appears as part of the notification.
* **options** (Object): Any other parameters available from the [Prowl API](https://www.prowlapp.com/api.php#add). Per Prowl's requirements, this must include either `event` or `description` or both.

Sends a push notification to the supplied API key(s).

Returns a Promise that resolves on a successful push ore rejects on failure with an object in the generic format (see Generic Return Objects below).

#### verify()

Verify that a Prowl API Key is valid. This uses the Prowl API and counts against your usage limits.

```javascript
Prowl.verify(apikey, providerkey);
```

* **apikey** (String): the API key to check.
* **providerkey** (String): Your provider key, if you have one. This is optional.

Returns a Promise that resolves when the API key is valid or rejects when the API key is invalid (see Generic Return Objects below).

#### retrieveToken(providerkey)

Fetch a registration token for use with `retrieveAPIKey()`.

```javascript
Prowl.retrieveToken(providerkey)
```

* **providerkey** (String): Your Provider Key.

Returns a Promise that resolves with a generic success object (see Generic Return Objects below) with two additional properties:

* **token** (String): a registration token, required when getting an API key using `retrieveAPIKey()`.
* **url** (String): a URL to a confirmation page the user must complete to be issued an API key.

#### retrieveAPIKey()

Fetch an API key for a user.

```javascript
Prowl.retrieveAPIKey(providerkey, token);
```

* **providerkey** (String): Your Provider Key.
* **token** (String): A token returned from `retrieveToken()`.

Returns a Promise that resolves with a generic success object (see Generic Return Objects below) with an additional property:

* **apikey** (String): The user's new API key.

### Generic Return Objects

Prowl API responses follow a generic format for both success and failure of API calls.

On success:
```javascript
{
  code: 200, // HTTP status code; will be 200 on a successful call
  remaining: 999, // Count of remaining available API calls.
  resetdate: Wed Dec 18 2019 18:35:16 GMT-0800 (Pacific Standard Time) // (Date object) Time when your available API calls reset.
}
```

On failure:
```javascript
{
  code: 401 //  HTTP status code; see the [Prowl API Documentation](https://www.prowlapp.com/api.php#return) for a list of codes.
  message: 'Invalid API key' // Human-readable error message.
}
```

## Contribute

I'm happy to accept contributions. ESLint is included as a dev dependency to conform to the [Airbnb Style Guide](https://github.com/airbnb/javascript).

## Testing

[Mocha](https://mochajs.org/) is used as the test runner, [Chai](https://www.chaijs.com/) for its assertions, and [Nock](https://github.com/nock/nock) to simulate responses from the Prowl API.

## Changelog

### 2019-08-31

* Initial release. Initially forked from [node-prowl](https://github.com/arnklint/node-prowl) but I ended up rewriting everything in ES2105.