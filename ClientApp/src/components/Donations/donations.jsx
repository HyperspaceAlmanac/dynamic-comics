import React, { Component } from 'react';

class Donations extends Component {
    constructor(props) {
        super(props);
        this.state = {
          donations : [],
          sortingOwn: "all",
          filterNameOther: ""
        }
    }

    generateValues() {
        let values = [];
        for (let i = 0; i < 100; i++) {
            values.push(<div key={i} style={{fontSize: 100}}>Some Large Words</div>);
        }
        return values;
    }

    render() {
        return(
            <div className="row">
                <div style={{overflowX : 'scroll', width: window.innerWidth}}>{this.generateValues()}</div>
                <div className="col-6" style={{overflowY : 'scroll', height: window.innerHeight}}>
                    {this.generateValues()}
                </div>
                <div className="col-6" style={{overflowY : 'scroll', height: window.innerHeight}}>
                    {this.generateValues()}
                </div>
            </div>
        );
    }

    fetchDonations() {
      let donations = [];
      for (let i = 0; i < 11; i++) {
        donations.push({artist : "Person" + i, customer : "Patron" + i, amount : 2 * i + 10, comment : "Love your work!"});
      }
      let newState = Object.assign({}, this.state);
      newState.donations = donations;
      this.setState(newState);
    }

    cancelDonation() {

    }
}

export default Donations;