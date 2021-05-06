'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Canvas from '../Canvas/canvas';
import ResourceList from './resourceList';
import Reviews from '../Reviews/reviews';
import TimelineEditor from './timelineEditor';
import Timeline from '../Timeline/timeline';
import PanelEditor from './panelEditor';
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
            panel : {id : -1},
            pageState : []
        }
    }

    componentDidMount() {
        this.handleResponse(this.getSereis());
    }

    handleResponse(data) {
        if (data.result == "Success") {
            let newState = Object.assign({}, this.state);
            newState.theme = data.theme;
            newState.font = data.font;
            newState.user = data.user;
            newState.panels = data.panels;
            newState.pageState = [];
            newState.current = 0;
            let index = this.findFirstPage(data.panels);
            newState.panel = data.panels[index];
            this.setState(newState);
        }
        console.log("Handle getSeries");
        console.log(this.state);
    }

    findFirstPage(panels) {
        let i;
        console.log("Panels");
        console.log(panels);
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
        let newState = Object.assign({}, this.state);
        newState.current = this.state.current + 1;
        this.setState(newState);
    }
    goToPanel(id) {
        let newState = Object.assign({}, this.state);
        newState.current = 0;
        newState.pageState = [];
        newState.panel = this.findPanel(id);
        this.setState(newState);
    }

    visitPanel(id) {
        if (id === 0) {
            alert("Please save the newly created panels first");
        } else {
            let newState = Object.assign({}, this.state);
            newState.current = 0;
            newState.pageState = [];
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

    initializePageState() {

    }

    updatePageState() {
        
    }

    addPanel(panel) {

    }

    addAction(action) {

    }
    updateAllValues() {
        alert("Sending request to backend");
    }
    getPanelActions() {
        return [];
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
                <div>Add in form for updating Title and genres if other features are done</div>
                <div className="row">
                    <div className="col-9">
                        <Canvas disableInteraction = {false} pageState = {this.state.pageState} 
                            increment = {() => this.increment()}
                            goToPanel = {(panel) => this.goToPanel(panel)}/>
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
                            {!this.state.preview &&
                              this.state.sideBar == "resources" &&
                              <ResourceList theme = {this.state.theme} />
                            }
                            {this.state.preview &&
                              this.state.sideBar == "reviews" &&
                              <Reviews profileOwner = {this.state.user} theme = {this.state.theme} perUser = {false}
                                seriesName = {this.props.comicTitle}
                                visitComic = {(name) => this.props.navCallback("reader", name)}
                                visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
                            }
                            {this.state.preview &&
                              this.state.sideBar == "timeline" &&
                              <Timeline />
                            }
                            {!this.state.preview &&
                              this.state.sideBar == "timeline" &&
                              <TimelineEditor theme = {this.state.theme}
                                panels={this.state.panels} panel = {this.state.panel}
                                visitPanel = {(num) => this.visitPanel(num)}
                                updateAll = {() => this.updateAllValues()}/>
                            }
                            {!this.state.preview &&
                              this.state.sideBar == "panel" &&
                              <PanelEditor theme = {this.state.theme}
                                panel = {this.state.panel} user = {this.state.user}
                                comicName = {this.props.comicTitle}
                                updateAll = {() => this.updateAllValues()} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    async getSereis() {
        const token = await authService.getAccessToken();
        let requestParam = this.props.showProgress ? "history" : "partial";
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ comicName : this.props.comicTitle, edit : true})
        }
        const response = await fetch('api/Account/GetComicSeries', requestOptions);
        const data = await response.json();
        if (data.result == "Success") {
            this.handleResponse(data);
        } else {
            alert("Something went wrong with get series");
        }          
    }
}

export default Workstation;