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
            resouceMap : null,
            current: 0
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
        newState.resourceMap = data.resources;
        newState.current = 0;
        this.setState(newState);
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
        this.setState(newState);
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

    generateCurrentFrame() {
        let renderValues = [];
        let removeTriggers = [];
        let i;
        let j;
        let temp;
        let tempObj;
        console.log("Begginning of generate frame");
        console.log(this.state);
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
            console.log("temp");
            console.log(temp);
            console.log(temp.actionType);
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
                    console.log("Should reach here");
                    console.log(temp);
                    tempObj = {type : "img", resourceId : temp.resourceId, url : this.state.resourceMap[temp.resourceId].imageURL,
                      layer : temp.layer, visible : true, scale : "1", position: temp.options, hover : false, click : false}
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
                      id : temp.layer, visible : true, position : "10 vw 10 vh", text : temp.options, hover : false, click : false}
                    renderValues.push(tempObj);
                } else if (temp.actionType === "hideText") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "text" && renderValues[j].id === renderValues[j].layer) {
                            renderValues[j].visible = false;
                            break;
                        }
                    }
                } else if (temp.actionType === "textPosition") {
                    for (j = 0; j < renderValues.length; j++) {
                        if (renderValues[j].type === "text" && renderValues[j].id === renderValues[j].layer) {
                            renderValues[j].position = temp.options;
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
        console.log("Reader state");
        console.log(this.state);
        return (
            <div className={`${this.state.font} ${this.state.theme}-font-color ${this.state.theme}-bg1`}>
                <div className="h2">Comic Reader</div>
                <div>
                    <div className={`${this.state.theme}-btn-one ${this.state.theme}-font-color btn`} onClick = {() => this.props.navCallback('main', "")}>Back to Main</div>
                    <div className={`${this.state.theme}-btn-two ${this.state.theme}-font-color2 btn`} onClick = {() => this.props.navCallback('profile', this.state.user)}>Back to Profile</div>
                </div>
                <div className="h3">{this.props.comicTitle}</div>
                <div>
                    Page for creating a Comic
                </div>
                <div className="row">
                    <div className="col-9">
                        {this.state.panel.id !== -1 &&
                            <Canvas disableInteraction = {false} panel = {this.state.panel}
                              current = {this.state.current}
                              increment = {() => this.increment()}
                              goToPanel = {(panel) => this.goToPanel(panel)}
                              comicName = {this.props.comicTitle}
                              frame = {this.generateCurrentFrame()}
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