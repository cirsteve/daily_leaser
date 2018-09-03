import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AccountData } from 'drizzle-react-components'


import Nav from '../common/Nav'


class Reservations extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.contractAddr = props.match.params.address;
      this.methods = context.drizzle.contracts[this.contractAddr].methods;
      this.claimCredits = this.claimCredits.bind(this);
      this.reservationsKey = this.methods.getReservationsForOwner.cacheCall(props.account);
      this.creditsKey = this.methods.credits.cacheCall(props.account);
      this.ownerKey = this.methods.owner.cacheCall();

  }

  claimCredits () {
    this.context.drizzle.contracts[this.contractAddr].methods.claimCredit.cacheSend();
  }

  cancelReservation (id, idx) {
    this.context.drizzle.contracts[this.contractAddr].methods.cancelReservation.cacheSend(id, idx);
  }

  render() {
    let reservations = 'Loading Reservations';
    let credits = 'LoadingCredits';
    if (this.props.contracts[this.contractAddr].getReservationsForOwner[this.reservationsKey]) {
      reservations = this.props.contracts[this.contractAddr].getReservationsForOwner[this.reservationsKey].value
        .filter(id => id)
        .map((id, idx) => <div key={id}>{id} <input type="button" value="Cancel" onClick={this.cancelReservation.bind(this, id, idx)} /></div>);
    }

    if (this.props.contracts[this.contractAddr].credits[this.creditsKey]) {
      credits = this.props.contracts[this.contractAddr].credits[this.creditsKey].value;
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <Nav  contractAddr={this.contractAddr} ownerKey={this.ownerKey} />
            <AccountData accountIndex="0" units="ether" precision="3" />
            <div>
            <h3>Credits</h3>
            <div>{credits}</div>
            <input type="button" onClick={this.claimCredits} value="Claim Credits" />
            </div>
            <h2>Reservations</h2>

            { reservations }

          </div>

        </div>
      </main>
    )
  }
}

Reservations.contextTypes = {
  drizzle: PropTypes.object
}

export default Reservations
