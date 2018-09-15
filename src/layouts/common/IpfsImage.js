import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone'

import Loading from '../../Loading'

import { getMultihash, getBytes32FromMultihash } from '../../../util/multiHash'

class Img extends Component {

  componentDidMount () {
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
    let updateKey = this.methods.updateLayoutHash.cacheSend(digest, hashFunction, size);
    console.log('upde key ', updateKey)
  }

  render() {
    let fileForm = <div>Upload layout file to ipfs here:<Dropzone onDrop={this.onFileDrop.bind(this)}/></div>;
    if (this.props.pendingUpload) {
      fileForm = <Loading type="ipfs" text="Uploading to IPFS" />
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


Layout.contextTypes = {
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
      generateIPFSHash: upload => dispatch({type: 'IPFS_UPLOAD_REQUESTED', payload: {upload}})
    };
}


export default drizzleConnect(Layout, mapStateToProps, dispatchToProps);
