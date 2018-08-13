import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

function spaceDetails(id, fields) {

}

class IpfsContent extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.props.getContent(this.props.hash);
  }


  render() {
      let ipfsData;
      if (!(this.props.hash in this.props.space)) {
          ipfsData = `Loading from ipfs`;
      } else {
          let fields = this.props.space[this.props.hash];
          ipfsData = Object.keys(fields).map( k => <div key={k}>{k} : {fields[k]}</div>);
      }
      console.log(' rend ipfs: ', ipfsData)
    return (
      <div>
        {ipfsData}
      </div>
    )
  }
}

IpfsContent.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    Blockspace: state.contracts.Blockspace,

    space: state.space,
  }
}

const dispatchToProps = (dispatch) => {
    return {
        getContent: hash => dispatch({type: 'GET_FIELDS_REQUESTED', payload: {hash}})
    };
}

export default drizzleConnect(IpfsContent, mapStateToProps, dispatchToProps);
