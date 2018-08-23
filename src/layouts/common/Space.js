import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import IpfsContent from '../common/IpfsContent'

class Space extends Component {
  constructor (props, context) {

      super(props);
      this.getFields = this.getFields.bind(this);
      this.contracts = context.drizzle.contracts;
      this.key = this.contracts.Blockspace.methods.getSpace.cacheCall(this.props.id);
  }

  getFields (hash) {
      this.props.getFields(hash);
  }

  render() {
      let spaceData;
      if (!(this.key in this.props.Blockspace.getSpace)) {
          return `Loading from chain`;
      } else {
          spaceData = this.props.Blockspace.getSpace[this.key].value;
      }

    return (
      <div>
        <a href={`/space/${spaceData[0]}`}>id: {spaceData[0]}</a>
        <IpfsContent hash={spaceData[1]} />
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
    Blockspace: state.contracts.Blockspace,

    space: state.space,
  }
}

export default drizzleConnect(Space, mapStateToProps);
