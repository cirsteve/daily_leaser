import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import getWeb3 from '../../util/web3/getWeb3'

import { AccountData } from 'drizzle-react-components'

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
    this.context.drizzle.contracts.Launcher.methods.launchBlockspace.cacheSend(new Date().getTime());
  }

  launchSpace (spaceCount) {
    this.context.drizzle.contracts.Launcher.methods.launchSpace.cacheSend(1*spaceCount);
  }

  render() {
    let blockspaces = 'Loading Blockspaces';
    let spaces = 'Loading Spaces';

    if (this.props.Launcher.getLaunchedBlockspaces[this.blockspacesKey]) {
      blockspaces = this.props.Launcher.getLaunchedBlockspaces[this.blockspacesKey].value.map(
        c=><Link key={c} to={`/dailyspaces/${c}`}>{c}</Link>);
      if (!blockspaces.length) {
        blockspaces = 'No Blockspaces';
      }
    }

    if (this.props.Launcher.getLaunchedSpaces[this.spacesKey]) {
      spaces = this.props.Launcher.getLaunchedSpaces[this.spacesKey].value.map(
        c=><Link key={c} to={`/spaces/${c}`}>{c}</Link>);
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
              <input type="button" onClick={this.launchBlockspace} value="Launch Blockspace" />
              <h2>Blockspaces</h2>

              {blockspaces}
            </div>
            <div className="pure-u-1-2">
              <input type="button" onClick={this.launchSpace.bind(this, this.state.spaceCount)} value="Launch Space" />
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
