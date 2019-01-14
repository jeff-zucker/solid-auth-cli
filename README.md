# solid-auth-cli
**a node/command-line Solid client with persistent login**
<br><a href="http://badge.fury.io/js/solid-auth-cli">![npm](https://badge.fury.io/js/solid-auth-cli.svg)</a>

This library provides the same API and abilities as solid-auth-client
but works in a browserless nodejs context. 

### login()
### login( path-to-credentials-json-file )
### login({ idp:"https://idp.example.com", username:"you", password:"hmm" })

The login method needs an Identity Provider, username, and password.  Those may be passed in as an object or read from a specified JSON file.  If called with no arguments, login() will look for a configuration file in ~/.solid-auth-cli-config.json. The password may be omitted from the configuration file, in which case, solid-auth-cli will prompt for a password before login.

### An example
```javascript
const solid = { auth:require('solid-auth-cli') }
/*
   A private resource and some text I expect to find there
*/
const resource = "https://jeffz.solid.community/public/private/hidden.html"
const expected = "only the owner"                                 

console.log("logging in ...")
login(idp).then( session => {
    console.log(`logged in as <${session.webId}>`)
    solid.auth.fetch(resource).then( response => {
        if (!response.ok) console.log(response.status+" "+response.statusText)
        response.text().then( content => {
            if( content.match(new RegExp(expected)) ) console.log("ok")
            else console.log("Got something , but not the right thing.")
        },e => console.log("Error parsing : "+e))
    },e => console.log("Error fetching : "+e))
},e => console.log("Error logging in : "+e))

async function login(idp) {
    var session = await solid.auth.currentSession()
    if (!session) session = await solid.auth.login(idp)
    return session;
}
```



&copy; Jeff Zucker, 2019, may be freely distributed using an MIT license
