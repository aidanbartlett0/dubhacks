import React, { Component} from 'react';
import { Fact } from './fact';



type QueryProps = {
  facts: ReadonlyArray<Fact>,
  submitClick: () => void,
  onChange: (index: number) => void
};

export type QueryState = {
  question:string
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
          value={this.state.question} // The current value of the input
          onChange={(e) => this.setQueryValue(e.target.value)} // Update the state on input change
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={this.doSubmitClick}>Submit</button>
        <h2>summary</h2>
        {this.renderSummary()}
      </div>);
  };

  doSubmitClick=()=>{
    this.props.submitClick();
  }
  setQueryValue(value:string){
    this.setState({question:value});
  }
      
  renderSummary = (): JSX.Element => {
    return <div>where summary goes</div>
  };
}
