import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import Dialog from '../../Dialog'

import {getBytes32FromMultihash } from '../../../../util/multiHash'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

const FIELD_TYPES = [
  'text',
  'number',
  'checkbox'
]

const DEFAULT_FIELD = {
  label: 'New Field',
  type: 'text'
}

const EditField = ({label, type, onTypeChange, onLabelChange, onCancel, classes}) => (
  <div key={label} className="editField">
    <TextField
      id={label}
      label="Field"
      className={''}
      value={label}
      onChange={onLabelChange}
      margin="normal" />
    <Select
      value={type}
      onChange={onTypeChange}>
      {FIELD_TYPES.map(ft => <MenuItem value={ft}>{ft}</MenuItem>)}
    </Select>
    <IconButton className={classes.button} aria-label="Delete" onClick={onCancel}>
        <DeleteIcon />
    </IconButton>
  </div>
)

class Form extends Component {
  constructor(props, context) {
      super(props)
      this.state = {
        newFields: []
      }
  }

  componentDidMount () {
    if (!this.props.hashedContent[this.props.fieldsHash]) {
      this.props.getIPFSUpload(this.props.fieldsHash)
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.requestedHash) {
      this.submitFieldsHash(this.props.requestedHash);
      this.props.ipfsUploadAcked();
    }
  }

  submitFieldsHash (hash) {
    const {digest, hashFunction, size} = getBytes32FromMultihash(hash);
    this.context.drizzle.contracts[this.props.contractAddr].methods.updateFieldsHash.cacheSend(digest, hashFunction, size);
    this.props.close();
    this.stateState({newFields:[]});

  }

  updateFieldLabel = (idx, e) => {
    let newFields = [...this.state.newFields];
    newFields[idx] = {[e.target.name]: e.target.value};
    this.setState({newFields});
  }

  updateFieldType = (idx, e) => {
    let newFields = [...this.state.newFields];
    newFields.push({[e.target.name]: e.target.value});
    this.setState({newFields});
  }

  addField = () => {
    let newFields = [...this.state.newFields];
    newFields.push({...DEFAULT_FIELD});
    this.setState({newFields,...this.state});
  }

  deleteField = (idx) => {
    let newFields = [...this.state.newFields];
    newFields.splice(idx, 1);
    this.setState({newFields});
  }

  submitFields = () => {
    const fields = this.props.hashedContent[this.props.fieldsHash].value;
    const newFields = fields.map((f, idx) => fields[idx] || f);
    this.props.generateIPFSHash(JSON.stringify(newFields));
  }

  getContent() {
    const {classes} = this.props;

    return (
      <div>
        {this.state.newFields.map((f, idx)=><EditField key={f.label} {...f} onCancel={this.deleteField.bind(this, idx)} classes={classes} />)}
        <Button variant="contained" color="secondary" className={classes.button} onClick={this.addField}>
          <AddIcon className={classes.leftIcon} />
          Add Field
        </Button>
      </div>
    );
  }

  render () {
    return <Dialog content={this.getContent()}
      open={this.props.open}
      handleClose={this.props.onClose}
      submit={this.submitFields}
      title="Update Info Options"
      submitText="Submit Options" />;
  }
}

Form.propTypes = {
  fieldsHash: PropTypes.string.isRequired,
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
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'}),
        getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),

    };
}

export default withStyles(styles)(drizzleConnect(Form, mapStateToProps, dispatchToProps));
