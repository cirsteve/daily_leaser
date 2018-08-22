import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AccountData } from 'drizzle-react-components'

import Reservation from './Reservation'


class Reservations extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.methods = context.drizzle.contracts.Blockspace.methods;
      this.reservationsKey = this.methods.getReservationsForOwner.cacheCall(props.account)
  }

  fetchReservations () {
      if (this.props.accounts[0]) ;
  }

  formatReservations (spaceIds, resIds) {
      return spaceIds.map((sId, i) => [sId, resIds[i], i])
        .filter(r => 1*r[0])
        .map((r, i) => <Reservation key={r[0]+r[1]} spaceId={r[0]} resId={r[1]} startEpoch={this.props.startEpoch} arrayIdx={i} />);
  }

  renderReservations (reservations) {
    if (reservations[0].length) {
        let res = this.formatReservations(reservations[0], reservations[1]);
        if (!res.length) {
            return 'No reservations';
        } else {
            return res;
        }
    } else {
        return 'No reservations'
    }
  }

  render() {
    let reservations;
    if (this.props.Blockspace.getReservationsForOwner[this.reservationsKey]) {
        reservations = this.renderReservations(this.props.Blockspace.getReservationsForOwner[this.reservationsKey].value);
    } else {
        reservations = 'Loading Reservations'
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <AccountData accountIndex="0" units="ether" precision="3" />
            <h2>Reservations</h2>

            {reservations}

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
