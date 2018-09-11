import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Dropzone from 'react-dropzone'
import TextField from '@material-ui/core/TextField';
import Loading from 'react-loading'

import UpdateLayout from './UpdateLayout'

class Fields extends Component {
  constructor(props, context) {
    super(props);
    this.methods = context.drizzle.contracts[props.contractAddr].methods;

    this.feesKey = this.methods.getFees.cacheCall();
    this.depositKey = this.methods.depositPct.cacheCall();

    this.state.pending = {
      deposit: null,
      fee: null
    }
  }

  submitFee () {
    this.methods.addFee.cacheSend(this.state.pending.fee);
  }

  updateFee (fee) {
    this.setState({fee,...this.state});
  }

  submitDeposit () {
    this.methods.updateDepositPct.cacheSend(this.state.pending.deposit);
  }

  updateDeposit (deposit) {
    this.setState({deposit,...this.state});


  getRenderValues () {
    return {
      fees: this.props.contract.getFees[this.feesKey] ?
        this.props.contract.getFees[this.feesKey].value.map(
          f => <div key="f">{5}</diV>
        ) : 'Loading Fees',
      deposit: this.props.contract.depositPct[this.depositKey] ?
        this.props.contract.depositPct[this.depositKey].value : 'Loading Deposit'
    }
  }

  render() {
    {fees, deposit} = this.getRenderValues();

    return (

        <div className="pure-g">
          <div className="pure-u-1-1">
            <div>
              <h4>Deposit Percentage</h4>
              <h5>{ deposit }%</h5>
              <TextField
                id="deposit"
                label="Deposit %"
                className={''}
                value={label}
                type="number"
                onChange={this.updateDeposit)}
                margin="normal" />
              <Button variant="contained" className={classes.button} onClick={this.submitDeposit}>
                Update Deposit % to {this.state.pending.deposit}
              </Button>
            </div>
            <div className="pure-u-1-3 right">
                <h4>Fee</h4>
                { fees }
                <TextField
                  id="fee"
                  label="fee"
                  className={''}
                  value={label}
                  type="number"
                  onChange={this.updateFee)}
                  margin="normal" />
                <Button variant="contained" className={classes.button} onClick={this.submitFee}>
                  Update Deposit % to {this.state.pending.fee}
                </Button>
            </div>
            <div>
              <UpdateLayout contract={this.props.contract} contractAddr={this.props.contractAddr}/>
            </div>
          </div>
        </div>

    )
  }
}


Fields.contextTypes = {
  drizzle: PropTypes.object
}

export default drizzleConnect(Fields);
