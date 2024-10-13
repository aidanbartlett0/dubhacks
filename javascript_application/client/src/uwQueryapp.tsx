import React, { Component} from "react";
import { Query } from './Query';
import { Fact } from "./fact";


// Indicates which page to show. If it is the details page, the argument
// includes the specific guest to show the dietary restrictions of.
type Page = "query"; 
//what is the AppState rn, facts are the thing tied to the server
type UWQueryAppState = {page: Page, facts: ReadonlyArray<Fact>, summary: String};

 
//note Guest has map like properties by being able to access a single "additional guests"

// Whether to show debugging information in the console.
const DEBUG: boolean = true;

 /** Displays the UI of the Wedding rsvp application. */
  export class UWQueryapp extends Component<{}, UWQueryAppState> {
 
   constructor(props: {}) {
     super(props);
 
     this.state = {page:"query",facts:new Array<Fact>,summary: 'this is where your answer will be'};
  }


   render = (): JSX.Element => {

    if (this.state.page === "query") {
      if (DEBUG) console.debug("rendering list page");
      return <Query facts={this.state.facts}
                          submitClick={this.doSubmitClick}
                          onChange={()=>{}}/>;

    } 
     return <div></div>;
   };
   doSubmitClick = (): void => {
    if (DEBUG) console.debug("set state to add");
    this.setState({summary:"worked"});

  };
 
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
