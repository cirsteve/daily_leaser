import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData } from 'drizzle-react-components'

import Space from '../common/Space'
import Nav from '../common/Nav'

import { getMultihashFromContractResponse } from '../../../util/multiHash'
import { formatSpacesResponse } from '../../../util/responseHandlers'

class Home extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;
      this.methods = context.contracts[this.contractAddr].methods;
      this.contract = props.contracts[this.contractAddr];
      this.getSpacesKey = this.methods.getSpaces.cacheCall();
      this.layoutHashKey = this.methods.getLayoutHash.cacheCall();
      this.ownerKey = this.methods.owner.cacheCall();
      this.metaHashesKey = this.methods.getMetaHashes.cacheCall();
      this.feesKey = this.methods.getFees.cacheCall();

  }

  getRenderValues () {
    return {
      spaces: this.contract.getSpaces[this.getSpacesKey] ?
        formatSpacesResponse(this.contract.getSpaces[this.getSpacesKey].value):
        'Loading Spaces',
      layoutHash: this.contract.layoutHash[this.layoutHashKey] ?
        <img alt="layout file hash" src={`https://ipfs.infura.io/ipfs/${getMultihashFromContractResponse(this.contract.layoutHash[this.layoutHashKey].value)}`} />
    }
  }

  render() {
    {spaces, layoutHash} = this.getRenderValues();

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
          {paused}
          <Nav contractAddr={this.contractAddr} ownerKey={this.ownerKey}/>
            <h2><a href="/user">Account Details</a></h2>
            <AccountData accountIndex="0" units="ether" precision="3" />
            <div className="pure-u-1-4">

            <Grid />
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
