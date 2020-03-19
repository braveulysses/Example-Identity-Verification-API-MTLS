# Example Identity Verification API with MTLS

This is a very simple REST API that's for use with an internal tutorial at my company. 

This is a fork of [a similar example API](https://github.com/braveulysses/Example-Identity-Verification-API) 
that adds crude MTLS (client certificate authentication) support to the server. 
Unlike the other example API, which is intended to be easily hosted on Glitch or 
Heroku, it's easier if you just run this one yourself.

Requests to `/users/:userid` are "protected", meaning that they will be rejected 
if the client does not provide a client certificate with a specific CN value, 
which is hard-coded to be "alice".

## How to run the server

Install [NodeJS](https://nodejs.org/en/).

Install [Yarn](https://yarnpkg.com/).

Install the project dependencies.

```bash
yarn install
```

Start the server. By default, it will listen on port 3000 using HTTPS and 
a self-signed certificate.

```bash
yarn start
```

## Testing

A couple example client certificates and keys are provided in the `certs` 
directory. By default, the `01-alice.pem` certificate will be accepted by the 
server, while the `02-carol.pem` certificate will be rejected.

These examples use [httpie](https://httpie.org), but you can use any HTTP 
client that pleases you.

Make a request with the 'alice' cert.

```bash
$ http --verify=no --cert=certs/01-alice.pem --cert-key=certs/01-alice.key https://localhost:3000/users/user.1
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 112
Content-Type: application/json; charset=utf-8
Date: Thu, 19 Mar 2020 18:32:19 GMT
ETag: W/"70-G9oTvFNJxXG0Gn+LN3OPzv3T+Bc"
Vary: Accept
X-Powered-By: Express

{
    "documentType": "driver's license",
    "issuingCountry": "ES",
    "nationality": "ES",
    "username": "user.1",
    "verified": true
}
```

Make a request with the 'carol' cert.

```bash
$ http --verify=no --cert=certs/02-carol.pem --cert-key=certs/02-carol.key https://localhost:3000/users/user.1
HTTP/1.1 403 Forbidden
Connection: keep-alive
Content-Length: 35
Content-Type: application/json; charset=utf-8
Date: Thu, 19 Mar 2020 18:01:55 GMT
ETag: W/"23-eZc6O/uj1EEa6SCtdknBZrooqx4"
Vary: Accept
X-Powered-By: Express

{
    "error": "Client cert auth failed"
}
```