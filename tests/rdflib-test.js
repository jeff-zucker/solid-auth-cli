#!/usr/bin/env node
const solid   = { auth:require('../src') }
const $rdf    = require('rdflib')
const kb      = $rdf.graph()                 
const fetcher = $rdf.fetcher(kb,{fetch:solid.auth.fetch})
/*
    a command-line script using rdflib to fetch and parse 
    a file requiring login

    CHANGE THESE TO BE A TURTLE FILE REQUIRING LOGIN
    AND A PREDICATE/OBJECT PAIR YOU EXPECT TO TO FIND THERE
*/
var file = "https://jeffz.solid.community/private/hidden.ttl"
var expected_predicate = kb.sym("https://schema.org/name")
var expected_object    = kb.literal("foo")

console.log("logging in ...")
solid.auth.login().then( session => {
    console.log(`logged in as <${session.webId}>`)
    fetcher.load(file).then(function(response) {
        var ok = kb.each(kb.sym(file),expected_predicate,expected_object)
        if(ok.length) console.log("ok");
        else console.log("fail : got something but not the right thing.")
    },e => console.log("Error fetching : "+e))
},e => console.log("Error logging in : "+e))

/* END */
