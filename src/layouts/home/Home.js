import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData } from 'drizzle-react-components'

import Space from '../common/Space'
import Nav from '../common/Nav'

import Blockspace from '../../../build/contracts/Blockspace.json'

class Home extends Component {
  constructor (props, context) {
      super(props);
      this.contracts = context.drizzle.contracts;

      this.getSpacesKey = this.contracts[this.props.contractAddr].methods.getSpaces.cacheCall();
      this.layoutHashKey = this.contracts[this.props.contractAddr].methods.layoutHash.cacheCall();

  }

  render() {
    let spaces, layoutHash, paused;
    if (!(this.getSpacesKey in this.props.contract.getSpaces)) {
      spaces = "Loading Spaces";
    } else {
      let spaceIds = this.props.contract.getSpaces[this.getSpacesKey].value;
      spaces = spaceIds.map(id => <Space key={id} id={id} />);
    }

    if (!(this.layoutHashKey in this.props.contract.layoutHash)) {
      layoutHash = "Loading Layout Hash";
    } else {
      if (this.props.contract.layoutHash[this.layoutHashKey]) {
        layoutHash = <img alt="layout file hash" src={`https://ipfs.infura.io/ipfs/${this.props.contract.layoutHash[this.layoutHashKey].value}`} />;
      } else {
        layoutHash = "No layout file set";
      }
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
          {paused}
            <Nav />
            <h2><a href="/user">Account Details</a></h2>
            <AccountData accountIndex="0" units="ether" precision="3" />
            <div className="pure-u-1-4">

            {spaces}
            </div>

            <div className="pure-u-3-4 right">
              {layoutHash}
            </div>

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
