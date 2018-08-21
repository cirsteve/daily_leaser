import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import PropTypes from 'prop-types'

import DatePicker from './DatePicker'
import IpfsContent from '../common/IpfsContent'
import Reservations from '../reservations/ReservationsContainer'
import { daysFromEpoch, MS_PER_DAY } from '../../util/time'



class Space extends Component {
  constructor (props, context) {
      console.log('con Space', props, context, props.accounts[0])
      super(props);
      this.createReservation = this.createReservation.bind(this, props.id);
      this.methods = context.drizzle.contracts.Blockspace.methods;

      this.getSpaceKey = this.methods.getSpace.cacheCall(props.id);
      this.getDepositKey = this.methods.getDepositAmount.cacheCall();
      this.getDailyFeeKey = this.methods.getDailyFee.cacheCall();
      this.getStartEpochKey = this.methods.getStartEpoch.cacheCall();
      this.getAvailabilityKey = this.methods.getAvailability.cacheCall(props.id, 0, 50);

      this.availability = [];
  }

  getContractValues () {
    const bs = this.props.Blockspace;
    return {
        deposit: bs.getDepositAmount[this.getDepositKey] ?
            bs.getDepositAmount[this.getDepositKey].value : 'Loading Deposit',
        space: bs.getSpace[this.getSpaceKey] ?
            <IpfsContent hash={this.props.Blockspace.getSpace[this.getSpaceKey].value[1]} /> : 'Loading Space',
        fee: bs.getDailyFee[this.getDailyFeeKey] ?
            bs.getDailyFee[this.getDailyFeeKey].value : 'Loading Fee',
        epoch: bs.getStartEpoch[this.getStartEpochKey] ?
            new Date(1*bs.getStartEpoch[this.getStartEpochKey].value).toString() : 'Loading Epoch'
    }
  }

  createReservation (id, value) {
      const epoch = new Date(1*this.props.Blockspace.getStartEpoch[this.getStartEpochKey].value);
      const start = daysFromEpoch(epoch, this.props.reservationDates.startDate);
      const end = daysFromEpoch(epoch, this.props.reservationDates.endDate);
      this.methods.createReservation.cacheSend(
          1*id,
          start,
          end,
          {value});
  }

  render() {
    let {space, deposit, fee, epoch} = this.getContractValues();
    let reservations;

    if (this.props.accounts[0] && this.props.Blockspace.getStartEpoch[this.getStartEpochKey]) {
        reservations = <Reservations account={this.props.accounts[0]} startEpoch={1*this.props.Blockspace.getStartEpoch[this.getStartEpochKey].value} />;
    } else {
        reservations = 'Loading Account';
    }

    const reservationDays = this.props.reservationDates.startDate ?
        (this.props.reservationDates.endDate - this.props.reservationDates.startDate) / MS_PER_DAY + 1: 0;

    const reservationCost = reservationDays * fee;


    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <p>Reserve a Space Below</p>
            {space}

            <div>Deposit: {deposit}</div>
            <div>Daily Fee: {fee}</div>

            <div>
                <div>
                    Start: {this.props.reservationDates.startDate ?
                        this.props.reservationDates.startDate.toDateString() : '-'}
                </div>
                <div>
                    End: {this.props.reservationDates.endDate ?
                        this.props.reservationDates.endDate.toDateString() : '-'}
                </div>
            </div>
            <div>{reservationDays} days for {reservationCost} at a daily rate of {fee} with a minimum deposit of {deposit}</div>
            <input type="button" value={`Pay ${deposit} Deposit to Create You Reservation`} disabled={ this.props.reservationDates.startDate ? false: true } onClick={this.createReservation.bind(this, deposit)} />
            <input type="button" value={`Pay Full ${reservationCost} to Create You Reservation`} disabled={ this.props.reservationDates.startDate ? false: true } onClick={this.createReservation.bind(this, reservationCost)} />

            { epoch === 'Loading Epoch' ? epoch : <DatePicker id={this.props.id} epoch={new Date(epoch)} /> }


            {reservations}
          </div>


        </div>
      </main>
    )
  }
}

Space.contextTypes = {
  drizzle: PropTypes.object
}

export default Space
