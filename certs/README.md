# Test certs

This directory includes certs and keys that can be used for testing, including
the server cert and key.

The "alice" and "carol" certs are example certs that can be used as client certs.
They have common name (cn) values of "alice" and "carol", respectively.

To use one of the client certs with [httpie](https://httpie.org), for example,
you would do:

```bash
$ http --verify=no --cert=01-alice.pem --cert-key=01-alice.key https://localhost:3000/users/user.1
```

For reference, the certs (including the server cert) were generated based on
steps at:
https://gist.github.com/mtigas/952344
