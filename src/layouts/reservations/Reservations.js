import React, { Component } from 'react'
import PropTypes from 'prop-types'


const Reservation = (res, cancel, pay) => (
        <div>
        res[0]
        <input type="button" value="Pay" onClick={pay} />
        <input type="button" value="Cancel" onClick={cancel} />
        </div>
    )


class Reservations extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.cancelReservation = this.cancelReservation.bind(this);
      this.payReservation = this.payReservation.bind(this);
      this.methods = context.drizzle.contracts.Blockspace.methods;
      this.reservationsKey = this.methods.getReservationsForOwner.cacheCall(props.account)
  }

  fetchReservations () {
      if (this.props.accounts[0]) ;
  }

  cancelReservation (spaceId, resId) {
      this.cancelReservationKey = this.methods.cancelReservation.cacheSend(spaceId, resId);
  }

  payReservation (spaceId, resId) {
      this.payReservationKey = this.methods.payReservation.cacheSend(spaceId, resId);

  }

  render() {
    let reservations;
    if (this.props.Blockspace.getReservationsForOwner[this.reservationsKey]) {
        reservations = this.props.Blockspace.getReservationsForOwner[this.reservationsKey].value.map(r => Reservation(r, this.cancelReservation, this.payReservation));
    } else {
        reservations = 'Loading Reservations'
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
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
