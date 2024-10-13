import React, { Component } from 'react';
import './styles.css'; // Import the CSS file

type QueryProps = {
  submit: string,
  submitClick: () => void,
  questionUpdate: (quest: string) => void,
  question: string
};

export type QueryState = {};

// Query Component
export class Query extends Component<QueryProps, QueryState> {

  constructor(props: QueryProps) {
    super(props);
    this.state = { question: 'none' };
  }

  render = (): JSX.Element => {
    return (
      <div className="query-container">
        {/* Add UW Photo at the top */}
        <img src="./uw.png" alt="University of Washington" className="uw-photo" />
        
        <h2>Question:</h2>
        <input
          type="text"
          placeholder="Enter your question"
          value={this.props.question}
          onChange={(e) => this.setQueryValue(e.target.value)}
        />
        <button type="button" onClick={this.doSubmitClick}>Submit</button>
        <h2 className="summary-heading">Summary</h2> {/* Space between button and summary */}
        {this.renderSummary()}
      </div>
    );
  };

  doSubmitClick = (): void => {
    this.props.submitClick();
  }

  setQueryValue = (value: string): void => {
    this.props.questionUpdate(value);
  }

  renderSummary = (): JSX.Element => {
    return <div className="summary">{this.props.submit}</div>;
  };
}
