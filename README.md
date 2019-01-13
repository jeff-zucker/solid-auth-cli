# solid-auth-cli
**a node/command-line Solid client with persistent login**

This library provides the same API and abilities as solid-auth-client
but works in a browserless nodejs context. 

## login()
## login( path-to-credentials-json-file )
## login({ idp:"https://idp.example.com", username:"you", password:"hmm" })

The login method needs an Identity Provider, username, and password.  Those may be passed in as an object or read from a specified JSON file.  If called with no arguments, login() will look for a credentials file in ~/.solid-credentials.json.  

In this example, tests would be run in "https://you.example.com/public/test"

&copy; Jeff Zucker, 2019, may be freely distributed using an MIT license