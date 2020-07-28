const { isTerm } = require('rdflib');

var solid;
if( typeof(window) === "undefined") solid = { auth:require('../src') }

/* This script works in the browser using solid-auth-client
   and on the command line using solid-auth-cli.

   For both versions, change the settings below
      idp - your IDP
      resource - a text file that requires login
      expected - text you expect to find in that file

   For browser version: 
       open test.html
   For command line:
       run node test
*/
const idp      = "https://solid.community"
const resource = "https://solid-auth-cli-test-user.solid.community/private/hidden.html"
const expected = "only the owner"                                 

it('login', async () => {
    console.log("logging in ...")
    let session
    try {
        session = await login(idp)
    } catch (e) {
        throw new Error('Error logging in : ' + e)
    }
    console.log(`logged in as <${session.webId}>`)
    const response = await solid.auth.fetch(resource)
    if (!response.ok) {
        throw new Error(`Error fetching : ${response.status} ${response.statusText}`)
    }
    let content
    try {
        content = await response.text()
    } catch (e) {
        throw new Error('Error parsing : ' + e)
    }
    if( content.match(new RegExp(expected)) ) return
    else throw new Error("Got something , but not the right thing.")
})

async function login(idp) {
    process.env.SOLID_IDP = idp
    process.env.SOLID_USERNAME = 'solid-auth-cli-test-user'
    process.env.SOLID_PASSWORD = '123'
    session = await solid.auth.login(idp)
    if(session) return(session)
    else throw new Error()
}
