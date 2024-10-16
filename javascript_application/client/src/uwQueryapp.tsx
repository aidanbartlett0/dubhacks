import React, { Component} from "react";
import { Query } from './Query';
import {Website} from './website';
//import { MongoClient} from 'mongodb';

//const uri = "mongodb+srv://aidanb04:dubhackshacker@dubhacks.qxk8w.mongodb.net/";

// Create a new MongoClient
//const client = new MongoClient(uri);
//import { Fact } from "./fact";
//const {perplexity} =require("node_perplexityai");





// Indicates which page to show. If it is the details page, the argument
// includes the specific guest to show the dietary restrictions of.
type Page = "query"; 
//what is the AppState rn, facts are the thing tied to the server
type UWQueryAppState = {page: Page, keywords: Array<Website>, question:string,summary: string};



// Whether to show debugging information in the console.
const DEBUG: boolean = true;

 /** Displays the UI of the Wedding rsvp application. */
  export class UWQueryapp extends Component<{}, UWQueryAppState> {
 
   constructor(props: {}) {
     super(props);
 
     this.state = {page:"query",keywords:new Array<Website>(),summary: 'this is where your answer will be',question:"random"};
  }


   render = (): JSX.Element => {
    this.fetchWebsites();
    if (this.state.page === "query") {
      if (DEBUG) console.debug("rendering list page");
      return <Query
                        submit={this.state.summary}
                          submitClick={this.doSubmitClick}
                          question={this.state.question}
                          questionUpdate={this.doQuestChange}
                          />;

    } 
     return <div></div>;
   };
   doSubmitClick=(): void =>{
    if (DEBUG) console.debug("do summary");
    //perplexity call right here
    this.queryPerplexity();
    this.setState({summary:"Loading..."});

  };
  doQuestChange=(quest:string): void =>{
    if (DEBUG) console.debug("set state to add");
    this.setState({question:quest});

  };
 queryPerplexity=async():Promise<void>=>{

  //
  const temp:Array<Website> =this.state.keywords.slice(0);
  const DICTIONARY:string=temp.map((web)=>{
    return '\nhash_id: '+web.hash_id+' keys: '+web.keys;
  }).join('\n');
  const HASH:string=temp.map((web)=>{
    return 'hash_id: '+web.hash_id;
  }).join('\n');
  const content:string="Given a dictionary of hash_ids and a list of KEYS at "+DICTIONARY+", return the URL where the keywords at KEYS best match the given "+this.state.question+". Return NOTHING except the "+HASH+" from the "+DICTIONARY+" that BEST matches the keywords at KEYS. Do not explain your reasoning. Do not return the keywords. Your response should be formatted like this: \"Best Matching hash_id: <hash_id HERE>.\". You CAN NOT return a hash_id that is not included in the "+HASH+""
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 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',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({model:"llama-3.1-sonar-small-128k-online",
      messages:[{role:"user",
        content:content}],
        search_domain_filter:[]})
  };
  console.log(this.stringify(this.state.keywords));
  await fetch('https://api.perplexity.ai/chat/completions', options)
  .then(response => response.json())
  .then((response:any)=>{
    const found:string=response.choices[0].message.content;
    console.log(found);
    const id:String= found.slice(22,-1);
    console.log('id found:'+id);
    const obj: Website | undefined = this.state.keywords.find((web: Website) => {
      console.log('Comparing', `"${web.hash_id}"`, 'with', `"${id}"`); // Add quotes to visually identify extra spaces
      return String(web.hash_id).trim().toLowerCase() === String(id).trim().toLowerCase();
    });
    console.log(obj);
    let summ:string;
    if(obj!=undefined){
      summ=obj.summary;
      console.log('Hash found');
    }else{
      summ='error';
      console.log('Hash not found');
    }

    console.log(response);this.setState({summary:summ});console.log(response);})
  .catch(err => console.error(err));
  }
    
   fetchWebsites = async (): Promise<void> => {
    return new Promise((resolve, reject) => {

      fetch('/api/mgdb', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ keywords: data.data });
        console.log(this.state.keywords);
        resolve();
      })
   .catch(err => reject(err))});

  
  

}
// Connection URL and Database Name
stringify=(array:Array<Website>):string=>{
  const temp =array.slice(0);
  
  return temp.map((web)=>{
    return 'id:'+web._id+'\n keywords:'+web.keys.map((str)=>{
      if(str.length<30&&str.length>0){
        return str+'*';
      }else{//do nothing
        return '';
      }
    }).join('');
  
  }).join('\n\n');
}
}


/*
type WeddingAppState = {
  name: string;  // mirror state of name text box
  msg: string;   // message sent from server
}


/** Displays the UI of the Wedding rsvp application. *//*
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {name: "", msg: ""};
  }
  
  render = (): JSX.Element => {
    return (<div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="name" id="name" value={this.state.name}
                 onChange={this.doNameChange}></input>
          <button onClick={this.doDummyClick}>Dummy</button>
        </div>
        {this.renderMessage()}
      </div>);
  };

  renderMessage = (): JSX.Element => {
    if (this.state.msg === "") {
      return <div></div>;
    } else {
      return <p>Server says: {this.state.msg}</p>;
    }
  };

  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value, msg: ""});
  };

  doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const name = this.state.name.trim();
    if (name.length > 0) {
      const url = "/api/dummy?name=" + encodeURIComponent(name);
      fetch(url).then(this.doDummyResp)
          .catch(() => this.doDummyError("failed to connect to server"));
    }
  };

  doDummyResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doDummyJson)
          .catch(() => this.doDummyError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doDummyError)
          .catch(() => this.doDummyError("400 response is not name"));
    } else {
      this.doDummyError(`bad status code ${res.status}`);
    }
  };

  doDummyJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("200 response is not a record", data);
      return;
    }

    if (typeof data.msg !== "string") {
      console.error("'msg' field of 200 response is not a string", data.msg);
      return;
    }

    this.setState({msg: data.msg});
  }

  doDummyError = (msg: string): void => {
    console.error(`Error fetching /api/dummy: ${msg}`);
  };

}*/
