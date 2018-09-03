import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'


import { DateRange } from 'react-date-range'
import { daysFromEpoch, dateFromEpoch } from '../../../util/time'

class DatePicker extends Component {

  constructor(props, context) {
      super(props)
      this.id = props.match.params.id;
      this.contractAddr = props.match.params.address;
      this.today = new Date()
      const startDay = daysFromEpoch(this.props.epoch, this.today);
      this.updateSelection = this.updateSelection.bind(this);
      this.onPreviewChange = this.onPreviewChange.bind(this);
      this.fetchAvailability = this.fetchAvailability.bind(this, this.id);

      this.getAvailabilityKey = context.drizzle.contracts[this.contractAddr].methods.getAvailability.cacheCall(1*this.id, startDay, startDay + 59);
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
      this.getAvailabilityKey = this.context.drizzle.contracts[this.contractAddr].methods.getAvailability.cacheCall(1*id, day, day + 59);
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
    if (this.props.contracts[this.contractAddr].getAvailability[this.getAvailabilityKey]) {
        this.updateCache(this.props.contracts[this.contractAddr].getAvailability[this.getAvailabilityKey])
    }
    const ranges = this.state.selections.concat(this.bookedRanges);

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
    contracts: state.contracts,
  }
}

const dispatchToProps = dispatch => {
    return {
        dispatchUpdate: selection => dispatch({type: 'UPDATE_RESERVATION_DATES', payload: selection})
    }
}

export default withRouter(drizzleConnect(DatePicker, mapStateToProps, dispatchToProps));
