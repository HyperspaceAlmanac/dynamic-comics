import React, { Component } from 'react';

class Reader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return (
            <div>
                <div>Page for reading through a comic. Specifically for {this.props.comicTitle}</div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("main", "")}>Back to Home Page</div>
                <div>
                    This page should should have Home, Profile, and Cover (Reset) Buttons at the top
                </div>
                <div>
                    Right Side should be a column for Comments and Reviews.
                </div>
                <div>
                    Starting Panel is cover, and has the reviews. When user starts reading, it will change to comments per panel.
                </div>
                <div>
                    User can add review when on that first page, or comments when reading.
                </div>
                <div>
                    TimeLine at bottom to see complete time line and to be able to navigate to specific pages.
                </div>
            </div>
        );
    }
}

export default Reader;