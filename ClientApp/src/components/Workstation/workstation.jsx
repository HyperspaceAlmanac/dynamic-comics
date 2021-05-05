'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Canvas from '../Canvas/canvas';
import '../themes.css';

class Workstation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            theme : 'science',
            font : 'arial',
            user : "",
            sideBar : "timeline",
            preview : false,
            published : true
        }
    }

    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.user = "MagicalPaintBrush";
        this.setState(newState);
    }
    setSideBarState(value) {
        let newState = Object.assign({}, this.state);
        newState.sideBar = value;
        this.setState(newState);
    }

    togglePreview() {
        let newState = Object.assign({}, this.state);
        newState.preview = !this.state.preview;
        if (newState.preview) {
            if (newState.sideBar == "panels" || newState.sideBar == "resources") {
                newState.sideBar = "timeline";
            }
        } else {
            if (newState.sideBar == "comments" || newState.sideBar == "reviews") {
                newState.sideBar = "timeline";
            }
        }
        this.setState(newState);
    }

    togglePublish() {
        let newState = Object.assign({}, this.state);
        newState.published = !this.state.published;
        this.setState(newState);
    }

    generateManyValues() {
        let values = [];
        for (let i = 0; i < 50; i++) {
            values.push(<div key={i} className="h3">A lot of Text. Should Overflow</div>)
        }
        return values;
    }
    render() {
        return (
            <div className={`${this.state.font} ${this.state.theme}-font-color ${this.state.theme}-bg1`}>
                <div className="h2">Workstation</div>
                <div>
                    <div className={`${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"} onClick = {() => this.props.navCallback('main', "")}>Back to Main</div>
                    <div className={`${this.state.theme}-btn-two ${this.state.theme}-font-color2` + " btn"} onClick = {() => this.props.navCallback('profile', this.state.user)}>Back to Profile</div>
                </div>
                <div className="h3">{this.props.comicTitle}</div>
                <div>
                    Page for creating and editing a comic! Starting with a mock layout
                </div>
                <div className="row">
                    <div className="col-9">
                        <Canvas />
                    </div>
                    <div className="col-3">
                        <div className="sidebar">
                        <div className={`col-12 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.togglePublish()}>{this.state.published ? "Hide Series" : "Publish"}</div>
                            <div className={`col-12 ${this.state.theme}-btn-two ${this.state.theme}-font-color2` + " btn"}
                                onClick = {() => this.togglePreview()}>{"Preview: " + (this.state.preview ? "enabled" : "disabled")}</div>
                            <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("timeline")}>Timeline</div>
                            {!this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("panel")}>Panel</div>
                            }
                            {!this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("resources")}>Resources</div>
                            }
                            {this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("reviews")}>Reviews</div>
                            }
                            {this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("comments")}>Comments</div>
                            }
                            {this.generateManyValues()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Workstation;