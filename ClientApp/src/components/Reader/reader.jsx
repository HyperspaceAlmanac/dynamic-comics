'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Canvas from '../Canvas/canvas';
import SubmitReview from './submitReview';
import Reviews from '../Reviews/reviews';
import Timeline from '../Timeline/timeline';
import Comments from '../Comments/comments';
import '../themes.css';
import { isThisTypeNode } from 'typescript';

class Reader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            theme : 'science',
            font : 'arial',
            user : "",
            author : "",
            sideBar : "timeline",
            panels : [],
            panel : {id : -1},
            resourceMap : null,
            current: 0,
            allFrames : null,
            frameMap : {}
        }
    }
    componentDidMount() {
        this.fetchComic();
    }

    setSideBarState(value) {
        let newState = Object.assign({}, this.state);
        newState.sideBar = value;
        this.setState(newState);
    }

    handleServerResponse(data) {
        let newState = Object.assign({}, this.state);
        newState.user = data.user;
        newState.author = data.author;
        newState.theme = data.theme;
        newState.font = data.font;
        newState.panels = data.panels;
        newState.panel = this.getCurrentPanel(data.panels, data.currentPanelId);
        newState.resourceMap = {};
        let i;
        for (i = 0; i < data.resources.length; i++) {
            newState.resourceMap[data.resources[i].id] = data.resources[i];
        }
        newState.current = 0;
        this.setState(newState, () => {this.generateAllFrames()});
    }

    getCurrentPanel(panels, id) {
        let i;
        for (i = 0; i < panels.length; i++) {
            if (panels[i].id === id) {
                return panels[i];
            }
        }
        return {id : -1}
    }

    
    increment() {
        let i;
        let temp;
        for (i = 0; i < this.state.panel.actions.length; i++) {
            temp = this.state.panel.actions[i];
            if (temp.timing === this.state.current + 1) {
                if (temp.active && temp.transition) {
                    this.goToPanel(temp.nextPanelId);
                    return;
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

    goToPanel(num) {
        let newState = Object.assign({}, this.state);
        newState.panel = this.findPanel(num);
        newState.current = 0;
        this.saveProgress(num);
        this.setState(newState,
            () => {this.generateAllFrames()});
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

    deepCopy(values) {
        let result = [];
        let i;
        for (i = 0; i < values.length; i++) {
            result.push(JSON.parse(JSON.stringify(values[i])));
        }
        return result;
    }

    removeTriggers(values) {
        let i;
        for (i = 0; i < values.length; i++) {
            values[i].hover = false;
            values[i].click = false;
        } 
    }

    generateAllFrames() {
        let allFrames = [];
        let timeMap = {};

        let renderValues = [];
        let i;
        let j;
        let temp;
        let tempObj;

        let currentPage = 0;
        for (i = 0; i < this.state.panel.actions.length; i++) {
            temp = this.state.panel.actions[i];
            if (temp.active) {
                if (temp.timing > currentPage) {
                    allFrames.push(renderValues);
                    renderValues = this.deepCopy(renderValues);
                    this.removeTriggers(renderValues);
                    let k;
                    for (k = currentPage; k < temp.timing; k++) {
                        timeMap[k] = allFrames.length - 1;
                    }
                    currentPage = temp.timing;
                }
                if (temp.isTrigger) {
                    if (temp.actionType === "click" || temp.actionType === "hover") {
                        for (j = 0; j < renderValues.length; j++) {
                            if (renderValues[j].type === "img" && renderValues[j].resourceId === temp.resourceId) {
                                renderValues[j].click = temp.actionType === "click";
                                renderValues[j].hover = temp.actionType === "hover";
                                break;
                            }
                        }
                    }
                } else if (temp.actionType === "show") {
                    tempObj = {type : "img", resourceId : temp.resourceId, url : (temp.resourceId === 1 ? "grayDefault.png" : this.state.resourceMap[temp.resourceId].imageURL),
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
                        if (renderValues[j].type === "text" && renderValues[j].id === temp.layer) {
                            renderValues[j].visible = false;
                            break;
                        }
                    }
                } else if (temp.actionType === "moveText") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "text" && renderValues[j].id === temp.layer) {
                            renderValues[j].position = temp.options;
                            break;
                        }
                    }
                }
            }
        }
        allFrames.push(renderValues);
        timeMap[currentPage] = allFrames.length - 1;

        
        let newState = Object.assign({}, this.state);
        newState.allFrames = allFrames;
        newState.frameMap = timeMap;
        this.setState(newState);
    }

    generateCurrentFrame() {
        let renderValues = [];
        let removeTriggers = [];
        let i;
        let j;
        let temp;
        let tempObj;

        for (i = 0; i < this.state.panel.actions.length; i++) {
            temp = this.state.panel.actions[i];
            if (temp.active && temp.timing <= this.state.current) {
                if (temp.isTrigger) {
                    if (temp.actionType === "click" || temp.actionType === "hover") {
                        if (temp.timing === this.state.current) {
                            for (j = 0; j < renderValues.length; j++) {
                                if (renderValues[j].type === "img" && renderValues[j].resourceId === temp.resourceId) {
                                    renderValues[j].click = temp.actionType === "click";
                                    renderValues[j].hover = temp.actionType === "hover";
                                    removeTriggers.push(j);
                                    break;
                                }
                            }
                        }
                    }
                } else if (temp.actionType === "show") {
                    tempObj = {type : "img", resourceId : temp.resourceId, url : (temp.resourceId === 1 ? "grayDefault.png" : this.state.resourceMap[temp.resourceId].imageURL),
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
                        if (renderValues[j].type === "text" && renderValues[j].id === temp.layer) {
                            renderValues[j].visible = false;
                            break;
                        }
                    }
                } else if (temp.actionType === "moveText") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "text" && renderValues[j].id === temp.layer) {
                            renderValues[j].position = temp.options;
                            break;
                        }
                    }
                }
            }
        }

        return renderValues;
    }

    render() {
        return (
            <div className={`${this.state.font} ${this.state.theme}-font-color ${this.state.theme}-bg1`}>
                <div className="h2">Comic Reader</div>
                <div>
                    <div className={`${this.state.theme}-btn-one ${this.state.theme}-font-color btn`} onClick = {() => this.props.navCallback('main', "")}>Back to Main</div>
                    <div className={`${this.state.theme}-btn-two ${this.state.theme}-font-color2 btn`} onClick = {() => this.props.navCallback('profile', this.state.user)}>Back to Profile</div>
                </div>
                <div className="h3">{this.props.comicTitle}</div>
                <div className="row">
                    <div className="col-9">
                        {this.state.panel.id !== -1 &&
                          this.state.allFrames !== null &&
                            <Canvas disableInteraction = {false} panel = {this.state.panel}
                              current = {this.state.current}
                              increment = {() => this.increment()}
                              goToPanel = {(panel) => this.goToPanel(panel)}
                              comicName = {this.props.comicTitle}
                              frame = {this.state.allFrames[this.state.frameMap[this.state.current]]}
                              maxVal = {this.maxVal()} />
                        }
                    </div>
                    <div className="col-3">
                        <div className={"sidebar " + `${this.state.theme}-bg2`}>
                            <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("timeline")}>Timeline</div>
                            <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("reviews")}>Reviews</div>
                            <div className={`col-4 ${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"}
                                onClick = {() => this.setSideBarState("comments")}>Comments</div>
                            
                            {this.state.sideBar === "timeline" &&
                                <Timeline theme = {this.state.theme} panels={this.state.panels} panel = {this.state.panel} goToPanel = {(num) => this.goToPanel(num)}/>
                            }
                            {this.state.sideBar === "reviews" &&
                                <div>
                                    {this.state.author !== this.state.user &&
                                        <SubmitReview theme = {this.state.theme} comicSeries = {this.props.comicTitle}/>
                                    }
                                    <Reviews profileOwner = {this.state.author} theme = {this.state.theme} perUser = {false}
                                        seriesName = {this.props.comicTitle}
                                        visitComic = {(name) => this.props.navCallback("reader", name)}
                                        visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
                                </div>
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

    async fetchComic() {
        const token = await authService.getAccessToken();
        const requestOptions = {
          method: 'Put',
          headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
          body: JSON.stringify({ comicName : this.props.comicTitle, edit : false})
        }
        const response = await fetch('api/Account/GetComicSeries', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            this.handleServerResponse(data);
        } else {
            alert("Something Went Wrong");
        }
    }

    async saveProgress(num) {
        const token = await authService.getAccessToken();
        const requestOptions = {
          method: 'Put',
          headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
          body: JSON.stringify({ panelId : num})
        }
        const response = await fetch('api/Account/SaveProgress', requestOptions);
        const data = await response.json();
    }
}

export default Reader;