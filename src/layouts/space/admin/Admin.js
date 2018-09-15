import React, { Component } from 'react'
import { AccountData } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import classname from 'classnames'
import Loading from 'react-loading'
import Nav from '../common/Nav'
import Menu from '../../common/admin/Menu'
import Content from '../../common/admin/Content'
import { withRouter } from 'react-router-dom'

import { getMultihashFromContractResponse } from '../../../util/multiHash'

class Admin extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;
      this.contract = this.props.contracts[this.contractAddr];
      this.methods = context.drizzle.contracts[this.contractAddr].methods;

      this.pausedKey = this.methods.paused.cacheCall();
      this.getContractBalanceKey = this.methods.getContractBalance.cacheCall();
      this.ownerKey = this.methods.owner.cacheCall();


      this.createSpace = this.createSpace.bind(this);
      this.updateWithdrawAmt = this.updateWithdrawAmt.bind(this);
      this.withdraw = this.withdraw.bind(this);

      this.state = {
          showing: 'admin',
          withdrawAmt: 0
      };
  }

  withdraw () {
      this.methods.withdraw.cacheSend(this.state.withdrawAmt);
      this.setState(Object.assign({}, this.state, {withdrawAmt: 0}));
  }

  updateWithdrawAmt (e) {
    this.setState(Object.assign({}, this.state, {withdrawAmt: e.target.value}));
  }

  togglePause (isPaused) {
    if (isPaused) {
      this.methods.unpause.cacheSend();
    } else {
      this.methods.pause.cacheSend();
    }
  }

  show = (showing) => this.setState({showing})


  render() {
    let paused = "Loading Paused";
    let contractBalance = 'Loading Contract Balance';


    if (this.getContractBalanceKey in this.contract.getContractBalance) {
      contractBalance = this.contract.getContractBalance[this.getContractBalanceKey].value;
    }

    if (this.pausedKey in this.contract.paused) {
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
            <Menu changeView={this.show}/>
            <Content show={this.state.showing}
              contract={this.contract}
              contractAddr={this.contractAddr} />
          </div>
        </div>
      </main>
    )
  }
}

Admin.contextTypes = {
  drizzle: PropTypes.object
}

export default withRouter(Admin)
