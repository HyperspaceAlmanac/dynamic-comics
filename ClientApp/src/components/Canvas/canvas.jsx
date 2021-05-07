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
            resourceMap : {},
            loading : false
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
        newState.loading = true;
        this.setState(newState);
        console.log("Current state: ");
        console.log(this.state);
        this.processData();
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.panel !== this.props.panel ||
            prevProps.current !== this.props.current) {
            let newState = Object.assign({}, this.state);
            newState.loading = true;
            this.setState(newState);
            this.processData();
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

    processData() {
        
        let newState;
        if (this.props.current == 0) {
            newState = Object.assign({}, this.state);
            newState.timeMap = {};
            newState.renderedResources = [];
            let i;
            let actions = this.props.panel.actions;
            console.log(actions);
            let temp;
            for (i = 0; i < actions.length; i++) {
                temp = actions[i];
                if (temp.timing in newState.timeMap) {
                    newState.timeMap[temp.timing].push(temp);
                } else {
                    newState.timeMap[temp.timing] = [temp];
                }
            }
            console.log(newState);
            this.setState(newState);
        }
        console.log("New timeMap");
        console.log(this.state.timeMap);
        newState = Object.assign({}, this.state);
        newState.renderedResources = this.updateRendered();
        newState.loading = false;
        this.setState(newState);
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
                console.log("Inside of Scroll");
                console.log(this.moreActions() + " " + this.otherActions());
                console.log(this.state.timeMap);
                if (this.moreActions() && !this.otherActions()) {
                    this.increment();
                }
            }
        }   
    }

    updateRendered() {

    }

    displayValues() {
        let displayed = [];
        let i;
        let temp;
        for (i = 0; i < this.state.renderedResources; i++) {
            temp = this.state.renderedResources[i];
        }
        return displayed; 
    }

    render() {
        if (this.state.loading) {
            return(
                <div className="h1">Loading</div>
            )
        } else {
            return (
                <div className="main-canvas" onMouseOver={() => this.toggleHover(true)} onMouseLeave={() => this.toggleHover(false)}>
                    <div>Current Value: {this.state.current}</div>
                    <div className="overflow-wrapper">
                        {this.displayValues()}
                    </div>
                </div>
            );
        }
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
        console.log("Setting image resources");
        this.setState(newState);
        
    }

    async getResources() {
        console.log("Inside of getResources");
        console.log(this.props.comicName + ", " + this.props.author)
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