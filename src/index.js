/* a light layer on top of solid-cli, giving it persistant 
 * sessions and making it conform to the same API as 
 * solid-auth-client
 */

"use strict";

// import * as ifetch          from 'isomorphic-fetch';
// import * as SolidClient     from '@solid/cli/src/SolidClient';
// import * as IdentityManager from '@solid/cli/src/IdentityManager';
// import * as fs              from 'fs';
// import * as path            from 'path';

// cjs-start
const ifetch          = require('isomorphic-fetch');
const SolidClient     = require('@solid/cli/src/SolidClient');
const IdentityManager =require('@solid/cli/src/IdentityManager');
const fs = require('fs');
const path = require('path');
exports.fetch = fetch;
exports.currentSession = currentSession;
exports.login = login;
exports.logout = logout;
exports.getCredentials = getCredentials;
// cjs-end

var session;
const idMan = new IdentityManager()
const client = new SolidClient({ identityManager : new IdentityManager() });

/*  TBD: make fetch a two-step request like solid-auth-client
 *  check if authorization needed and only send token if it its
 */
/*cjs*/ async function fetch(url,request){
    request = request || {};
    request.method = request.method || 'GET';
    request.headers = request.headers || {};
    if( session ) {
         let token = await client.createToken(url, session);
         request.credentials = "include";
         request.headers.authorization= `Bearer ${token}`;
    }
    return await ifetch(url,request);
}
/* 
 *  RATHER MINIMAL, BUT FOR NOW THEY"LL DO
 */
/*cjs*/ async function logout() {
    session = undefined;    
    return(1);
}
/*cjs*/ async function currentSession(){
    if (session && !client.isExpired(session))
        return(session)
}
/*cjs*/ function login( cfg ) {
    return new Promise((resolve, reject)=>{
        if( typeof cfg==="string" ) cfg=undefined // s-a-client compatability 
        cfg = cfg || getCredentials();
        client.login(
            cfg.idp,{username:cfg.username,password:cfg.password}
        ).then( sess => {
            sess.webId = sess.idClaims.sub
            session = sess
            resolve(session);
        }, e => {reject("Couldn't login "+e)} )
    })
}
/*cjs*/ function getCredentials(fn){
        fn = fn || path.join(process.env.HOME,".solid-auth-cli-config.json")
        fn = (fs.existsSync(fn))  
           ? fn 
           : path.join(__dirname,"solid-credentials.json")
        var creds;
        try {
            creds = fs.readFileSync(fn,'utf8');
        } catch(err) { throw new Error("read file error "+err) }
        try {
            creds = JSON.parse( creds );
            if(!creds) throw new Error("JSON parse error : "+err)
        } catch(err) { throw new Error("JSON parse error : "+err) }
        return(creds)
}
