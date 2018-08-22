import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

class IpfsContent extends Component {
  constructor (props, context) {
      console.log('ipfs content con', props, context)
      super(props);
      if (!(this.props.hash in this.props.hashedContent)) this.props.getContent(this.props.hash);
  }


  render() {
      let ipfsData;
      if (!(this.props.hash in this.props.hashedContent)) {
          ipfsData = `Loading from ipfs`;
      } else {
          let fields = this.props.hashedContent[this.props.hash];
          ipfsData = Object.keys(fields).filter(k => fields[k]).map( k => <div key={k}>{k} : {fields[k]}</div>);
      }

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
    hashedContent: state.space.hashedContent,
  }
}

const dispatchToProps = (dispatch) => {
    return {
        getContent: hash => dispatch({type: 'GET_FIELDS_REQUESTED', payload: {hash}})
    };
}

export default drizzleConnect(IpfsContent, mapStateToProps, dispatchToProps);
