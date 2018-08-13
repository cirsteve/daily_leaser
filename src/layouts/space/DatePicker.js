import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'

import { DateRangePicker } from 'react-date-range'

class DatePicker extends Component {

  constructor() {
      super()
      this.updateDate = this.updateDate.bind(this);
      this.state = {selections: [{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		}]};
  }

  updateDate (inpt) {
      console.log('uudd:', inpt);
      this.setState(Object.assign({}, this.state, {selections: [inpt.selection]}));
  }

  render() {
    return (

        <div className="pure-g">


          <div className="pure-u-1-1">

              <DateRangePicker
                ranges={this.state.selections} // momentPropTypes.momentObj or null,

                onChange={this.updateDate} // PropTypes.func.isRequired,
              />



            <br/><br/>
          </div>


        </div>

    )
  }
}

export default DatePicker
