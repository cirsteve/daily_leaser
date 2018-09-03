
import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { dateFromEpoch } from '../../../util/time'

class Reservation extends Component {
  constructor (props, context) {
      console.log('con Reservation', props, context)
      super(props);
      this.cancelReservation = this.cancelReservation.bind(this, props.spaceId, props.resId, props.arrayIdx);
      this.payReservation = this.payReservation.bind(this, props.spaceId, props.resId);
      this.methods = context.drizzle.contracts.Blockspace.methods;
      this.reservationKey = this.methods.getReservations.cacheCall(props.spaceId, props.resId, 1*props.resId+1);
  }


  cancelReservation (spaceId, resId, arrayIdx) {
      this.cancelReservationKey = this.methods.cancelReservation.cacheSend(spaceId, resId, arrayIdx);
  }

  payReservation (spaceId, resId, value) {
      this.payReservationKey = this.methods.payReservation.cacheSend(spaceId, resId, {value});
  }

  renderReservation (res) {
      const cost = res[4][0];
      const paid = res[3][0];
      const owed = cost - paid;
      const start = dateFromEpoch(this.props.startEpoch, res[1][0]).toDateString();
      const end = dateFromEpoch(this.props.startEpoch, res[2][0]).toDateString();
      return (
          <div className="reservation-item">
            <div>
            Space: {this.props.spaceId}<br />
            Start:<br /> {start}
            </div>
            <div>
            End: <br />{end}
            </div>
            <div>
            Cost: {cost}<br />
            Paid- :{paid}<br />
            Owed: {owed}
            </div>
            <input type="button" value={`Pay ${owed} Balance`} disabled={owed <= 0 ? true: false} onClick={this.payReservation.bind(this, owed)} />
            <input type="button" value="Cancel" onClick={this.cancelReservation} />
          </div>
      )
  }

  render() {
    let reservation;
    if (this.props.Blockspace.getReservations[this.reservationKey]) {
        reservation = this.renderReservation(this.props.Blockspace.getReservations[this.reservationKey].value);
    } else {
        reservation = 'Loading Reservation'
    }




    return (


        <div>

          {reservation}
        </div>

    )
  }
}

Reservation.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    Blockspace: state.contracts.Blockspace,
  }
}


export default drizzleConnect(Reservation, mapStateToProps);
