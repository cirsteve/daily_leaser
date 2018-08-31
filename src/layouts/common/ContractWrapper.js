import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import IpfsContent from '../common/IpfsContent'

import Blockspace from '../../../build/contracts/Blockspace.json'

import Home from '../home/HomeContainer'

class ContractWrapper extends Component {
  constructor (props, context) {

      super(props);
      if (!context.drizzle.contracts[this.props.contractAddr]) {
        context.drizzle.addContract({
          contractName: this.props.contractAddr,
          web3Contract: new this.props.web3.eth.Contract(Blockspace.abi, this.props.contractAddr)
        })
      }
  }

  render() {
    let contract = this.context.drizzle.contracts[this.props.contractAddr] ? <Home /> : 'Loading Contract';
    console.log('contract is: ', contract);
    return (
      contract
    )
  }
}

ContractWrapper.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    contractAddr: state.routing.locationBeforeTransitions.pathname.split('/')[1],
    contracts: state.contracts,
    web3: state.web3Instance.web3Instance
  }
}

export default drizzleConnect(ContractWrapper, mapStateToProps);
