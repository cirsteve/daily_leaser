import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AccountData } from 'drizzle-react-components'

import Reservation from './Reservation'
import Nav from '../common/Nav'


class Reservations extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.methods = context.drizzle.contracts.Blockspace.methods;
      this.startEpochKey = this.methods.startEpoch.cacheCall();
      this.reservationsKey = this.methods.getReservationsForOwner.cacheCall(props.account)

  }

  formatReservations (spaceIds, resIds) {
    let startEpoch = 1*this.props.Blockspace.startEpoch[this.startEpochKey].value;
      return spaceIds.map((sId, i) => [sId, resIds[i], i])
        //.filter(r => 1*r[0] * r[1])
        .map((r, i) => <Reservation key={r[0]+r[1]} spaceId={r[0]} resId={r[1]} startEpoch={startEpoch} arrayIdx={i} />);
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
            <Nav />
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
