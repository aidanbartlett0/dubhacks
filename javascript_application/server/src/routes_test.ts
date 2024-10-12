import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { isAGuest, isAPage, load_guest, load_page, resetTranscriptsForTesting, add_guest, save_page, save_guest } from './routes';
import { Guest } from './guest';


describe('routes', function() {


  const mgB0:Guest={name:'bill',guestOf:{from:'Molly'},family:true,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'0'};
    //const mgB1:Guest={name:'hein',guestOf:{from:'Molly'},family:true,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'1'};
    const mgBU:Guest={name:'zero',guestOf:{from:'Molly'},family:false,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'unknown'};
    //const jgB0:Guest={name:'dill',guestOf:{from:'James'},family:true,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'0'};
    const jgB1:Guest={name:'sara',guestOf:{from:'James'},family:true,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'1'};
    //const jgBU:Guest={name:'me',guestOf:{from:'James'},family:false,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'unknown'};
    it('isAGuest',function(){
      assert.deepStrictEqual(isAGuest(mgB0),true);
      assert.deepStrictEqual(isAGuest(jgB1),true);
      //not a record
      assert.deepStrictEqual(isAGuest(''),false);
      // each with one field left out
      assert.deepStrictEqual(isAGuest({name:'me',guestOf:{from:'James'},family:false,dietary:"none",addGuest:'',gGdiet:"",}),false);
      assert.deepStrictEqual(isAGuest({name:'me',guestOf:{from:'James'},family:false,dietary:"none",addGuest:'',bringingSomeone:'unknown'}),false);
      assert.deepStrictEqual(isAGuest({name:'me',guestOf:{from:'James'},family:false,dietary:"none",gGdiet:"",bringingSomeone:'unknown'}),false);
      assert.deepStrictEqual(isAGuest({name:'me',guestOf:{from:'James'},family:false,addGuest:'',gGdiet:"",bringingSomeone:'unknown'}),false);
      assert.deepStrictEqual(isAGuest({name:'me',guestOf:{from:'James'},dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'unknown'}),false);
      assert.deepStrictEqual(isAGuest({name:'me',guestOf:{},family:false,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'unknown'}),false);
      assert.deepStrictEqual(isAGuest({name:'me',family:false,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'unknown'}),false);
      assert.deepStrictEqual(isAGuest({guestOf:{from:'James'},family:false,dietary:"none",addGuest:'',gGdiet:"",bringingSomeone:'unknown'}),false);
    });
    it('isAPage',function(){
      assert.deepStrictEqual(isAPage('list'),true);
      assert.deepStrictEqual(isAPage('add'),true);
      assert.deepStrictEqual(isAPage({kind:'details',guest:1}),true);
      assert.deepStrictEqual(isAPage({kind:'details',guest:50}),true);
      //wrong stings
      assert.deepStrictEqual(isAPage(''),false);
      assert.deepStrictEqual(isAPage('death'),false);
      assert.deepStrictEqual(isAPage('daffodil'),false);
      // each with one field left out
      assert.deepStrictEqual(isAPage({kind:'details',}),false);
      assert.deepStrictEqual(isAPage({guest:4}),false);
      assert.deepStrictEqual(isAPage({kind:'details',guest:'d'}),false);
      assert.deepStrictEqual(isAPage({kind:2,guest:1}),false);
      assert.deepStrictEqual(isAPage({kind:'detaiLs',guest:1}),false);
    });
  it('add_guest', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/add_guest', body: {}});
    const res = httpMocks.createResponse();
    add_guest(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "guest" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add_guest', body: {content: "some stuff"}});
    const res1 = httpMocks.createResponse();
    add_guest(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "guest" was missing');
    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add_guest', body: {guest: null}});
    const res2 = httpMocks.createResponse();
    add_guest(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
    'guest was null');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add_guest', body: {guest: null, content:'a'}});
    const res3 = httpMocks.createResponse();
    add_guest(req3, res3);
    
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
    'guest was null');

    // Third branch, straight line code

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {guest:jgB1}});
    const res4 = httpMocks.createResponse();
    add_guest(req4, res4);

    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: true});

    const req5 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {guest:mgBU}});
    const res5 = httpMocks.createResponse();
    add_guest(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add_guest', body: {guest:'s'}});
  const res9 = httpMocks.createResponse();
  add_guest(req9, res9);
  
  assert.deepStrictEqual(res9._getStatusCode(), 400);
  assert.deepStrictEqual(res9._getData(),
  'value sent is not a guest');
    

    // Third branch, straight line code

    const req10 = httpMocks.createRequest({method: 'POST', url: '/api/add_guest',
        body: {guest:{kind:'ddd',number:1}}});
    const res10 = httpMocks.createResponse();
    add_guest(req10, res10);

    assert.deepStrictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(), 'value sent is not a guest');
    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });
