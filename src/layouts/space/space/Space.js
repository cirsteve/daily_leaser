import React, { Component } from 'react'
import { AccountData } from 'drizzle-react-components'
import PropTypes from 'prop-types'

import DatePicker from './DatePicker'
import Loading from 'react-loading'

import IpfsContent from '../common/IpfsContent'
import Nav from '../common/Nav'
import { daysFromEpoch, MS_PER_DAY } from '../../../util/time'



class Space extends Component {
  constructor (props, context) {
      super(props);
      this.id = props.match.params.id;
      this.contractAddr = props.match.params.address;
      this.createReservation = this.createReservation.bind(this, this.id);
      this.methods = context.drizzle.contracts[this.contractAddr].methods;

      this.getSpaceKey = this.methods.getSpace.cacheCall(this.id);
      this.depositKey = this.methods.depositAmount.cacheCall();
      this.dailyFeeKey = this.methods.dailyFee.cacheCall();
      this.startEpochKey = this.methods.startEpoch.cacheCall();
      this.ownerKey = this.methods.owner.cacheCall();
      this.getAvailabilityKey = this.methods.getAvailability.cacheCall(this.id, 0, 50);

      this.availability = [];
  }

  getContractValues () {
    const contract = this.props.contracts[this.contractAddr];
    return {
        deposit: contract.depositAmount[this.depositKey] ?
            contract.depositAmount[this.depositKey].value : 'Loading Deposit',
        space: contract.getSpace[this.getSpaceKey] ?
            <IpfsContent hash={contract.getSpace[this.getSpaceKey].value[1]} /> : 'Loading Space',
        fee: contract.dailyFee[this.dailyFeeKey] ?
            contract.dailyFee[this.dailyFeeKey].value : 'Loading Fee',
        epoch: contract.startEpoch[this.startEpochKey] ?
            new Date(1*contract.startEpoch[this.startEpochKey].value).toString() : 'Loading Epoch'
    }
  }

  createReservation (id, value) {
      const epoch = new Date(1*this.props.contracts[this.contractAddr].startEpoch[this.startEpochKey].value);
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

    const reservationDays = this.props.reservationDates.startDate ?
        (this.props.reservationDates.endDate - this.props.reservationDates.startDate) / MS_PER_DAY + 1: 0;

    const reservationCost = reservationDays * fee;


    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <Nav contractAddr={this.contractAddr} ownerKey={this.ownerKey} />
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
            {this.props.contracts[this.contractAddr].synced ?<div>
              <input type="button" value={`Pay ${deposit} Deposit to Create Reservation`} disabled={ this.props.reservationDates.startDate ? false: true } onClick={this.createReservation.bind(this, deposit)} /><br />
              <input type="button" value={`Pay Full ${reservationCost} to Create Reservation`} disabled={ this.props.reservationDates.startDate ? false: true } onClick={this.createReservation.bind(this, reservationCost)} />
              </div>
            : <Loading type='cubes' color="gray" height={'20%'} width={'20%'} />}
            { epoch === 'Loading Epoch' ? epoch : <DatePicker id={this.id} epoch={new Date(epoch)} /> }


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
