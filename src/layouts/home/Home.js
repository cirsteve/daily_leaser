import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import Space from '../common/Space'

class Home extends Component {
  constructor (props, context) {
      super(props);
      this.contracts = context.drizzle.contracts;
      //this.getOwnerKey = this.contracts.Blockspace.methods.getOwner.cacheCall();
      this.getSpacesKey = this.contracts.Blockspace.methods.getSpaces.cacheCall();
  }

  render() {
    let spaces;
    if (!(this.getSpacesKey in this.props.Blockspace.getSpaces)) {
      spaces = "Loading Spaces";
    } else {
      let spaceIds = this.props.Blockspace.getSpaces[this.getSpacesKey].value;
      spaces = spaceIds.map(id => <Space key={id} id={id} />);
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <h2><a href="/user">Account Details</a></h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Blockspace</h2>

            {spaces}


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