let testarr=new Array<Guest>;
  it('load_guest', function() {
    
    // just need 3 tests for first edge case and other larger tests
    //edge or no data case
    const loadReqE = httpMocks.createRequest(
      {method: 'GET', url: '/api/load_guest', query: {}});
  const loadResE = httpMocks.createResponse();
  load_guest(loadReqE, loadResE);
  // Validate that both the status code and the output is as expected
  assert.deepStrictEqual(loadResE._getStatusCode(), 200);
  assert.deepStrictEqual(loadResE._getData(), {array:testarr});
  


    const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/add_guest',
        body: {guest:jgB1}});
    const saveResp = httpMocks.createResponse();
    add_guest(saveReq, saveResp);
    testarr.push(jgB1);
    // Now we can actually (mock a) request to load the transcript
    const loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/load_guest', query: {}});
    const loadRes = httpMocks.createResponse();
    load_guest(loadReq, loadRes);
    // Validate that both the status code and the output is as expected
    assert.deepStrictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {array:testarr});
    


    // second test of successful loading test (using "" edge case)
    // First need to save something in order to load it
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/add_guest',
        body: {guest:mgB0}});
    const saveResp2 = httpMocks.createResponse();
    add_guest(saveReq2, saveResp2);
    testarr.push(mgB0);
    // Now we can actually (mock a) request to load the transcript
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load_guest', query: {name: "albert"}});
    const loadRes2 = httpMocks.createResponse();
    load_guest(loadReq2, loadRes2);
    // Validate that both the status code and the output is as expected
    assert.deepStrictEqual(loadRes2._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes2._getData(), {array:testarr});
  
  });

  it('save_page', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_page', body: {}});
    const res = httpMocks.createResponse();
    save_page(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "page" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_page', body: {content: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save_page(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "page" was missing');
    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_page', body: {page: null}});
    const res2 = httpMocks.createResponse();
    save_page(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
    'page was null');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_page', body: {page: null, content:'a'}});
    const res3 = httpMocks.createResponse();
    save_page(req3, res3);
    
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
    'page was null');


  const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save_page', body: {page:'s'}});
  const res9 = httpMocks.createResponse();
  save_page(req9, res9);
  
  assert.deepStrictEqual(res9._getStatusCode(), 400);
  assert.deepStrictEqual(res9._getData(),
  'value sent is not a page');
    

    // Third branch, straight line code

    const req10 = httpMocks.createRequest({method: 'POST', url: '/api/save_page',
        body: {page:{kind:'ddd',number:1}}});
    const res10 = httpMocks.createResponse();
    save_page(req10, res10);

    assert.deepStrictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(), 'value sent is not a page');

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
    body: {page:'list'}});
const res4 = httpMocks.createResponse();
save_page(req4, res4);

assert.deepStrictEqual(res4._getStatusCode(), 200);
assert.deepStrictEqual(res4._getData(), {saved: true});

    const req5 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {page:'add'}});
    const res5 = httpMocks.createResponse();
    save_page(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    const req6 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {page:{kind:'details',guest:1}}});
    const res6 = httpMocks.createResponse();
    save_page(req6, res6);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });
  it('save_guest', function() {
    const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/add_guest',
    body: {guest:jgB1}});
