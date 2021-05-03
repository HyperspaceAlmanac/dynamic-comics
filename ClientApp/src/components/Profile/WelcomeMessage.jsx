'use strict';
import React, { Component } from 'react';
import '../themes.css';

class WelcomeMessage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message : this.props.message
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.message !== this.props.message) {
            let newState = Object.assign({}, this.state);
            newState.message =  this.props.message;
            this.setState(newState);
        }
    }

    handleChange(event) {
      let value = event.target.value;
      if (event.target.value.length > 300) {
        value = value.substring(0, 300);
      }
      let newState = Object.assign({}, this.state);
      newState[event.target.name] =  value;
      this.setState(newState);
    }

    handleSubmit(event) {
      event.preventDefault();
      this.props.updateMessage(this.state.message);
  }

    render() {
      if (this.props.allowEdit) {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <div className="h3">Message(300 characters limit):</div>
                        <textarea className="col-md-10 larger-box" type="text" name="message" value={this.state.message}
                         onChange={this.handleChange} />
                    </div>
                    <div>
                        <input className="btn btn-primary" type="submit" value="Update" />
                    </div>
                   
                </form>
            </div>
          );
      } else {
        return (
          <div>
            <div className="h3">
                Welcome Message:
            </div>
            <div className="col-10">
                {this.props.message}
            </div>
          </div>
        );
      }
    }
}

export default WelcomeMessage;