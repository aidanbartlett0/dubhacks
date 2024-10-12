import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";



// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check
let array:Array<unknown>=new Array<unknown>;

let savedPage: unknown='list';

/** 
 * Returns a greeting message if "name" is provided in query params
 * @param req request to respond to
 * @param res object to send response with
 */
export const add_guest = (req: SafeRequest, res: SafeResponse): void => {
  const guest:unknown = req.body.guest;
  if (guest === undefined) {
    res.status(400).send('required argument "guest" was missing');
    return;
  }
  if (guest === null) {
    res.status(400).send('guest was null');
    return;
  }
    if(!isAGuest(guest)){
      res.status(400).send('value sent is not a guest');
      return;
    }
  
  array.push(guest);
  res.status(200).send({saved: true});  
};
/** 
 * Returns a greeting message if "name" is provided in query params
 * @param req request to respond to
 * @param res object to send response with
 */
export const save_guest = (req: SafeRequest, res: SafeResponse): void => {
  const guest:unknown = req.body.guest;
  if (guest === undefined) {
    res.status(400).send('required argument "guest" was missing');
    return;
  }
  if (guest === null) {
    res.status(400).send('guest was null');
    return;
  }
  const index:unknown=req.body.index;
  if (index === undefined) {
    res.status(400).send('required argument "index" was missing');
    return;
  }
  if (typeof index !== 'number') {
    res.status(400).send('not number');
    return;
  }
   if(!isAGuest(guest)){
      res.status(400).send('value sent is not a guest');
      return;
    }
  if(index>=array.length){
    res.status(400).send('index is out of bounds');
    return;
  }
  array[index]=guest;
  res.status(200).send({saved: true});  
};
/** Handles request for /load by returning the transcript requested. */
export const load_guest = (_req: SafeRequest, res: SafeResponse): void => {
  //just grabing/yoinking array
    res.status(200).send({array:array});

}
/** 
 * saves page
 * @param req request to respond to
 * @param res object to send response with
 */
export const save_page = (req: SafeRequest, res: SafeResponse): void => {
  const page:unknown = req.body.page;
  if (page === undefined) {
    res.status(400).send('required argument "page" was missing');
    return;
  }
  if (page === null) {
    res.status(400).send('page was null');
    return;
  }
 if(!isAPage(page)){
   res.status(400).send('value sent is not a page');
    return;
  }
  
  savedPage=page;
  res.status(200).send({saved: true});  
};
/** Handles request for /load by returning the transcript requested. */
export const load_page = (_req: SafeRequest, res: SafeResponse): void => {
  //just grabing/yoinking page
    res.status(200).send({page:savedPage});

}
/**just for testing, clears map */
export const resetTranscriptsForTesting=():void=>{
array=new Array<unknown>;
savedPage='list';
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/** returns true if unknown is a Guest, only exported for testing purposes */
export const isAGuest=(guest:unknown):boolean=>{
  if(!!guest &&
    typeof guest === "object" &&

    "name" in guest &&
    typeof guest.name === "string" &&

    "guestOf" in guest &&
    !!guest.guestOf &&
    typeof guest.guestOf === "object" &&
    "from" in guest.guestOf &&
    (typeof guest.guestOf.from === 'string'||typeof guest.guestOf.from ==='undefined') &&

    "family" in guest &&
    typeof guest.family === "boolean" &&

    "dietary" in guest &&
    typeof guest.dietary === "string" &&

    "addGuest" in guest &&
    typeof guest.addGuest === "string" &&

    "gGdiet" in guest &&
    typeof guest.gGdiet === "string" &&

    "bringingSomeone" in guest &&
    typeof guest.bringingSomeone === "string"){
    return true;

    }else{
      return false;
    }
}

/** returns true if unknown is a Guest, only exported for testing purposes */
export const isAPage=(page:unknown):boolean=>{
  if(page==='list'||
  page==='add'||
  (!!page &&
    typeof page === "object" &&
    'kind' in page &&
    page.kind==='details'&&
    'guest' in page &&
    typeof page.guest==="number")){
    return true;

    }else{
      return false;
    }
}

