'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class ActionEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            aciontObj : {}
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.state.actionObj = this.props.actionObj;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.actionObj !== this.props.actionObj) {
            let newState = Object.assign({}, this.state);
            newState.actionObj =  this.props.actionObj;
            this.setState(newState);
        }
    }

    displayForm() {
        /**
        Id = ca.Id,
        ActionType = ca.ActionType,
        Active = ca.Active,
        IsTrigger = ca.IsTrigger,
        Layer = ca.Layer,
        NextPanelId = ca.NextPanelId,
        Options = ca.Options,
        PanelId = ca.PanelId,
        Priority = ca.Priority,
        ResourceId = ca.ResourceId,
        Timing = ca.Timing,
        Transition = ca.Transition
        **/
    }

    handleChange(event) {
      this.props.updateAction(event.target.name, event.target.value);
    }

    render() {
      return (
        <div>
            Action Editor Page
        </div>
      );
    }
    /**
     *             <form>
                <div>{"Id: " + this.state.actionObj.Id}</div>
                <div className="col-12">
                    <span>Action Type: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
                <div className="col-12">
                    <span>Action Type: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
                <div className="col-12">
                    <span>Action Type: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
                <div className="col-12">
                    <span>Action Type: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
                <div className="col-12">
                    <span>Action Type: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
                <div className="col-12">
                    <span>Action Type: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
                <div className="col-12">
                    <span>Action Type: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
                <div className="col-6">
                    <span>Active:</span><span className="btn"></span>
                </div>
                <div className="col-6">
                    <span>IsTrigger: </span><input type="text" name="actionType" value={this.state.actionObj.actionType}
                      onChange={this.handleChange} />
                </div>
            </form>
     */
}

export default ActionEdit;