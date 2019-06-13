#!/usr/bin/env node
const auth = require('../src/index.js'); // solid-auth-cli
const fetch = auth.fetch
const path  = require("path")

let base  = "file://"+process.cwd()+"/"
const foldername  = "test2";
const filename   = "file-test.ttl";

const folder   = base + foldername
const file    = folder + "/"+ filename ;
const deep  = "file://"+path.join(base,foldername,"test3",filename);
const bad = "FOO"+filename;
const msg     = '{"msg":"hello world"}';

if(typeof test ==="undefined"){
  run();
}
else {
test('POST Container',()=>{
    return expect( postContainer(base,foldername)).resolves.toBe(201);
});

test('POST Resource',()=>{
    return expect(postResource(folder,filename+"X")).resolves.toBe(201);
});
test('PUT Resource',  ()=>{
    return expect(putResource(file)).resolves.toBe(201);
});
test('PUT Resource in non-existant folder',  ()=>{
    return expect(putResource(deep)).resolves.toBe(201);
});
test('405 attemtpt to put a container',  ()=>{
    return expect(putContainer(folder)).resolves.toBe(405);
});
test('GET Resource',  ()=>{
    return expect(getResource(file)).resolves.toBe(true);
});
test('GET Container', ()=>{
    return expect(getContainer(folder)).resolves.toBe(true);
});
/*
test("GET JSON",()=>{
    return expect(getJSON(file)).resolves.toBe(true);
});
*/
test('409 delete non-empty folder',()=>{
    return expect(deleteResource(folder)).resolves.toBe(409);
});
test('DELETE Resource in sub-folder',()=>{
    return expect(deleteResource(deep)).resolves.toBe(200)
});
test('DELETE Container sub-folder',()=>{
    return expect(deleteResource(path.join(folder,"test3"))).resolves.toBe(200)
});
test('DELETE Resource other file',()=>{
    return expect(deleteResource(file+"X")).resolves.toBe(200)
});
test('DELETE Resource file',()=>{
    return expect(deleteResource(file)).resolves.toBe(200)
});
test('DELETE Container',()=>{
    return expect(deleteResource(folder)).resolves.toBe(200)
});
test('404 delete non-existant file',()=>{
    return expect(deleteResource(file)).resolves.toBe(404);
});
test('404 delete non-existant folder',()=>{
    return expect(deleteResource(folder)).resolves.toBe(404);
});
test('404 post when containing folder non-existant',()=>{
    return expect(postContainer(base+"/bad/",foldername)).resolves.toBe(404);
});
test('404 get non-existant file',()=>{
    return expect(getContainer(file)).resolves.toBe(false);
});
test('404 get non-existant folder',()=>{
    return expect(getContainer(folder)).resolves.toBe(false);
});
test('405 method not supported',()=>{
    return expect(getBadMethod(file)).resolves.toBe(405);
});

}
async function getResource(file){
    let res = await fetch(file);
    if( res.status != 200 ) return false;
    let txt = await res.text()
    return( txt === msg );
}
async function putResource(file){
    let res = await fetch(file,{method:"PUT",body:msg});
    return res.status;
}
async function putContainer(folder){
    let res = await fetch(folder,{method:"PUT",body:msg});
    return res.status;
}
async function postResource(folder,file,extra){
    let results;
    let link= '<http://www.w3.org/ns/ldp#Resource>; rel="type"';
    if(extra && extra==="noSlug") headers = { Link:link };
    try { results = await fetch(folder,{
         method:"POST",
         headers : { Slug:file, Link:link },
         body: msg,
    })  }
    catch(err) { results = err.response; console.log(err) }
    return (results.status);
}
async function postContainer(container,newFolder){
    let results;
    let link='<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"';
    try { results = await fetch( container, {
        "method":"POST",
        headers: { Slug:newFolder, Link:link, "Content-type":"text/turtle" }
    })  }
    catch(err) { results = err.response; }
    return (results);
}
async function getContainer(pathname){
    let results;
    try { results = await fetch(pathname); }
    catch(err) { results = err.response; }
    if( results.status != 200 ) return false;
    return true;
}
async function deleteResource(pathname,bad){
    let results;
    try { results = await fetch(pathname,{method:"DELETE"});  }
    catch(err) { results = err.response; }
    return results.status;
}
async function getBadMethod(file){
    let results;
    let link= '<http://www.w3.org/ns/ldp#Resource>; rel="type"';
    try { results = await fetch(folder,{
         method:"JUNK",
         headers : { Slug:file, Link:link },
         body: msg,
    })  }
    catch(err) { results = err.response; console.log(err) }
    return (results.status);
}
async function getJSON(file){
    let res = await fetch(file);
    if( res.status != 200 ) return false;
    let txt = await res.json()
    if(txt.msg==="hello world") return true;
}
function ok(expected,got){
    console.log( expected===got ? "ok" : "fail "+got );
}

async function run(){
    ok( 201, await postContainer(base,foldername));
    ok( 201, await putResource(file) );
    ok( 201, await putResource(file) );
    ok( 201, await postResource(folder,bad) );
    ok( true, await getResource(file) );
    ok( true, await getContainer(folder) );
    ok( 409, await deleteResource(folder) );
    ok( 200, await deleteResource(file) );
    ok( 200, await deleteResource(folder+"/"+bad) );
    ok( 200, await deleteResource(folder) );
    ok( 404, await deleteResource(file) );
    ok( 404, await deleteResource(folder) );
//    ok( 404, await postContainer(base+"/bad/",foldername));
    ok( false, await getResource(file,1) );
    ok( false, await getContainer(folder,1) );
    ok( 405, await getBadMethod(file) );
}

