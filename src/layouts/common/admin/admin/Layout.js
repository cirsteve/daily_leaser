import React, { Component } from 'react'

import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'

import Loading from '../../Loading'

import { getMultihash, getBytes32FromMultihash } from '../../../../util/multiHash'

class Layout extends Component {
  constructor(props, context) {
    super(props);
    this.methods = context.drizzle.contracts[props.contractAddr].methods;
    this.layoutHashKey = this.methods.layoutHash.cacheCall();

    this.state = {uploadedHash: null};
  }

  componentDidUpdate (prevProps) {
    if (this.props.requestedHash) {
      console.log('uploadedHash', this.props.requestedHash)
      this.setState({uploadedHash:this.props.requestedHash})
      this.props.ipfsUploadAcked();


    }
  }

  onFileDrop = (files) => {
    console.log('file dropped', files)
      const generateFileHash = this.props.generateIPFSHash;
          files.forEach(file => {
              const reader = new FileReader();
              reader.onloadend = async() => {
                  const buffer = await Buffer.from(reader.result)
                  console.log('reader loaded')
                  generateFileHash(buffer);
              }
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');

              reader.readAsArrayBuffer(file);
          });
  }

  submitLayoutHash = () => {
    let {digest, hashFunction, size} = getBytes32FromMultihash(this.state.uploadedHash);
    let updateKey = this.methods.updateLayoutHash.cacheSend(digest, hashFunction, size);
    this.setState({uploadedHash: null})
  }

  cancelUpload = () => this.setState({uploadedHash: null})

  getContract = () => this.props.contracts[this.props.contractAddr]

  render() {
    let fileForm = <div>Upload layout file to ipfs here:<Dropzone onDrop={this.onFileDrop.bind(this)}/></div>;
    if (this.props.pendingUpload) {
      fileForm = <Loading type="ipfs" text="Uploading to IPFS" show={true}/>
    } else if (this.state.uploadedHash) {
      fileForm = <div>
      <img alt="layout file preview"
        src={`https://ipfs.infura.io/ipfs/${this.state.uploadedHash}`} />
        <input type="button" onClick={this.submitLayoutHash} value="Submit Upload" />
        <input type="button" onClick={this.cancelUpload} value="Cancel Upload" />
        </div>
    }

    let layoutHash = 'Loading layout image';
    if (this.getContract().layoutHash[this.layoutHashKey]) {
      layoutHash = <img alt="layout file hash"
        src={`https://ipfs.infura.io/ipfs/${getMultihash(this.getContract().layoutHash[this.layoutHashKey].value)}`} />
    }
    return (
      <div>
      {this.props.ipfsError}
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


Layout.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    requestedHash: state.ipfs.requestedHash,
    pendingUpload: state.ipfs.pendingUpload,
    ipfsError: state.ipfs.error,
    contracts: state.contracts
  }
}

const dispatchToProps = (dispatch) => {
    return {
      generateIPFSHash: upload => dispatch({type: 'IPFS_UPLOAD_REQUESTED', payload: {upload}}),
      ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'}),
    };
}


export default drizzleConnect(Layout, mapStateToProps, dispatchToProps);
