import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import PropTypes from 'prop-types'

import Fields from './SpaceFields'
import Space from './Space'

class Home extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.contracts = context.drizzle.contracts;
      this.getSpacesKey = this.contracts.Blockspace.methods.getSpaces.cacheCall();
      this.createSpace = this.createSpace.bind(this);
  }

  createSpace (hash) {
      this.contracts.Blockspace.methods.createSpace.cacheSend(hash);
  }

  render() {
    let spaceIds;
    if (!(this.getSpacesKey in this.props.Blockspace.getSpaces)) {
      spaceIds = "Loading Spaces";
    } else {
      spaceIds = this.props.Blockspace.getSpaces[this.getSpacesKey].value.map(id => <Space key={id} id={id} />);
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Blockspace</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>

            <p><strong>Create Space</strong>:</p>
            <Fields getFieldsHash={this.props.getFieldsHash}/>
            <p>Hash: {this.props.space.toCreate.hash}</p>
            <input type="button" value="Create Space" onClick={this.createSpace.bind(this, this.props.space.toCreate.hash)} />
            <ContractData contract="Blockspace" method="getDepositAmount" />
            <ContractForm contract="Blockspace" method="updateDepositAmount" />
            <ContractData contract="Blockspace" method="getSpaces" />
            {spaceIds}


            <br/><br/>
          </div>


        </div>
      </main>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home
