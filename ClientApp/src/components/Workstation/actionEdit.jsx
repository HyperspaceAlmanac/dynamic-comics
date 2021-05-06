'use strict';
import React, { Component } from 'react';
import '../themes.css';

class ActionEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionObj : this.props.actionObj
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleInt = this.handleInt.bind(this);
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

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState.actionObj[event.target.name] =  event.target.value;
        this.setState(newState);
    }

    handleInt(event) {
        let value;
        if (event.target.value == "") {
            value = 0;
        } else {
            value = parseInt(event.target.value);
        }
        if (!isNaN(value) && value >= 0) {
            let newState = Object.assign({}, this.state);
            newState.actionObj[event.target.name] = value;
            this.setState(newState);
        } else {
            alert("This field requires a positive integer")
        }
    }

    isTriggerToggle() {
        let newState = Object.assign({}, this.state);
        newState.actionObj.isTrigger = !this.state.actionObj.isTrigger;
        this.setState(newState);
    }

    isTransitionToggle() {
        let newState = Object.assign({}, this.state);
        newState.actionObj.transition = !this.state.actionObj.transition;
        this.setState(newState);
    }
    isActiveToggle() {
        let newState = Object.assign({}, this.state);
        newState.actionObj.active = !this.state.actionObj.active;
        this.setState(newState);
    }

    render() {
      return (
            <div>
                <div className="h3">{this.state.actionObj.id === 0 ? "Entry Not Created Yet" : "Id: " + this.state.actionObj.id}</div>
                <div className="col-12">
                    PanelId, NextPanelId, ResourceId
                </div>
                <input className="col-4" type="text" name="panelId" value={this.state.actionObj.panelId}
                    onChange={this.handleInt} />
                <input className="col-4" type="text" name="nextPanelId" value={this.state.actionObj.nextPanelId}
                    onChange={this.handleInt} />
                <input className="col-4" type="text" name="resourceId" value={this.state.actionObj.resourceId}
                    onChange={this.handleInt} />
                <div className="col-12">
                    Timing, Priority, Layer
                </div>
                <input className="col-4" type="text" name="timing" value={this.state.actionObj.timing}
                    onChange={this.handleInt} />
                <input className="col-4" type="text" name="priority" value={this.state.actionObj.priority}
                    onChange={this.handleInt} />
                <input className="col-4" type="text" name="layer" value={this.state.actionObj.layer}
                    onChange={this.handleInt} />
                <div className="col-12">
                    ActionType and Options
                </div>
                <input className="col-6" type="text" name="actionType" value={this.state.actionObj.actionType}
                    onChange={this.handleChange} />
                <input className="col-12" type="text" name="options" value={this.state.actionObj.options}
                    onChange={this.handleChange} />
                <div className="col-12">
                    IsTrigger, Transtion, and Active Toggles
                </div>
                <div className={`col-3 ${this.props.theme}-btn-one ${this.props.theme}-font-color` + " btn"}
                    onClick = {() => this.isTriggerToggle()}>{this.state.actionObj.isTrigger ? "yes" : "no"}</div>
                <div className={`col-3 ${this.props.theme}-btn-one ${this.props.theme}-font-color` + " btn"}
                    onClick = {() => this.isTransitionToggle()}>{this.state.actionObj.transition ? "yes" : "no"}</div>
                <div className={`col-3 ${this.props.theme}-btn-one ${this.props.theme}-font-color` + " btn"}
                    onClick = {() => this.isActiveToggle()}>{this.state.actionObj.active ? "Active" : "Hidden"}</div>
                <br/>
            </div>
      );
    }
}

export default ActionEdit;