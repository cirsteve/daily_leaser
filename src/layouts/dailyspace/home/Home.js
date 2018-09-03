import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData } from 'drizzle-react-components'

import Space from '../common/Space'
import Nav from '../common/Nav'

class Home extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;
      this.contract = context.drizzle.contracts[this.contractAddr].methods;
      this.getSpacesKey = this.contract.getSpaces.cacheCall();
      this.layoutHashKey = this.contract.layoutHash.cacheCall();
      this.ownerKey = this.contract.owner.cacheCall();

  }

  render() {
    let spaces, layoutHash, paused;
    if (!(this.getSpacesKey in this.props.contracts[this.contractAddr].getSpaces)) {
      spaces = "Loading Spaces";
    } else {
      let spaceIds = this.props.contracts[this.contractAddr].getSpaces[this.getSpacesKey].value;
      spaces = spaceIds.length ? spaceIds.map(id => <Space key={id} id={id} contractAddr={this.contractAddr} />) : 'No spaces created';
    }

    if (!(this.layoutHashKey in this.props.contracts[this.contractAddr].layoutHash)) {
      layoutHash = "Loading Layout Hash";
    } else {
      if (this.props.contracts[this.contractAddr].layoutHash[this.layoutHashKey]) {
        layoutHash = <img alt="layout file hash" src={`https://ipfs.infura.io/ipfs/${this.props.contracts[this.contractAddr].layoutHash[this.layoutHashKey].value}`} />;
      } else {
        layoutHash = "No layout file set";
      }
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
          {paused}
          <Nav contractAddr={this.contractAddr} ownerKey={this.ownerKey}/>
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
