import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import DailyLease from '../../../build/contracts/DailyLease.json'
import BlockLease from '../../../build/contracts/BlockLease.json'


import DailyspaceHome from '../dailyspace/home/HomeContainer'
import DailyspaceAdmin from '../dailyspace/admin/AdminContainer'
import DailyspaceSpaceContainer from '../dailyspace/space/SpaceContainer'
import DailyspaceUser from '../dailyspace/reservations/ReservationsContainer'

import SpaceHome from '../space/home/HomeContainer'
import SpaceAdmin from '../space/admin/AdminContainer'
import SpaceSpaceContainer from '../space/space/SpaceContainer'
import SpaceUser from '../space/reservations/ReservationsContainer'

class ContractWrapper extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;

  }

  componentDidMount () {
    if (!this.context.drizzle.contracts[this.props.contractAddr]) {
      this.context.drizzle.addContract({
        contractName: this.contractAddr,
        web3Contract: new this.props.web3.eth.Contract(
          this.props.match.params.site === 'blocklease' ? BlockLease.abi : DailyLease.abi,
          this.contractAddr,
          {from:this.props.account, gas: 2626549, gasPrice: 5})
      })
    }
  }

  getDailySpaceComponent () {
    switch(this.props.match.path.split('/')[3]) {
      case 'admin':
        return <DailyspaceAdmin contractAddr={this.contractAddr} />;
      case 'space':
        return <DailyspaceSpaceContainer contractAddr={this.contractAddr} />;
      case 'user':
        return <DailyspaceUser contractAddr={this.contractAddr} />;
      default:
        return <DailyspaceHome contractAddr={this.contractAddr} />
    }
  }

  getSpaceComponent () {
    switch(this.props.match.path.split('/')[3]) {
      case 'admin':
        return <SpaceAdmin contractAddr={this.contractAddr} />;
      case 'space':
        return <SpaceSpaceContainer contractAddr={this.contractAddr} />;
      case 'user':
        return <SpaceUser contractAddr={this.contractAddr} />;
      default:
        return <SpaceHome contractAddr={this.contractAddr} />
    }
  }

  shouldComponentUpdate () {
    return !this.rendered;
  }

  render() {
    let comp = 'Loading Contract';
    if (this.context.drizzle.contracts[this.contractAddr]) {
      if (this.props.match.params.site === 'spaces') {
        comp = this.getSpaceComponent();
      } else {
        comp = this.getDailySpaceComponent();
      }
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
    account: state.accounts[0],
    contracts: state.contracts,
    web3: state.web3Instance.web3Instance
  }
}

export default drizzleConnect(ContractWrapper, mapStateToProps);
