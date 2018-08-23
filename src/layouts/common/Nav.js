import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'

import PropTypes from 'prop-types'

let links = [
    {
        label: 'Home',
        href: '/'
    },
    {
        label: 'User Reservations',
        href: '/user'
    }
]

class Nav extends Component {
  constructor (props, context) {
      super(props);
      this.getOwnerKey = context.drizzle.contracts.Blockspace.methods.getOwner.cacheCall();
  }

  render() {
      let hrefs = [...links];
      if ((this.getOwnerKey in this.props.Blockspace.getOwner) && this.props.Blockspace.getOwner[this.getOwnerKey].value === this.props.account) {
          hrefs = [...links, {label: 'Admin', href: '/admin'}];
      };

    return (
      <div>
        <div>
            <h2>BlockSpace</h2>
        </div>
        <div>
            {hrefs.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
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
    Blockspace: state.contracts.Blockspace,
  }
}

export default drizzleConnect(Nav, mapStateToProps);
