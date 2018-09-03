import React, { Component } from 'react'
import { AccountData } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import classname from 'classnames'

import Loading from 'react-loading'
import MetaFields from './MetaFields'

import Nav from '../common/Nav'

class Admin extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.contractAddr = props.contractAddr;
      this.contract = context.drizzle.contracts[this.contractAddr].methods;
      this.pausedKey = this.contract.paused.cacheCall();
      this.getContractBalanceKey = this.contract.getContractBalance.cacheCall();
      this.ownerKey = this.contract.owner.cacheCall();

      this.updateWithdrawAmt = this.updateWithdrawAmt.bind(this);
      this.withdraw = this.withdraw.bind(this);

      this.state = {
          withdrawAmt: 0
      };
  }

  withdraw () {
      this.context.drizzle.contracts.Blockspace.methods.withdraw.cacheSend(this.state.withdrawAmt);
      this.setState(Object.assign({}, this.state, {withdrawAmt: 0}));
  }

  updateWithdrawAmt (e) {
    this.setState(Object.assign({}, this.state, {withdrawAmt: e.target.value}));
  }

  togglePause (isPaused) {
    if (isPaused) {
      this.context.drizzle.contracts.Blockspace.methods.unpause.cacheSend();
    } else {
      this.context.drizzle.contracts.Blockspace.methods.pause.cacheSend();
    }
  }

  render() {
    let paused;
    let contractBalance = 'Loading Contract Balance';

    if (this.getContractBalanceKey in this.props.contracts[this.contractAddr].getContractBalance) {
      contractBalance = this.props.contracts[this.contractAddr].getContractBalance[this.getContractBalanceKey].value;
    }

    const metaClass = classname({
        'meta': true
    })


    const metaButtonClass = classname({
        'selected': true
    })

    if (!(this.pausedKey in this.props.contracts[this.contractAddr].paused)) {
      paused = "Loading Paused";
    } else {
      paused = this.props.contracts[this.contractAddr].paused[this.pausedKey].value ?
        <input type="button" value="Unpause Contract" onClick={this.togglePause.bind(this, true)} /> :
        <input type="button" value="Pause Contract" onClick={this.togglePause.bind(this, false)} /> ;
    }



    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <Nav contractAddr={this.contractAddr} ownerKey={this.ownerKey} />
            <h4>Active Account</h4>
            <AccountData accountIndex="0" units="ether" precision="3" />
            <div>
              <h4>Contract Balance: {contractBalance}</h4>
              <input type="text" value={this.state.withdrawAmt} onChange={this.updateWithdrawAmt} />
              <input type="button" value="Withdraw" onClick={this.withdraw} />
            </div>
            <br />
          </div>

          <div>
            {this.props.ipfsError ? 'IPFS is down, run it locally if possible' : ''}
          </div>

          <div className="pure-u-1-1">
            <div className="menu pure-u-1-3">
                <div>
                  {paused}
                </div>
                <div className="nav-menu">
                  <div className={metaButtonClass}>
                      Edit Meta Data
                  </div>
                </div>

            </div>
            <div className="content pure-u-3-5">
                <div className={metaClass}>
                    <MetaFields contractAddr={this.contractAddr}/>
                </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

Admin.contextTypes = {
  drizzle: PropTypes.object
}

export default Admin
