import React, { Component} from 'react';
import { Fact } from './fact';



type QueryProps = {
  facts: ReadonlyArray<Fact>,
  submit:string,
  submitClick:()=>void,
  questionUpdate:(quest:string)=>void,
  question:string
};

export type QueryState = {
};


// show regular page
export class Query extends Component<QueryProps, QueryState> {

  constructor(props: QueryProps) {
    super(props);
    this.state = { question:'none'}
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h2>Question:</h2>
        <input
          type="text"
          placeholder="Enter your question"
          value={this.props.question} // The current value of the input
          onChange={(e) => this.setQueryValue(e.target.value)} // Update the state on input change
        />
        <button type="button" onClick={this.doSubmitClick}>Submit</button>
        <h2>summary</h2>
        {this.renderSummary()}
      </div>);
  };

  doSubmitClick= (): void=>{
    this.props.submitClick();
  }
  setQueryValue=(value:string):void=>{
    this.props.questionUpdate(value);
  }
      
  renderSummary = (): JSX.Element => {
    return <div>{this.props.submit}</div>
  };
}
