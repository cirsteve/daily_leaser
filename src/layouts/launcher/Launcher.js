import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import getWeb3 from '../../util/web3/getWeb3'
import Loading from 'react-loading'

import { AccountData } from 'drizzle-react-components'
import Address from '../common/Address'
import { generateEpoch } from '../../util/time'

class Launcher extends Component {
  constructor (props, context) {
      super(props);
      this.methods = context.drizzle.contracts.Launcher.methods;
      this.blockspacesKey = this.methods.getLaunchedBlockLeases.cacheCall();
      this.dailyspacesKey = this.methods.getLaunchedDailyLeases.cacheCall();

      this.state = {
        spaceCount: 0
      };
  }

  launchDailyLease = () => {
    this.methods.launchDailyLease.cacheSend(generateEpoch());
  }

  launchBlockLease = (count) => {
    this.methods.launchBlockLease.cacheSend(1*count);
    this.setState({spaceCount:0})
  }

  render() {
    let blockspaces = 'Loading Blockspaces';
    let spaces = 'Loading Spaces';
    let isSynced = this.props.Launcher.synced;

    if (this.props.Launcher.getLaunchedBlockLeases[this.blockspacesKey]) {
      blockspaces = this.props.Launcher.getLaunchedBlockLeases[this.blockspacesKey].value.map(
        c=><div key={c}><Link to={`/spaces/${c}`}><Address address={c} chars={5} /></Link></div>);
      if (!blockspaces.length) {
        blockspaces = 'No Block Spaces';
      }
    }

    if (this.props.Launcher.getLaunchedDailyLeases[this.dailyspacesKey]) {
      spaces = this.props.Launcher.getLaunchedDailyLeases[this.dailyspacesKey].value.map(
        c=><div key={c}><Link to={`/dailyspaces/${c}`}><Address address={c} chars={5}/></Link></div>);
      if (!spaces.length) {
        spaces = 'No Daily Spaces';
      }
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <AccountData accountIndex="0" units="ether" precision="3" />

            <div className="pure-u-1-2">
              {isSynced ?
                <input type="button" onClick={this.launchDailyLease} value="Launch Daily Rentals" /> :
                <Loading type='cubes' color="gray" height={'20%'} width={'20%'} />}
              <h2>Daily Rentals</h2>

              {spaces}
            </div>
            <div className="pure-u-1-2">
              { isSynced ?
                <input type="button" onClick={this.launchBlockLease.bind(this, this.state.spaceCount)} value="Launch Block Rentals" /> :
                <Loading type='cubes' color="gray" height={'20%'} width={'20%'} /> }
              <input type="text" value={this.state.spaceCount} onChange={e => this.setState({spaceCount:e.target.value})} />
              <h2>Block Rentals</h2>

              {blockspaces}
            </div>

          </div>

        </div>
      </main>
    )
  }
}

Launcher.contextTypes = {
  drizzle: PropTypes.object
}

export default Launcher
