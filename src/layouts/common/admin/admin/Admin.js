import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Layout from './Layout'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class AdminContent extends Component {
  constructor(props, context) {
    super(props);
    this.methods = context.drizzle.contracts[props.contractAddr].methods;
    this.depositKey = this.methods.depositPct.cacheCall();


    this.state =  {
      deposit: 0,
      fee: 0
    }

  }

  submitFee = () => {
    this.methods.addFee.cacheSend(this.state.fee);
  }

  updateFee = (e) => {
    this.setState({...this.state, fee:e.target.value});
  }

  submitDeposit = () => {
    this.methods.updateDepositPct.cacheSend(this.state.deposit);
  }

  updateDeposit = (e) => {
    this.setState({...this.state,deposit:e.target.value});
  }

  getRenderValues () {
    const {feesKey, depositKey, pausedKey} = this.props;
    const contract = this.getContract();
    return {
      fees: contract.getFees[feesKey] ?
        contract.getFees[feesKey].value.map(
          f => <div key={f}>{f}</div>
        ) : 'Loading Fees',
      deposit: contract.depositPct[depositKey] ?
        contract.depositPct[depositKey].value : 'Loading Deposit',
      paused: contract.paused[pausedKey] ?
        contract.paused[pausedKey].value ?
          <input type="button" value="Unpause Contract" onClick={this.togglePause.bind(this, true)} /> :
          <input type="button" value="Pause Contract" onClick={this.togglePause.bind(this, false)} />
        : 'Loading Contract Values'
    }
  }

  togglePause = (isPaused) => {
    if (isPaused) {
      this.methods.unpause.cacheSend();
    } else {
      this.methods.pause.cacheSend();
    }
  }

  getContract = () => this.props.contracts[this.props.contractAddr]

  render() {
    const {fees, deposit, paused} = this.getRenderValues();
    const {classes} = this.props;
    return (
          <div>
            <div>
              <h4>Deposit Percentage</h4>
              <h5>{ deposit }%</h5>
              <TextField
                id="deposit"
                label="Deposit %"
                className={''}
                value={this.state.deposit}
                type="number"
                onChange={this.updateDeposit.bind(this)}
                margin="normal" />
              <Button variant="contained" className={classes.button} onClick={this.submitDeposit}>
                Update Deposit % to {this.state.deposit}
              </Button>
            </div>
            <div className="pure-u-1-3 right">
                <h4>Fee</h4>
                { fees }
                <TextField
                  id="fee"
                  label="fee"
                  className={''}
                  value={this.state.fee}
                  type="number"
                  onChange={this.updateFee}
                  margin="normal" />
                <Button variant="contained" className={classes.button} onClick={this.submitFee}>
                  Add Fee {this.state.fee}
                </Button>
            </div>
            <div>
              <Layout contract={this.props.contract} contractAddr={this.props.contractAddr} layoutHashKey={this.props.layoutHashKey}/>
            </div>
            <div>
              <h4>Contract Status</h4>
              <div>
                {paused}
              </div>
            </div>
          </div>
    )
  }
}

AdminContent.propTypes = {
  classes: PropTypes.object.isRequired,
  contract: PropTypes.object.isRequired,
  contractAddr: PropTypes.string.isRequired,
  feesKey: PropTypes.string.isRequired,
  depositKey: PropTypes.string.isRequired,
  pausedKey: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {

    contracts: state.contracts
  }
}

AdminContent.contextTypes = {
  drizzle: PropTypes.object
}

export default withStyles(styles)(drizzleConnect(AdminContent, mapStateToProps));
