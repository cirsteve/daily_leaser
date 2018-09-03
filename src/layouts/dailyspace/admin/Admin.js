import React, { Component } from 'react'
import { AccountData } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import classname from 'classnames'

import Loading from 'react-loading'
import FieldsForm from './SpaceFields'
import MetaFields from './MetaFields'
import Space from '../common/Space'
import Nav from '../common/Nav'

class Admin extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.contractAddr = props.contractAddr;
      this.contract = context.drizzle.contracts[this.contractAddr].methods;
      this.getSpacesKey = this.contract.getSpaces.cacheCall();
      this.pausedKey = this.contract.paused.cacheCall();
      this.getContractBalanceKey = this.contract.getContractBalance.cacheCall();
      this.ownerKey = this.contract.owner.cacheCall();

      this.createSpace = this.createSpace.bind(this);
      this.updateWithdrawAmt = this.updateWithdrawAmt.bind(this);
      this.withdraw = this.withdraw.bind(this);

      this.state = {
          showMeta: true,
          withdrawAmt: 0
      };
  }

  createSpace (hash) {
      this.createSpaceKey = this.context.drizzle.contracts[this.props.contractAddr].methods.createSpace.cacheSend(hash);
      console.log('creating spake key', this.createSpaceKey);
      this.props.clearCreateHash();
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

  showMeta (showMeta) {
      this.setState({showMeta});
  }

  render() {
    let spaces, fieldsForm, paused;
    let pendingId = 0;
    let contractBalance = 'Loading Contract Balance';
    if (!(this.getSpacesKey in this.props.contracts[this.contractAddr].getSpaces)) {
      spaces = "Loading Spaces";
      fieldsForm = "Loading Form Data";
    } else {
      let spaceIds = this.props.contracts[this.contractAddr].getSpaces[this.getSpacesKey].value;
      pendingId = 1*spaceIds[spaceIds.length -1] + 1;
      spaces = spaceIds.map(id => <Space key={id} id={id} contractAddr={this.contractAddr}/>);
      fieldsForm = <FieldsForm pendingId={pendingId} generateFieldsHash={this.props.generateFieldsHash}/>
    }

    if (this.getContractBalanceKey in this.props.contracts[this.contractAddr].getContractBalance) {
      contractBalance = this.props.contracts[this.contractAddr].getContractBalance[this.getContractBalanceKey].value;
    }

    const fieldsHash = this.props.space.pendingHashGeneration ?
        'Generating Hash' : this.props.space.toCreate.hash;

    const createClass = classname({
        'create': true,
        'hidden': this.state.showMeta
    });

    const metaClass = classname({
        'meta': true,
        'hidden': !this.state.showMeta
    })

    const createButtonClass = classname({
        'selected': !this.state.showMeta
    });

    const metaButtonClass = classname({
        'selected': this.state.showMeta
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
              <input type="text" value={this.state.withdrawAmt} onChange={this.updateWithdrawAmt} /><input type="button" value="Withdraw" onClick={this.withdraw} />
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
                  <div className={metaButtonClass} onClick={this.showMeta.bind(this, true)}>
                      Edit Meta Data
                  </div>
                  <div className={createButtonClass} onClick={this.showMeta.bind(this, false)}>
                      Create Space
                  </div>
                </div>
                <div>
                    {spaces}
                </div>
            </div>
            <div className="content pure-u-3-5">
                <div className={createClass}>
                    {fieldsForm}
                    <p>Hash: {fieldsHash}</p>
                    {this.props.space.toCreate.hash ?
                      <input type="button" value="Create Space" onClick={this.createSpace.bind(this, this.props.space.toCreate.hash)} /> :
                        this.props.contracts[this.contractAddr].synced ?
                          'Generate Hash to Create Space' :  <Loading type='cubes' color="gray" height={'20%'} width={'20%'} />
}
                </div>
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
