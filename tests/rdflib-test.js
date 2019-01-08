#!/usr/bin/env node
const solid   = { auth:require('../src') }
const $rdf    = require('./rdflib-modified') // MODIFIED VERSION
const kb      = $rdf.graph()                 
/*
    a command-line script using rdflib to fetch and parse 
    a file requiring login

    YOU MUST CREATE A solid-credentials FILE (SEE THE README)
    THEN CHANGE THESE TO BE A TURTLE FILE REQUIRING LOGIN
    AND A PREDICATE/OBJECT PAIR YOU EXPECT TO TO FIND THERE
*/
var file = kb.sym("https://jeffz.solid.community/private/hidden.ttl")
var expected_predicate = kb.sym("https://schema.org/name")
var expected_object    = kb.literal("foo")

console.log("logging in ...")
solid.auth.login().then( session => {
    console.log(`logged in as <${session.webId}>`)
    $rdf.fetcher(kb).load(file).then(function(response) {
        var ok = kb.each(file,expected_predicate,expected_object)
        if(ok.length) console.log("ok");
        else console.log("fail : got something but not the right thing.")
    },e => console.log("Error fetching : "+e))
},e => console.log("Error logging in : "+e))

/* END */
