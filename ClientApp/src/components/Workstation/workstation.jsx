'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Canvas from '../Canvas/canvas';
import ResourceList from './resourceList';
import Reviews from '../Reviews/reviews';
import TimelineEditor from './timelineEditor';
import Timeline from '../Timeline/timeline';
import PanelEditor from './panelEditor';
import Comments from '../Comments/comments';
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
            published : true,
            panels: [],
            current : 1,
            resourceMap : null,
            panel : {id : -1}
        }
    }

    componentDidMount() {
        this.getSeries();
    }

    handleResponse(data) {
        if (data.result === "Success") {
            let newState = Object.assign({}, this.state);
            newState.theme = data.theme;
            newState.font = data.font;
            newState.user = data.user;
            newState.panels = data.panels;
            newState.current = 0;
            newState.sideBar = "timeline";
            newState.published = data.published;
            newState.resourceMap = data.resources;
            let index = this.findFirstPage(data.panels);
            newState.panel = data.panels[index];
            this.setState(newState);
        }
    }

    findFirstPage(panels) {
        let i;
        for (i = 0; i < panels.length; i++) {
            if (panels[i].start && panels[i].active) {
                return i;
            }
        }
        alert("Could not find first page");
        return 0;
    }
    setSideBarState(value) {
        let newState = Object.assign({}, this.state);
        newState.sideBar = value;
        this.setState(newState);
    }

    increment() {
        let i;
        let temp;
        for (i = 0; i < this.state.panel.actions.length; i++) {
            temp = this.state.panel.actions[i];
            if (temp.timing === this.state.current + 1) {
                if (temp.active && temp.transition) {
                    this.goToPanel(temp.nextPanelId);
                }
            }
        }
        let newState = Object.assign({}, this.state);
        newState.current = this.state.current + 1;
        this.setState(newState);
    }

    maxVal() {
        let i;
        let temp;
        let maxVal = 0;
        for (i = 0; i < this.state.panel.actions.length; i++) {
            temp = this.state.panel.actions[i];
            maxVal = Math.max(maxVal, temp.timing);
        }
        return maxVal;
    }

    goToPanel(id) {
        let newState = Object.assign({}, this.state);
        newState.current = 0;
        newState.panel = this.findPanel(id);
        this.setState(newState);
    }

    visitPanel(id) {
        if (id === 0) {
            alert("Please save the newly created panels first");
        } else {
            let newState = Object.assign({}, this.state);
            newState.current = 0;
            newState.panel = this.findPanel(id);
            newState.sideBar = "panel";
            this.setState(newState);
        }
    }

    findPanel(id) {
        let i;
        for(i = 0; i < this.state.panels.length; i++) {
            if (this.state.panels[i].id === id) {
                return this.state.panels[i];
            }
        }
        return {};
    }

    togglePreview() {
        let newState = Object.assign({}, this.state);
        newState.preview = !this.state.preview;
        if (newState.preview) {
            if (newState.sideBar === "panels" || newState.sideBar === "resources") {
                newState.sideBar = "timeline";
            }
        } else {
            if (newState.sideBar === "comments" || newState.sideBar === "reviews") {
                newState.sideBar = "timeline";
            }
        }
        this.setState(newState);
    }

    togglePublish() {
        this.toggleDisplayRequest();
    }

    generateCurrentFrame() {
        let renderValues = [];
        let removeTriggers = [];
        let i;
        let j;
        let temp;
        let tempObj;
        console.log("Begginning of generate frame");
        console.log(this.state.panel.actions);
        for (i = 0; i < this.state.panel.actions.length; i++) {
            temp = this.state.panel.actions[i];
            if (removeTriggers.length > 0) {
                for (j = 0; j < removeTriggers.length; j++) {
                    renderValues[j].click = false;
                    renderValues[j].hover = false;
                }
                removeTriggers = [];
            }
            if (temp.active && temp.timing <= this.state.current) {
                if (temp.isTrigger) {
                    if (temp.actionType === "click" || temp.actionType === "hover") {
                        for (j = 0; j < renderValues.length; j++) {
                            if (renderValues[j].type === "img" && renderValues[j].resourceId === temp.resourceId) {
                                renderValues[j].click = temp.actionType === "click";
                                renderValues[j].hover = temp.actionType === "hover";
                                removeTriggers.push(j);
                                break;
                            }
                        }
                    }
                } else if (temp.actionType === "show") {
                    tempObj = {type : "img", resourceId : temp.resourceId, url : this.state.resourceMap[temp.resourceId].imageURL,
                      layer : temp.layer, visible : true, scale : "5vw", position: temp.options, hover : false, click : false}
                    renderValues.push(tempObj);
                } else if (temp.actionType === "hide") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "img" && renderValues[j].resourceId === temp.resourceId) {
                            renderValues[j].visible = false;
                            break;
                        }
                    }
                } else if (temp.actionType === "move") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "img" && renderValues[j].resourceId === temp.resourceId) {
                            renderValues[j].position = temp.options;
                            break;
                        }
                    }
                } else if (temp.actionType === "scale") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "img" && renderValues[j].resourceId === temp.resourceId) {
                            renderValues[j].scale = temp.options;
                            break;
                        }
                    }

                } else if (temp.actionType === "showText") {
                    tempObj = {type : "text", resourceId : null, url : null,
                      id : temp.layer, visible : true, position : "10vw 10vh", text : temp.options, hover : false, click : false}
                    renderValues.push(tempObj);
                } else if (temp.actionType === "hideText") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "text" && renderValues[j].id === renderValues[j].layer) {
                            renderValues[j].visible = false;
                            break;
                        }
                    }
                } else if (temp.actionType === "moveText") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "text" && renderValues[j].id === temp.layer) {
                            renderValues[j].position = temp.options;
                            console.log("Updated text locatoin");
                            break;
                        }
                    }
                }
            }
        }
        console.log("In genreate frame");
        console.log(renderValues);
        return renderValues;
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
                <div>Add in form for updating Title and genres if other features are done</div>
                <div className="row">
                    <div className="col-9">
                        {this.state.panel.id !== -1 &&
                            <Canvas disableInteraction = {!this.state.preview} panel = {this.state.panel}
                              current = {this.state.current}
                              goToPanel = {(panel) => this.goToPanel(panel)}
                              increment = {() => this.increment()}
                              frame = {this.generateCurrentFrame()}
                              maxVal = {this.maxVal()} />
                        }
                    </div>
                    <div className="col-3">
                        <div className="sidebar">
                        <div className={`col-12 ${this.state.theme}-btn-one ${this.state.theme}-font-color btn`}
                                onClick = {() => this.togglePublish()}>{this.state.published ? "Hide Series" : "Publish"}</div>
                            <div className={`col-12 ${this.state.theme}-btn-two ${this.state.theme}-font-color2 btn`}
                                onClick = {() => this.togglePreview()}>{"Preview: " + (this.state.preview ? "enabled" : "disabled")}</div>
                            <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color btn`}
                                onClick = {() => this.setSideBarState("timeline")}>Timeline</div>
                            {!this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color btn`}
                                onClick = {() => this.setSideBarState("panel")}>Panel</div>
                            }
                            {!this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color btn`}
                                onClick = {() => this.setSideBarState("resources")}>Resources</div>
                            }
                            {this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color btn`}
                                onClick = {() => this.setSideBarState("reviews")}>Reviews</div>
                            }
                            {this.state.preview &&
                                <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color btn`}
                                onClick = {() => this.setSideBarState("comments")}>Comments</div>
                            }
                            {!this.state.preview &&
                              this.state.sideBar === "resources" &&
                              <ResourceList theme = {this.state.theme} />
                            }
                            {this.state.preview &&
                              this.state.sideBar === "reviews" &&
                              <Reviews profileOwner = {this.state.user} theme = {this.state.theme} perUser = {false}
                                seriesName = {this.props.comicTitle}
                                visitComic = {(name) => this.props.navCallback("reader", name)}
                                visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
                            }
                            {this.state.preview &&
                              this.state.sideBar === "timeline" &&
                              <Timeline theme = {this.state.theme}
                                panels={this.state.panels}
                                panel = {this.state.panel}
                                goToPanel = {(num) => this.goToPanel(num)}/>
                            }
                            {!this.state.preview &&
                              this.state.sideBar === "timeline" &&
                              <TimelineEditor theme = {this.state.theme}
                                panels={this.state.panels} panel = {this.state.panel}
                                comicName = {this.props.comicTitle}
                                visitPanel = {(num) => this.visitPanel(num)}
                                workStationCallBack = {(data) => this.handleResponse(data) }
                              />
                            }
                            {!this.state.preview &&
                              this.state.sideBar === "panel" &&
                              <PanelEditor theme = {this.state.theme}
                                panel = {this.state.panel} user = {this.state.user}
                                comicName = {this.props.comicTitle}
                                workStationCallBack = {(data) => this.handleResponse(data) }
                              />
                            }
                            {this.state.sideBar === "comments" &&
	                        	<Comments theme = {this.state.theme} panel = {this.state.panel}
		                            current = {this.state.current} />
	                        }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    async toggleDisplayRequest() {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ comicName : this.props.comicTitle, enabled : !this.state.published})
        }
        const response = await fetch('api/Account/ToggleVisibility', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            let newState = Object.assign({}, this.state);
            newState.published = !this.state.published;
            this.setState(newState);
            if (newState.published) {
                alert("This series is now visible to other users!");
            } else {
                alert("This series is now hidden");
            }
        }
    }
    async getSeries() {
        const token = await authService.getAccessToken();
        let requestParam = this.props.showProgress ? "history" : "partial";
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ comicName : this.props.comicTitle, edit : true})
        }
        const response = await fetch('api/Account/GetComicSeries', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            this.handleResponse(data);
        } else {
            alert("Something went wrong with get series");
        }          
    }
}

export default Workstation;