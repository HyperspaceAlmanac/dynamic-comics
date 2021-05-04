'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hovered : true
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

    toggleHover(value) {
        let newState = Object.assign({}, this.state);
        newState.hovered = value;
        this.setState(newState);
        console.log("Toggle Hover");
    }
    
    handleScroll(event) {
        if(this.state.hovered) {
            console.log("Scrolling when hovered");
        }   
    }

    render() {
        console.log(this.props);
        return (
            <div className="main-canvas" onMouseEnter={() => this.toggleHover(true)} onMouseLeave={() => this.toggleHover(false)}>
                <div>
                    <img src={process.env.PUBLIC_URL + "images/" + "green.png"} alt="Comic book cover" style={{position : "absolute", top : "10vh", left: "10vw"}}/>
                </div>
            </div>
        );
    }
}

export default Canvas;