import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import IpfsContent from '../common/IpfsContent'

import Blockspace from '../../../build/contracts/Blockspace.json'

import Home from '../home/HomeContainer'
import Admin from '../admin/AdminContainer'
import Space from '../space/SpaceContainer'
import User from '../reservations/ReservationsContainer'

class ContractWrapper extends Component {
  constructor (props, context) {

      super(props);
      this.contractAddr = props.match.params.address;
      this.page = props.match.path.split('/')[2];
      if (!context.drizzle.contracts[this.props.contractAddr]) {
        context.drizzle.addContract({
          contractName: this.contractAddr,
          web3Contract: new this.props.web3.eth.Contract(Blockspace.abi, this.contractAddr, {from:this.props.account, gas: 2626549, gasPrice: 5})
        })
      }
  }

  getComponent () {
    switch(this.page) {
      case 'admin':
        return <Admin contractAddr={this.contractAddr} />;
      case 'space':
        return <Space contractAddr={this.contractAddr} />;
      case 'user':
        return <User contractAddr={this.contractAddr} />;
      default:
        return <Home contractAddr={this.contractAddr} />
    }
  }

  shouldComponentUpdate () {
    return !this.rendered;
  }

  render() {
    let comp = 'Loading Contract';
    if (this.context.drizzle.contracts[this.contractAddr]) {
      comp = this.getComponent();
      this.rendered = true;
    }
    return (
      comp
    )
  }
}

ContractWrapper.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    //contractAddr: state.routing.locationBeforeTransitions.pathname.split('/')[1],
    contracts: state.contracts,
    web3: state.web3Instance.web3Instance
  }
}

export default drizzleConnect(ContractWrapper, mapStateToProps);
