import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Dialog from '../../Dialog'

import { getBytes32FromMultihash } from '../../../../util/multiHash'

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
    this.methods = context.drizzle.contracts[this.props.contractAddr].methods;
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

  getInput = (type, label, value) => {
    switch(type) {
      case 'checkbox':
        return <Checkbox
          key={label}
          id={label}
          label={label}
          className={''}
          value={value || false}
          onChange={this.updateField.bind(this, label)}
          margin="normal" />;
      case 'number':
        return <TextField
          key={label}
          type="number"
          id={label}
          label={label}
          className={''}
          value={value || 0}
          onChange={this.updateField.bind(this, label)}
          margin="normal" />;
      case 'string':
      default:
        return <TextField
          key={label}
          id={label}
          label={label}
          className={''}
          value={value || ''}
          onChange={this.updateField.bind(this, label)}
          margin="normal" />;
    }
  }

  updateValue (field, e) {
    this.setState({field:e.target.value, ...this.state});
  }

  submitAddFieldsHash (hash) {
    const {digest, hashFunction, size} = getBytes32FromMultihash(hash);
    this.methods.addFieldsHash.cacheSend(digest, hashFunction, size);
  }

  submitUpdateFieldsHash (hash, idx) {
    const {digest, hashFunction, size} = getBytes32FromMultihash(hash);
    this.methods.updateFieldsHash.cacheSend(digest, hashFunction, size);
  }

  generateHash = () => {
    this.props.generateIPFSHash(JSON.stringify(this.state.fields));
  }

  getContent = ({values, fields}) => (
    <div>
        {fields.map((f, idx) => this.getInput(f.type, f.label, values[f.label]))}
    </div>
  )

  renderValues = () => ({
    values: this.props.hashedContent[this.props.values],
    fields: this.props.hashedContent[this.props.values]
  })

  render() {
    const {values, fields} = this.getRenderValues();
    const content = values && fields ? this.getContent({values, fields}) : "Loading...";
    return <Dialog content={content}
      open={this.props.open}
      handleClose={this.props.onClose}
      submit={this.submitFields}
      title="Update Info Type"
      submitText="Submit Options" />;
  }
}

Form.propTypes = {
  values: PropTypes.array,
  fields: PropTypes.string.isRequired,
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
        getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default withStyles(styles)(drizzleConnect(Form, mapStateToProps, dispatchToProps));
