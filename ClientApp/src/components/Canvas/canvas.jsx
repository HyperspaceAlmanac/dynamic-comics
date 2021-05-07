'use strict';
import React, { Component } from 'react';
import '../themes.css';

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hovered : false
        }
        this.toggleHover = this.toggleHover.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    doNothing() {

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
        let i;
        for (i = 0; i < this.props.frame.length; i++) {
            if (this.props.frame[i].click || this.props.frame[i].hover) {
                return false;
            }
        }
        return false;
    }
    
    handleScroll(event) {
        if (!this.props.disableInteraction) {
            if(this.state.hovered) {
                if (this.props.maxVal > this.props.current && !this.otherActions()) {
                    this.increment();
                }
            }
        }   
    }


    displayValues() {
        let result = [];
        let i;
        let temp;
        let tempProp;
        let pair;

        for (i = 0; i < this.props.frame.length; i++) {
            temp = this.props.frame[i];
            console.log("display values for temp");
            console.log(temp);
            tempProp = {position : "absolute", left : "10vw", top : "10vh"}
            pair = temp.position.split(" ");
            if (pair.length == 2) {
                tempProp.left = pair[0];
                tempProp.right = pair[1];
            }
            
            if (temp.visible) {
                if (temp.type === "img") {
                    tempProp.width = temp.scale;
                    tempProp.height = "auto"
                    tempProp.zIndex = temp.layer;
                    if (temp.click) {
                        result.push(
                            <img key = {result.length} style={tempProp} src={process.env.PUBLIC_URL + "images/" + temp.url} alt="comic image"/>
                        );
                    } else if (temp.hover) {
                        result.push(
                            <img key = {result.length} style={tempProp} src={process.env.PUBLIC_URL + "images/" + temp.url} alt="comic image"/>
                        );
                    } else {
                        result.push(
                            <img key = {result.length} style={tempProp} src={process.env.PUBLIC_URL + "images/" + temp.url} alt="comic image"/>
                        );
                    }
                } else {
                    tempProp.zIndex = 10;
                    result.push(
                        <div key = {result.length} style={tempProp} className="text-bubble h1">{temp.text}</div>
                    );
                }
            }
        }
        return result;
    }

    render() {
        console.log("In render");
        console.log(this.props);
        return (
            <div className="main-canvas" onMouseOver={() => this.toggleHover(true)} onMouseLeave={() => this.toggleHover(false)}>
                <div>Current Value: {this.props.current}</div>
                <div className="overflow-wrapper">
                    {this.displayValues()}
                </div>
            </div>
        );

    }
}

export default Canvas;