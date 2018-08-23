import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Dropzone from 'react-dropzone'

class Meta extends Component {
  constructor(props, context) {
    super(props);
    this.layoutHashKey = context.drizzle.contracts.Blockspace.methods.layoutHash.cacheCall();
  }

  onFileDrop (files) {
      const generateFileHash = this.props.generateFileHash;
          files.forEach(file => {
              const reader = new FileReader();
              reader.onloadend = async() => {
                  const fileAsArrayBuffer= reader.result;
                  const buffer = await Buffer.from(reader.result)
                  generateFileHash(buffer);
              }
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');

              reader.readAsArrayBuffer(file);
          });
  }

  updateLayoutHash (hash) {
      this.updateLayoutHashKey = this.context.drizzle.contracts.Blockspace.methods.updateLayoutHash.cacheSend(hash);
  }

  render() {
    let layoutHash = '';
    if (this.layoutHashKey in this.props.Blockspace.layoutHash) {
      layoutHash = this.props.Blockspace.layoutHash[this.layoutHashKey].value;
    }

    if (layoutHash === '') {
      layoutHash = 'No Layout Set';
    }
    return (

        <div className="pure-g">


          <div className="pure-u-1-1">
              <div className="pure-u-1-3">
                <h4>Deposit</h4>
                <ContractData contract="Blockspace" method="depositAmount" /><br />
                <ContractForm contract="Blockspace" method="updateDepositAmount" />
              </div>
              <div className="pure-u-1-3 right">
                <h4>Daily Fee</h4>
                <ContractData contract="Blockspace" method="dailyFee" /><br />
                <ContractForm contract="Blockspace" method="updateDailyFee" />
              </div>
              <div>
                <h4>Layout File</h4>
                {layoutHash}
                <Dropzone onDrop={this.onFileDrop.bind(this)}/>
              </div>
              <input type="button" disabled={this.props.fileHash ? false : true } value="Update Layout File" onClick={this.updateLayoutHash.bind(this, this.props.fileHash)} />
              {this.props.fileHash}
              {this.props.pendingHash ? 'Generating File Hash' : ''}
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
    Blockspace: state.contracts.Blockspace
  }
}

const dispatchToProps = (dispatch) => {
    return {
        generateFileHash: file => dispatch({type: 'FILE_HASH_REQUESTED', payload: {file}}),
        getFields: hash => dispatch({type: 'GET_FIELDS_REQUESTED', payload: {hash}})
    };
}

export default drizzleConnect(Meta, mapStateToProps, dispatchToProps);
