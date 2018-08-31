import React, { Component } from 'react'
import PropTypes from 'prop-types'

//var Blockspace = artifacts.require("Blockspace");
import Blockspace from '../../../build/contracts/Blockspace.json'

class LaunchedContract extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.launchedContractsKey = context.drizzle.contracts.Launcher.methods.getLaunchedContracts.cacheCall();


  }

  componentDidMount () {
    let contractConfig = {
      contractName: this.props.contractAddr,
      web3Contract: new this.props.web3.eth.Contract(Blockspace.abi, this.props.contractAddr)
    }
    this.context.drizzle.addContract(contractConfig);
  }


  render() {

    return (


        <div>

          <div className="pure-u-1-1">


            <a href={`/${this.props.contractAddr}`}>{this.props.contractAddr}</a>

          </div>

        </div>

    )
  }
}

LaunchedContract.contextTypes = {
  drizzle: PropTypes.object
}

export default LaunchedContract
