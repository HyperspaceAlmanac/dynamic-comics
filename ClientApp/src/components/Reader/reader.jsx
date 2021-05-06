'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Canvas from '../Canvas/canvas';
import SubmitReview from './submitReview';
import Reviews from '../Reviews/reviews';
import Timeline from '../Timeline/timeline';
import '../themes.css';

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
            current: 0,
        }
    }
    componentDidMount() {
        this.fetchComic();
    }

    generateManyValues() {
        let values = [];
        for (let i = 0; i < 50; i++) {
            values.push(<div key={i} className="h3">A lot of Text. Should Overflow</div>)
        }
        return values;
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
        newState.panel = this.getCurrentPanel(data.panels, data.currentPanelId)
        newState.current = 0;
        this.setState(newState);
    }

    getCurrentPanel(panels, id) {
        console.log("Get Current Panel");
        console.log(panels);
        console.log(id);
        let i;
        for (i = 0; i < panels.length; i++) {
            if (panels[i].id === id) {
                return panels[i];
            }
        }
        return {id : -1}
    }

    increment() {
        let newState = Object.assign({}, this.state);
        newState.current = this.state.current + 1;
        this.setState(newState);
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
                        <Canvas disableInteraction = {false} panel = {this.state.panel}
                        current = {this.state.current}
                        increment = {() => this.increment()}
                        goToPanel = {(panel) => this.goToPanel(panel)}/>
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
                                <div>Comments</div>
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