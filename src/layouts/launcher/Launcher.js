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
      console.log('con', props, context)
      super(props);
      this.blockspacesKey = context.drizzle.contracts.Launcher.methods.getLaunchedBlockspaces.cacheCall();
      this.spacesKey = context.drizzle.contracts.Launcher.methods.getLaunchedSpaces.cacheCall();

      this.launchBlockspace = this.launchBlockspace.bind(this);

      this.state = {
        spaceCount: 0
      };
  }

  launchBlockspace () {
    this.context.drizzle.contracts.Launcher.methods.launchBlockspace.cacheSend(generateEpoch());
  }

  launchSpace (count) {
    this.context.drizzle.contracts.Launcher.methods.launchSpace.cacheSend(1*count);
    this.setState({spaceCount:0})
  }

  render() {
    let blockspaces = 'Loading Blockspaces';
    let spaces = 'Loading Spaces';
    let isSynced = this.props.Launcher.synced;

    if (this.props.Launcher.getLaunchedBlockspaces[this.blockspacesKey]) {
      blockspaces = this.props.Launcher.getLaunchedBlockspaces[this.blockspacesKey].value.map(
        c=><div key={c}><Link to={`/dailyspaces/${c}`}><Address address={c} chars={5} /></Link></div>);
      if (!blockspaces.length) {
        blockspaces = 'No Blockspaces';
      }
    }

    if (this.props.Launcher.getLaunchedSpaces[this.spacesKey]) {
      spaces = this.props.Launcher.getLaunchedSpaces[this.spacesKey].value.map(
        c=><div key={c}><Link to={`/spaces/${c}`}><Address address={c} chars={5}/></Link></div>);
      if (!spaces.length) {
        spaces = 'No Spaces';
      }
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <AccountData accountIndex="0" units="ether" precision="3" />

            <div className="pure-u-1-2">
              {isSynced ?
                <input type="button" onClick={this.launchBlockspace} value="Launch Blockspace" /> :
                <Loading type='cubes' color="gray" height={'20%'} width={'20%'} />}
              <h2>Blockspaces</h2>

              {blockspaces}
            </div>
            <div className="pure-u-1-2">
              { isSynced ?
                <input type="button" onClick={this.launchSpace.bind(this, this.state.spaceCount)} value="Launch Space" /> :
                <Loading type='cubes' color="gray" height={'20%'} width={'20%'} /> }
              <input type="text" value={this.state.spaceCount} onChange={e => this.setState({spaceCount:e.target.value})} />
              <h2>Spaces</h2>

              {spaces}
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
