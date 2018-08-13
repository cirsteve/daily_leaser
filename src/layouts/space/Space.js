import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import PropTypes from 'prop-types'

class Space extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.contracts = context.drizzle.contracts;
      this.getSpaceKey = this.contracts.Blockspace.methods.getSpace.cacheCall(this.props.spaceIds);
      this.createSpace = this.createSpace.bind(this);
  }


  render() {
    let spaceId;
    if (!(this.getSpaceKey in this.props.Blockspace.getSpace)) {
      spaceId = "Loading Space";
    } else {
      spaceId = this.props.Blockspace.getSpace[this.getSpaceKey].value;
    }

    return (


        <div className="pure-g">

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Blockspace</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>


            <ContractData contract="Blockspace" method="getDepositAmount" />
            <ContractForm contract="Blockspace" method="updateDepositAmount" />
            <ContractData contract="Blockspace" method="getSpaces" />
            {spaceId}


            <br/><br/>
          </div>


        </div>

    )
  }
}

Space.contextTypes = {
  drizzle: PropTypes.object
}

export default Space
