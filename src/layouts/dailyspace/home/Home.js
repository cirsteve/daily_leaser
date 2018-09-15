import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData } from 'drizzle-react-components'

import Grid from '../../common/Grid'
import SpaceTile from '../../common/spaces/SpaceTile'
import Nav from '../common/Nav'

import { getMultihashFromContractResponse } from '../../../util/multiHash'
import { formatSpacesResponse } from '../../../util/responseHandlers'

class Home extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;
      this.methods = context.drizzle.contracts[this.contractAddr].methods;
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
        null,
      layoutHash: this.contract.layoutHash[this.layoutHashKey] ?
        <img alt="layout file hash"
          src={`https://ipfs.infura.io/ipfs/${getMultihashFromContractResponse(this.contract.layoutHash[this.layoutHashKey].value)}`} /> :
        null,
      fees: this.contract.getFees[this.feesKey] ?
        this.contract.getFees[this.feesKey].value :
        null,
      metaHashes: this.contract.getMetaHashes[this.metaHashesKey] ?
        this.contract.getMetaHashes[this.metaHashesKey].value :
        null
    }
  }

  render() {
    let {spaces, layoutHash, fees, metaHashes} = this.getRenderValues();
    let items = 'Loading Spaces';
    if (spaces && fees && metaHashes) {
      items = spaces.map((s, idx) => <SpaceTile key={idx} fee={fees[s.feeIdx]} metaHash={metaHashes[s.metaHashesIdx]} />)
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
          <Nav contractAddr={this.contractAddr} ownerKey={this.ownerKey}/>
            <h2><a href="/user">Account Details</a></h2>
            <AccountData accountIndex="0" units="ether" precision="3" />
            <div className="pure-u-1-4">

            <Grid items={items} />
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
