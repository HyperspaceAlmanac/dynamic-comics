'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hovered : false,
            timeMap : {},
            renderedResources : [],
            resourceMap : {}
        }
        this.toggleHover = this.toggleHover.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll);
        this.getResources();
        let newState = Object.assign({}, this.state);
        newState.current = this.props.current;
        newState.renderedResources = [];
        newState.timeMap = {};
        this.setState(newState);
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.panel !== this.props.panel) {
            this.updateState();
        }
    }

    moreActions() {
        let timeStamps = Object.keys(this.state.timeMap);
        if (timeStamps.length > 0) {
            let maxVal = Math.max(...timeStamps);
            return maxVal >= this.props.current;
        }
        return false;
    }

    updateState() {
        if (this.props.current == 0) {

        } else {

        }
    }

    increment() {
        if (!this.props.disableInteraction) {
            this.props.increment();
        }
    }

    goToPanel(val) {
        if (!this.props.disableInteraction) {
            this.props.goToPanel(val);
        }
    }

    toggleHover(value) {
        if (value !== this.state.hovered) {
            let newState = Object.assign({}, this.state);
            newState.hovered = value;
            this.setState(newState);
        }
    }

    otherActions() {
        let currentTime = this.props.current;
        if (currentTime in this.state.timeMap) {
            let i = 0;
            let val;
            for (i = 0; i < this.state.timeMap[currentTime].length; i++) {
                val = this.state.timeMap[currentTime][i];
            }
        } else {
            return false;
        }
    }
    
    handleScroll(event) {
        if (!this.props.disableInteraction) {
            if(this.state.hovered) {
                if (this.moreActions() && !this.otherActions()) {
                    this.increment();
                }
            }
        }   
    }

    render() {
        return (
            <div className="main-canvas" onMouseOver={() => this.toggleHover(true)} onMouseLeave={() => this.toggleHover(false)}>
                <div>Current Value: {this.state.current}</div>
                <div className="overflow-wrapper">
                    <img src={process.env.PUBLIC_URL + "images/" + "green.png"} alt="Comic book cover"/>
                    <img src={process.env.PUBLIC_URL + "images/" + "green.png"} alt="Comic book cover" style={{position : "absolute", top : "10vh", left: "10vw"}}/>
                    <img src={process.env.PUBLIC_URL + "images/" + "green.png"} alt="Comic book cover" style={{position : "absolute", top : "10vh", left: "-5vw"}}/>
                    <img src={process.env.PUBLIC_URL + "images/" + "green.png"} alt="Comic book cover" style={{position : "absolute", top : "-5vh", right: "5vw"}}/>
                </div>
            </div>
        );
    }

    createImageMapping(data) {
        let imageMapping = {}
        let i;
        let temp;
        for (i = 0; i < data.common.length; i++) {
            temp = data.common[i];
            imageMapping[temp.id] = temp.imageURL; 
        }
        for (i = 0; i < data.user.length; i++) {
            temp = data.user[i];
            imageMapping[temp.id] = temp.imageURL; 
        }
        let newState = Object.assign({}, this.state);
        newState.resourceMap = imageMapping;
        this.setState(newState);
        
    }

    async getResources() {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ comicName : this.props.comicName, author : this.props.author})
        }
        const response = await fetch('api/Account/GetSeriesResources', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            this.createImageMapping(data);
        }
    }
}

export default Canvas;