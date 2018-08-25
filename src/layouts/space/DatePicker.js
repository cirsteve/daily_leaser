import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import PropTypes from 'prop-types'


import { DateRange } from 'react-date-range'
import { daysFromEpoch, dateFromEpoch } from '../../util/time'

class DatePicker extends Component {

  constructor(props, context) {
      super(props)
      this.today = new Date()
      const startDay = daysFromEpoch(this.props.epoch, this.today);
      this.updateSelection = this.updateSelection.bind(this);
      this.onPreviewChange = this.onPreviewChange.bind(this);
      this.fetchAvailability = this.fetchAvailability.bind(this, this.props.id);
      //this.updateCache = this.updateCache.bind(this)

      this.getAvailabilityKey = context.drizzle.contracts.Blockspace.methods.getAvailability.cacheCall(1*this.props.id, startDay, startDay + 59);
      this.cachedAvailability = [];
      this.bookedDates = [];
      this.bookedRanges = [];

      this.state = {selections: [{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		}]};
  }

  updateSelection (inpt) {
      const selection = inpt[Object.keys(inpt)[0]];
      selection.key = 'selection';
      selection.color = null;
      const selections = [selection];
      this.setState(Object.assign({}, this.state, {selections}));
      this.props.dispatchUpdate(selection);//super hacky but calendar widgets are hard
  }

  onPreviewChange (newDate) {
      const from = daysFromEpoch(this.props.epoch, new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), 1));
      this.fetchAvailability(from);
  }

  fetchAvailability (id, day) {
      if (day < 0) day = 0;
      this.getAvailabilityKey = this.context.drizzle.contracts.Blockspace.methods.getAvailability.cacheCall(1*id, day, day + 59);
  }

  updateCache (update) {
      let i = 0;
      let from = update.args[1];
      let to = update.args[2];
      while (from < to) {
          this.cachedAvailability[from] = update.value[i];
          from++;
          i++;
      }
      this.bookedDates = this.cachedAvailability
        .map((a, i) => a && dateFromEpoch(this.props.epoch, i))
        .filter(a => a);
      this.bookedRanges = this.cachedAvailability
        .reduce((acc, a, i) => {
            if (a) {//if the
                if (!acc[acc.length-1] || acc[acc.length-1].endDate) {
                    acc.push({startDate: dateFromEpoch(this.props.epoch, i), key: 'booked', disable: true, color: 'grey' })
                }
            } else {
                if (acc[acc.length-1]  && !acc[acc.length-1].endDate) {
                    acc[acc.length-1].endDate = dateFromEpoch(this.props.epoch, i-1)
                }
            }
            return acc;
        }, [])
  }

  render() {
    let availability;
    if (this.props.availability[this.getAvailabilityKey]) {
        this.updateCache(this.props.availability[this.getAvailabilityKey])
    } else {
         'loading Availability';
    }
    const ranges = this.state.selections.concat(this.bookedRanges);
    console.log('bookd dates: ', this.bookedDates);
    return (


        <div className="pure-g">


          <div className="pure-u-1-1">

              <DateRange
                ranges={ranges} // momentPropTypes.momentObj or null,
                onChange={this.updateSelection} // PropTypes.func.isRequired,
                minDate={this.today}
                onShownDateChange={this.onPreviewChange}
                //disableDates={this.bookedDates.map(a => new Date(a))}
                months={2}
                showDateDisplay={false}
                direction={'horizontal'}
              />



            <br/><br/>
          </div>


        </div>

    )
  }
}

DatePicker.contextTypes = {
  drizzle: PropTypes.object
}
// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    availability: state.contracts.Blockspace.getAvailability,
    id: state.routing.locationBeforeTransitions.pathname.split('/')[2],

  }
}

const dispatchToProps = dispatch => {
    return {
        dispatchUpdate: selection => dispatch({type: 'UPDATE_RESERVATION_DATES', payload: selection})
    }
}

export default drizzleConnect(DatePicker, mapStateToProps, dispatchToProps);
