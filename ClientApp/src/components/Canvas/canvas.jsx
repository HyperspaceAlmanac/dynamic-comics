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
            resources : [],
            current : 0
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
        if (prevProps.panel !== this.props.panel) {
            this.loadPanel();
        } else if (prevProps.current !== this.props.current) {
            let newState = Object.assign({}, this.state);
            newState.current = this.props.current;
            this.setState(newState);
        }
    }

    doNothing() {

    }

    loadPanel() {
        let newState = Object.assign({}, this.state);
        this.state.renderList = [];
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
    
    handleScroll(event) {
        if (!this.props.disableInteraction) {
            if(this.state.hovered) {
                this.increment();
            }
        }   
    }

    render() {
        //onMouseEnter={() => this.toggleHover(true)} onMouseLeave={() => this.toggleHover(false)}
        //console.log(this.props);
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
}

export default Canvas;