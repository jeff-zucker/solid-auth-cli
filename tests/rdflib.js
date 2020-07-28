#!/usr/bin/env node
const solid   = { auth:require('solid-auth-cli') }
const $rdf    = require('rdflib')
const store   = $rdf.graph()                 
const fetcher = $rdf.fetcher(store,{fetch:solid.auth.fetch})

var file = "https://jeffz.solid.community/profile/card#me"
var expected_predicate = store.sym("http://xmlns.com/foaf/0.1/name")
var expected_object    = store.literal("Jeff Zucker")

process.env.SOLID_IDP = 'https://solid.community'
process.env.SOLID_USERNAME = 'solid-auth-cli-test-user'
process.env.SOLID_PASSWORD = '123'

it('rdflib', async () => {
    const session = await solid.auth.login()
    const response = await fetcher.load(file)
    const ok = store.each(store.sym(file),expected_predicate,expected_object)
    expect(ok.length).toBeGreaterThan(0)
})
