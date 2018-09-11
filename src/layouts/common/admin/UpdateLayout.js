import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Loading from 'react-loading'
import Dropzone from 'react-dropzone'

import { getMultihash, getBytes32FromMultihash } from '../../../util/multiHash'

class Fields extends Component {
  constructor(props, context) {
    super(props);
    this.methods = context.drizzle.contracts[props.contractAddr].methods;

    this.layoutHashKey = this.methods.layoutHash.cacheCall();
  }

  componentDidUpdate (prevProps) {
    if (this.props.requestedHash) {
      this.updateLayoutHash(this.props.requestedHash);
      this.props.ipfsUploadAcked();
    }
  }

  onFileDrop (files) => {
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
    {digest, hashFunction, size} = getBytes32FromMultihash(hash);
    this.methods.updateLayoutHash.cacheSend(digest, hashFunction, size);
  }

  addFee (fee) {
    this.methods.addFee.cacheSend(fee);
  }

  updateDepositPct (pct) {
    this.methods.updateDepositPct.cacheSend(pct);
  }

  getRenderValues () {
    return {
      fileForm: this.props.pendingUpload ?
        <div>
          Uploading File to IPFS
          <Loading type='cubes' color="gray" height={'20%'} width={'20%'} />
        </div> : <Dropzone onDrop={this.onFileDrop} />,
      layoutHash: this.props.contract.getLayoutHash[this.layoutHashKey] ?
        <img className="preview"
          alt="layout hash file"
          src={`https://ipfs.infura.io/ipfs/${getMultihash(this.props.contract.getLayoutHash[this.layoutHashKey].value)}`} />
        : 'Loading Layout Hash'
    }
  }

  render() {

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
                <h4>Layout Preview</h4>
                {layoutHash}
              </div>
              <div className="pure-u-1-3 right">
                <h5>Update Layout</h5>
                {fileForm}
              </div>
        </div>

    )
  }
}


Fields.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    requestedHash: state.ipfs.requestedHash,
    pendingUpload: state.ipfs.pendingUpload
  }
}

const dispatchToProps = (dispatch) => {
    return {
      generateIPFSHash: upload => dispatch({type: 'IPFS_UPLOAD_REQUESTED', payload: {upload}}),
      getFields: hash => dispatch({type: 'GET_FIELDS_REQUESTED', payload: {hash}})
    };
}


export default drizzleConnect(Fields, mapStateToProps, dispatchToProps);
