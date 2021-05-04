'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Canvas from '../Canvas/canvas';
import '../themes.css';

class Workstation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            theme : 'science',
            font : 'arial',
            user : ""
        }
    }

    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.user = "MagicalPaintBrush";
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
                <div className="h2">"Workstation</div>
                <div>
                    <div className={`${this.state.theme}-btn-one ${this.state.theme}-font-color` + " btn"} onClick = {() => this.props.navCallback('main', "")}>Back to Main</div>
                    <div className={`${this.state.theme}-btn-two ${this.state.theme}-font-color2` + " btn"} onClick = {() => this.props.navCallback('profile', this.state.user)}>Back to Profile</div>
                </div>
                <div className="h3">{this.props.comicTitle}</div>
                <div>
                    Page for creating and editing a comic! Starting with a mock layout
                </div>
                <div className="row">
                    <div className="col-9">
                        <Canvas />
                    </div>
                    <div className="col-3">
                        <div className="comments-section">
                            {this.generateManyValues()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Workstation;