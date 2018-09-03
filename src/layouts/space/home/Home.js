import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData } from 'drizzle-react-components'

import Spaces from './Spaces'
import Nav from '../common/Nav'

class Home extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;
      this.contract = context.drizzle.contracts[this.contractAddr].methods;
      this.layoutHashKey = this.contract.layoutHash.cacheCall();
      this.ownerKey = this.contract.owner.cacheCall();
      this.spaceLimitKey = this.contract.spaceLimit.cacheCall();
  }

  render() {
    let spaces = 'Loading Spaces';
    let layoutHash = 'Loading Layout Hash';
    if (this.spaceLimitKey in this.props.contracts[this.contractAddr].spaceLimit) {
      let spaceLimit = this.props.contracts[this.contractAddr].spaceLimit[this.spaceLimitKey].value;
      spaces = <Spaces spaceLimit={spaceLimit} contractAddr={this.contractAddr} />;
    }

    if (this.layoutHashKey in this.props.contracts[this.contractAddr].layoutHash) {
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
