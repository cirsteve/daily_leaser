import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

//var Blockspace = artifacts.require("Blockspace");
import Blockspace from '../../../build/contracts/Blockspace.json'

class LaunchedContract extends Component {
  componentDidMount () {
    let contractConfig = {
      contractName: this.props.contractAddr,
      web3Contract: new this.props.web3.eth.Contract(Blockspace.abi, this.props.contractAddr, {from: this.props.account})
    }
    this.context.drizzle.addContract(contractConfig);
  }

  render() {
    const link = <Link to={`/${this.props.contractAddr}`}>{this.props.contractAddr}</Link>;
    return (


        <div>

          <div className="pure-u-1-1">


            {link}

          </div>

        </div>

    )
  }
}

LaunchedContract.contextTypes = {
  drizzle: PropTypes.object
}

export default LaunchedContract