const saveResp = httpMocks.createResponse();
add_guest(saveReq, saveResp);

const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/api/add_guest',
    body: {guest:jgB1}});
const saveResp1 = httpMocks.createResponse();
add_guest(saveReq1, saveResp1);
//2 in server right now

    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_guest', body: {index:0}});
    const res = httpMocks.createResponse();
    add_guest(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "guest" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_guest', body: {content: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save_guest(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "guest" was missing');
    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_guest', body: {guest: null}});
    const res2 = httpMocks.createResponse();
    save_guest(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
    'guest was null');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save_guest', body: {guest: null, content:'a'}});
    const res3 = httpMocks.createResponse();
    save_guest(req3, res3);
    
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
    'guest was null');

    const reqb = httpMocks.createRequest(
      {method: 'POST', url: '/api/save_guest', body: {guest:jgB1}});
  const resb = httpMocks.createResponse();
  save_guest(reqb, resb);

  assert.deepStrictEqual(resb._getStatusCode(), 400);
  assert.deepStrictEqual(resb._getData(),
      'required argument "index" was missing');

  const req1b = httpMocks.createRequest(
      {method: 'POST', url: '/api/save_guest', body: {guest:jgB1,content: "some stuff"}});
  const res1b = httpMocks.createResponse();
  save_guest(req1b, res1b);

  assert.deepStrictEqual(res1b._getStatusCode(), 400);
  assert.deepStrictEqual(res1b._getData(),
      'required argument "index" was missing');
  // Second branch, straight line code, error case
  const req2b = httpMocks.createRequest(
      {method: 'POST', url: '/api/save_guest', body: {guest: jgB1,index:null}});
  const res2b = httpMocks.createResponse();
  save_guest(req2b, res2b);

  assert.deepStrictEqual(res2b._getStatusCode(), 400);
  assert.deepStrictEqual(res2b._getData(),
  'not number');

  const req3b = httpMocks.createRequest(
      {method: 'POST', url: '/api/save_guest', body: {guest: jgB1,index:'', content:'a'}});
  const res3b = httpMocks.createResponse();
  save_guest(req3b, res3b);
  
  assert.deepStrictEqual(res3b._getStatusCode(), 400);
  assert.deepStrictEqual(res3b._getData(),
  'not number');

//case when not a guest
  const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save_guest', body: {guest:'s',index:1}});
  const res9 = httpMocks.createResponse();
  save_guest(req9, res9);
  
  assert.deepStrictEqual(res9._getStatusCode(), 400);
  assert.deepStrictEqual(res9._getData(),
  'value sent is not a guest');

    const req10 = httpMocks.createRequest({method: 'POST', url: '/api/save_page',
        body: {guest:{kind:'ddd',number:1},index:1}});
    const res10 = httpMocks.createResponse();
    save_guest(req10, res10);

    assert.deepStrictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(), 'value sent is not a guest');

    const req90 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save_guest', body: {guest:jgB1,index:2}});
  const res90 = httpMocks.createResponse();
  save_guest(req90, res90);
  
  assert.deepStrictEqual(res90._getStatusCode(), 400);
  assert.deepStrictEqual(res90._getData(),
  'index is out of bounds');
    

    // Third branch, straight line code

    const req100 = httpMocks.createRequest({method: 'POST', url: '/api/save_page',
        body: {guest:jgB1,index:1000}});
    const res100 = httpMocks.createResponse();
    save_guest(req100, res100);

    assert.deepStrictEqual(res100._getStatusCode(), 400);
    assert.deepStrictEqual(res100._getData(), 'index is out of bounds');



    //cases to see if changes are being made
    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/save_guest',
    body: {guest:mgB0,index:0}});
const res4 = httpMocks.createResponse();
save_guest(req4, res4);

