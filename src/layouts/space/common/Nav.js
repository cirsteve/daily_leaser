import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

let links = [
    {
        label: 'Home',
        href: ''
    },
    {
        label: 'User Reservations',
        href: 'user'
    }
]

class Nav extends Component {
  render() {
      let hrefs = [...links];
      if ((this.props.ownerKey in this.props.contracts[this.props.contractAddr].owner) &&
        this.props.contracts[this.props.contractAddr].owner[this.props.ownerKey].value === this.props.account) {
          hrefs = [...links, {label: 'Admin', href: 'admin'}];
      };

    return (
      <div className="inline-divs">
        <div>
            <Link to={`/spaces/${this.props.contractAddr}`}><h2 className="title">BlockSpace</h2></Link>
        </div>
        <div className="navbar navbar-right">
            {hrefs.map(l => <Link key={l.label} to={`/spaces/${this.props.contractAddr}/${l.href}`}>{l.label}</Link>)}
        </div>
      </div>
    )
  }
}

Nav.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    contracts:  state.contracts
  }
}

export default drizzleConnect(Nav, mapStateToProps);
