import React, { Component } from 'react'
import { AccountData } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import classname from 'classnames'
import Loading from 'react-loading'
import MetaHashFields from './MetaHashFields'
import AdminFields from './AdminFields'
import UpdateFields from './UpdateFields'
import Space from '../common/Space'
import Nav from '../common/Nav'
import Menu from '../../common/admin/menu'

import { getMultihashFromContractResponse } from '../../../util/multiHash'

class Admin extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;
      this.contract = this.props.contracts[this.contractAddr];
      this.methods = context.drizzle.contracts[this.contractAddr].methods;

      this.getSpacesKey = this.methods.getSpaces.cacheCall();
      this.pausedKey = this.methods.paused.cacheCall();
      this.getContractBalanceKey = this.methods.getContractBalance.cacheCall();
      this.ownerKey = this.methods.owner.cacheCall();
      this.metaHashesKey = this.methods.getMetaHashes.cacheCall();
      this.fieldsHashKey = this.methods.getFieldsHash.cacheCall();
      this.feesKey = this.methods.getFees.cacheCall();

      this.createSpace = this.createSpace.bind(this);
      this.updateWithdrawAmt = this.updateWithdrawAmt.bind(this);
      this.withdraw = this.withdraw.bind(this);

      this.state = {
          showing: 'admin',
          withdrawAmt: 0
      };
  }

  createSpace (hash) {
      this.methods.createSpace.cacheSend(hash);
      this.props.clearCreateHash();
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

  show (showing) {
      this.setState({showing});
  }

  render() {
    let spaces, fieldsForm, paused;
    let pendingId = 0;
    let updateFields = 'Loading Fields';
    let contractBalance = 'Loading Contract Balance';
    if (!(this.getSpacesKey in this.contract.getSpaces)) {
      spaces = "Loading Spaces";
      fieldsForm = "Loading Form Data";
    } else {
      let spaceIds = this.contract.getSpaces[this.getSpacesKey].value;
      pendingId = 1*spaceIds[spaceIds.length -1] + 1;
      spaces = spaceIds.map(id => <Space key={id} id={id} contractAddr={this.contractAddr}/>);
      fieldsForm = <FieldsForm pendingId={pendingId} generateFieldsHash={this.props.generateFieldsHash}/>
    }

    if (this.getContractBalanceKey in this.contract.getContractBalance) {
      contractBalance = this.contract.getContractBalance[this.getContractBalanceKey].value;
    }

    if (this.fieldsHashKey in this.contract.getFieldsHash) {
      const currentFieldsHash = getMultihashFromContractResponse(
        this.contract.getFieldsHash[this.fieldsHashKey])
      updateFields =  <UpdateFields contractAddr={this.contractAddr}/>
    }

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
            <Menu />


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
