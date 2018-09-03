import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Dropzone from 'react-dropzone'

class Meta extends Component {
  constructor(props, context) {
    super(props);
    this.layoutHashKey = context.drizzle.contracts[props.contractAddr].methods.layoutHash.cacheCall();
  }

  onFileDrop (files) {
      const generateFileHash = this.props.generateFileHash;
          files.forEach(file => {
              const reader = new FileReader();
              reader.onloadend = async() => {
                  const buffer = await Buffer.from(reader.result)
                  generateFileHash(buffer);
              }
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');

              reader.readAsArrayBuffer(file);
          });
  }

  updateLayoutHash (hash) {
      this.updateLayoutHashKey = this.context.drizzle.contracts[this.props.contractAddr].methods.updateLayoutHash.cacheSend(hash);
      this.props.clearLayoutData();
  }

  render() {
    let layoutHash = 'No Layout Set';
    let updateLayout = 'Generating File Hash';
    if (this.layoutHashKey in this.props.contracts[this.props.contractAddr].layoutHash &&
      this.props.contracts[this.props.contractAddr].layoutHash[this.layoutHashKey].value) {
      layoutHash = <img className="preview" alt="layout hash file" src={`https://ipfs.infura.io/ipfs/${this.props.contracts[this.props.contractAddr].layoutHash[this.layoutHashKey].value}`} />;
    }

    if (!this.props.pendingHash) {
      if (this.props.fileHash) {
        updateLayout = <div>
          File uploaded to IPFS!<br />
          {this.props.fileHash}<input type="button" value="Update Layout File" onClick={this.updateLayoutHash.bind(this, this.props.fileHash)} />
          </div> ;
      } else {
        updateLayout = <div>Upload layout file to ipfs here:<Dropzone onDrop={this.onFileDrop.bind(this)}/></div>;
      }
    }

    return (

        <div className="pure-g">
          <div className="pure-u-1-1">
            <div>
              <div className="pure-u-1-3">
                <h4>Deposit</h4>
                <ContractData contract={this.props.contractAddr} method="depositAmount" /><br />
                <ContractForm contract={this.props.contractAddr} method="updateDepositAmount" />
              </div>
              <div className="pure-u-1-3 right">
                <h4>Daily Fee</h4>
                <ContractData contract={this.props.contractAddr} method="fee" /><br />
                <ContractForm contract={this.props.contractAddr} method="updateFee" />
              </div>
            </div>
            <div>
              <div className="pure-u-1-3">
                <h4>Layout Preview</h4>
                {layoutHash}
              </div>
              <div className="pure-u-1-3 right">
                <h5>Update Layout</h5>
                {updateLayout}
              </div>
            </div>
          </div>
        </div>

    )
  }
}


Meta.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    fileHash: state.space.fileHash,
    pendingHash: state.space.pendingFileHashGeneration,
    contracts: state.contracts
  }
}

const dispatchToProps = (dispatch) => {
    return {
        generateFileHash: file => dispatch({type: 'FILE_HASH_REQUESTED', payload: {file}}),
        getFields: hash => dispatch({type: 'GET_FIELDS_REQUESTED', payload: {hash}}),
        clearLayoutData: () => dispatch({ type: 'CLEAR_LAYOUT_DATA'})
    };
}

export default drizzleConnect(Meta, mapStateToProps, dispatchToProps);