assert.deepStrictEqual(res4._getStatusCode(), 200);
assert.deepStrictEqual(res4._getData(), {saved: true});
const reql = httpMocks.createRequest({method: 'GET', url: '/api/load_guest',
    query: {guest:mgB0,index:0}});
const resl = httpMocks.createResponse();
load_guest(reql,resl);
assert.deepStrictEqual(resl._getStatusCode(), 200);
let arr=new Array<Guest>;
arr.push(mgB0);
arr.push(jgB1);
assert.deepStrictEqual(resl._getData(), {array: arr});
arr.pop();
arr.pop();


const req5 = httpMocks.createRequest({method: 'POST', url: '/api/save_guest',
    body: {guest:mgBU,index:1}});
const res5 = httpMocks.createResponse();
save_guest(req5, res5);

assert.deepStrictEqual(res4._getStatusCode(), 200);
assert.deepStrictEqual(res4._getData(), {saved: true});
const reql1 = httpMocks.createRequest({method: 'GET', url: '/api/load_guest',
    query: {guest:mgB0,index:0}});
const resl1 = httpMocks.createResponse();
load_guest(reql1,resl1);
assert.deepStrictEqual(resl1._getStatusCode(), 200);
arr=new Array<Guest>;
arr.push(mgB0);
arr.push(mgBU);
assert.deepStrictEqual(resl._getData(), {array: arr});

    


    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });

  it('load_page', function() {
    
    // just need 3 tests for first edge case and other larger tests
    //edge or no data case
    const loadReqE = httpMocks.createRequest(
      {method: 'GET', url: '/api/load_page', query: {}});
  const loadResE = httpMocks.createResponse();
  load_page(loadReqE, loadResE);
  // Validate that both the status code and the output is as expected
  assert.deepStrictEqual(loadResE._getStatusCode(), 200);
  assert.deepStrictEqual(loadResE._getData(), {page:'list'});
  


    const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/save_page',
        body: {page:'add'}});
    const saveResp = httpMocks.createResponse();
    save_page(saveReq, saveResp);
    // Now we can actually (mock a) request to load the transcript
    const loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/load_page', query: {}});
    const loadRes = httpMocks.createResponse();
    load_page(loadReq, loadRes);
    // Validate that both the status code and the output is as expected
    assert.deepStrictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {page:'add'});
    
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/api/save_page',
    body: {page:'list'}});
const saveResp1 = httpMocks.createResponse();
save_page(saveReq1, saveResp1);
// Now we can actually (mock a) request to load the transcript
const loadReq1 = httpMocks.createRequest(
    {method: 'GET', url: '/api/load_page', query: {}});
const loadRes1 = httpMocks.createResponse();
load_page(loadReq1, loadRes1);
// Validate that both the status code and the output is as expected
assert.deepStrictEqual(loadRes1._getStatusCode(), 200);
assert.deepStrictEqual(loadRes1._getData(), {page:'list'});

    // second test of successful loading test (using "" edge case)
    // First need to save something in order to load it
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/save_page',
        body: {page:{kind:'details',guest:1}}});
    const saveResp2 = httpMocks.createResponse();
    save_page(saveReq2, saveResp2);
    // Now we can actually (mock a) request to load the transcript
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load_page', query: {name: "albert"}});
    const loadRes2 = httpMocks.createResponse();
    load_page(loadReq2, loadRes2);
    // Validate that both the status code and the output is as expected
    assert.deepStrictEqual(loadRes2._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes2._getData(), {page:{kind:'details',guest:1}});

    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/save_page',
        body: {page:{kind:'details',guest:5}}});
    const saveResp3 = httpMocks.createResponse();
    save_page(saveReq3, saveResp3);
    // Now we can actually (mock a) request to load the transcript
    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load_page', query: {name: "albert"}});
    const loadRes3 = httpMocks.createResponse();
    load_page(loadReq3, loadRes3);
    // Validate that both the status code and the output is as expected
    assert.deepStrictEqual(loadRes3._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes3._getData(), {page:{kind:'details',guest:5}});
  
  });

});
