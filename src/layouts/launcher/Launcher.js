import React, { Component } from 'react'
import PropTypes from 'prop-types'

import getWeb3 from '../../util/web3/getWeb3'

import { AccountData } from 'drizzle-react-components'
import LaunchedContract from './LaunchedContract'

class Launcher extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.launchedContractsKey = context.drizzle.contracts.Launcher.methods.getLaunchedContracts.cacheCall();
      this.launchContract = this.launchContract.bind(this);
      //getWeb3;

  }

  launchContract () {
    this.context.drizzle.contracts.Launcher.methods.launchContract.cacheSend(new Date().getTime());
  }

  render() {
    let contracts = 'Loading Contracts';
    if (this.props.Launcher.getLaunchedContracts[this.launchedContractsKey]) {
      contracts = this.props.Launcher.getLaunchedContracts[this.launchedContractsKey].value.map(
        c=><LaunchedContract key={c} contractAddr={c} web3={this.props.web3} />);
      if (!contracts.length) {
        contracts = 'No Contracts';
      }
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <AccountData accountIndex="0" units="ether" precision="3" />
            <input type="button" onClick={this.launchContract} value="Launch Contract" />

            <h2>Contracts</h2>

            {contracts}

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
