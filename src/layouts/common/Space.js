import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import IpfsContent from '../common/IpfsContent'

class Space extends Component {
  constructor (props, context) {
      super(props);
      this.key = context.drizzle.contracts[this.props.contractAddr].methods.getSpace.cacheCall(this.props.id);
  }

  render() {
      let spaceData;
      if (!(this.key in this.props.contracts[this.props.contractAddr].getSpace)) {
          return `Loading from chain`;
      } else {
          spaceData = this.props.contracts[this.props.contractAddr].getSpace[this.key].value;
      }

    return (
      <div className="space-item">
        <Link to={`/${this.props.contractAddr}/space/${spaceData[0]}`}>
          <IpfsContent hash={spaceData[1]} />
        </Link>
      </div>
    )
  }
}

Space.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    contracts: state.contracts,
    space: state.space,
  }
}

export default drizzleConnect(Space, mapStateToProps);
