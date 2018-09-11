import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteIcon from '@material-ui/icons/AddIcon';


import { getMultihashFromContractResponse, getBytes32FromMultihash } from '../../../util/multiHash'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class Form extends Component {
  constructor(props, context) {
      super(props)
      this.methods = this.context.drizzle.contracts[this.props.contractAddr].methods;
      this.state = {
        fields: props.fields.reduce((acc, f)=>{
          acc[f.field] = null;
          return acc;
        }, {})
      }
  }

  componentDidUpdate (prevProps) {
    if (this.props.requestedHash) {
      if (this.props.newType) {
        this.submitAddFieldsHash(this.props.requestedHash);
      } else {
        this.submitUpdateFieldsHash(this.props.requestedHash, this.props.id);
      }
      this.props.ipfsUploadAcked();
    }
  }

  renderInput (type, field, value) {
    switch(type) {
      case 'checkbox':
        return <Checkbox
          key={field}
          type="number"
          id={field}
          label={field}
          className={''}
          value={value]}
          onChange={this.updateField.bind(this, field)}
          margin="normal" />;
      case 'number':
        return <TextField
          key={field}
          type="number"
          id={field}
          label={field}
          className={''}
          value={value]}
          onChange={this.updateField.bind(this, field)}
          margin="normal" />;
      case 'string':
      default:
        return <TextField
          key={field}
          type="number"
          id={field}
          label={field}
          className={''}
          value={value]}
          onChange={this.updateField.bind(this, field)}
          margin="normal" />;
    }
  }

  updateValue (field, e) {
    this.setState({field:e.target.value, ...this.state});
  }

  submitAddFieldsHash (hash) {
    {digest, hashFunction, size} = getBytes32FromMultihash(hash);
    this.methods.addFieldsHash.cacheSend(digest, hashFunction, size);
  }

  submitUpdateFieldsHash (hash, idx)
    {digest, hashFunction, size} = getBytes32FromMultihash(hash);
    this.methods.updateFieldsHash.cacheSend(digest, hashFunction, size);
  }

  generateHash () => {
    this.props.generateIPFSHash(JSON.stringify(this.state.fields));
  }

  render() {

    return (

        <div>
          <div className="pure-u-1-1">

            {fieldsList}

          </div>
        </div>

    )
  }
}

Form.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape(
    {
      label: PropTypes.string,
      type: PropTypes.string
    }
  )),
  metaHashes: PropTypes.array,
  contractAddr: PropTypes.string
}

Form.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    requestedHash: state.ipfs.requestedHash,
    pendingHash: state.ipfs.pendingUpload,
    hashedContent: state.ipfs.hashedContent
  }
}

const dispatchToProps = (dispatch) => {
    return {
        generateIPFSHash: upload => dispatch({type: 'IPFS_UPLOAD_REQUESTED', payload: {upload}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default withStyles(styles)drizzleConnect(Form, mapStateToProps, dispatchToProps);
