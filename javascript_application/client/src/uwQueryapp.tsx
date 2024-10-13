import React, { Component} from "react";
import { Query } from './Query';
import { MongoClient} from 'mongodb';

const uri = "mongodb+srv://aidanb04:dubhackshacker@dubhacks.qxk8w.mongodb.net/";

// Create a new MongoClient
const client = new MongoClient(uri);
//import { Fact } from "./fact";
//const {perplexity} =require("node_perplexityai");





// Indicates which page to show. If it is the details page, the argument
// includes the specific guest to show the dietary restrictions of.
type Page = "query"; 
//what is the AppState rn, facts are the thing tied to the server
type UWQueryAppState = {page: Page, keywords: Map<string,bigint>, question:string,summary: string};



// Whether to show debugging information in the console.
const DEBUG: boolean = true;

 /** Displays the UI of the Wedding rsvp application. */
  export class UWQueryapp extends Component<{}, UWQueryAppState> {
 
   constructor(props: {}) {
     super(props);
 
     this.state = {page:"query",keywords:new Map<string,bigint>(),summary: 'this is where your answer will be',question:"random"};
  }


   render = (): JSX.Element => {

    if (this.state.page === "query") {
      if (DEBUG) console.debug("rendering list page");
      return <Query submit={this.state.summary}
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
    this.setState({summary:"worked"});

  };
  doQuestChange=(quest:string): void =>{
    if (DEBUG) console.debug("set state to add");
    this.setState({question:quest});

  };
 queryPerplexity=():void=>{

  //
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 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',
      'Content-Type': 'application/json'
    },
    body: '{"model":"llama-3.1-sonar-small-128k-online","messages":[{"role":"user","content":"'+'anything we give you look into:'+this.state.keywords+'and return the id of what matches the prompt:'+this.state.question+'the best"}],"search_domain_filter":[]}'
  };
  fetch('https://api.perplexity.ai/chat/completions', options)
  .then(response => response.json())
  .then((response:any)=>{this.setState({summary:response.choices[0].message.content});console.log(response.choices[0].message.content)})
  .catch(err => console.error(err));
  }

    


  
  

}
// Connection URL and Database Name
async function connectToMongoDB() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Ping the server to check the connection
    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Select the database and collection
    const db = client.db('dubhacks');
    const uwwebsites = db.collection('uwwebsites');

    // Optionally: Test a query or insert operation
    const data = await uwwebsites.findOne();
    console.log('Sample data from uwwebsites collection:', data);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

// Call the function to connect
connectToMongoDB();
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
