import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import TextField from '@material-ui/core/TextField';
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

const FIELD_TYPES = [
  'text',
  'number',
  'checkbox'
]

const DEFAULT_FIELD = {
  label: 'New Field',
  type: 'text'
}

const DisplayField ({label, type}) => (
  <div key={label} className="displayField">
    <div>
      Field: {label}
    </div>
    <div>
      Type: {type}
    </div>
  </div>
)

const EditField ({label, type, onTypeChange, onLabelChange, onCancel}) => (
  <div key={label} className="editField">
    <TextField
      id={label}
      label="Field"
      className={''}
      value={label}
      onChange={onLabelChange)}
      margin="normal" />
    <Select
      value={type}
      onChange={onTypeChange} />
      {FIELD_TYPES.map(ft => <MenuItem value={ft}>{ft}</MenuItem>)}
    </Select>
    <IconButton className={classes.button} aria-label="Delete" onClick={onCancel}>
        <DeleteIcon />
      </IconButton>
  </div>
)

class Fields extends Component {
  constructor(props) {
      super(props)
      this.state = {
        newFields: [...props.fields],
        isEditing: false
      }
  }

  componentDidUpdate (prevProps) {
    if (this.props.requestedHash) {
      this.submitFieldsHash(this.props.requestedHash);
      this.props.ipfsUploadAcked();
    }
  }

  toggleEditing () {
    const isEditing = !this.state.isEditing;
    this.setState({isEditing, ...this.state});
  }

  submitFieldsHash (hash) {
    {digest, hashFunction, size} = getBytes32FromMultihash(hash);
    this.context.drizzle.contracts[this.props.contractAddr].methods.updateFieldsHash.cacheSend(digest, hashFunction, size);
  }

  updateFieldLabel (idx, e) => {
    let newFields = [...this.state.newFields];
    newFields.label = e.target.value;
    this.setState({newFields,...this.state});
  }

  updateFieldType (idx, e) => {
    let newFields = [...this.state.newFields];
    newFields.type = e.target.value;
    this.setState({newFields,...this.state});
  }

  addField () => {
    let newFields = [...this.state.newFields];
    newFields.push({...DEFAULT_FIELD});
    this.setState({newFields,...this.state});
  }

  deleteField (idx) => {
    let newFields = [...this.state.newFields];
    newFields.splice(idx, 1);
    this.setState({newFields,...this.state});
  }

  submitFields () => {
    this.props.generateIPFSHash(JSON.stringify(this.state.newFields));
  }

  getEditable () => (
    <div>
      <Button variant="contained" color="secondary" className={classes.button} onClick={this.addField}>
        <AddIcon className={classes.leftIcon} />
        Add Field
      </Button>
      {this.state.newFields.map((f, idx)=><EditField key={f.label} {...f} onCancel={this.deleteField.bind(this, idx)} />)}
      <Button variant="contained" className={classes.button} onClick={this.submitFields}>
        Submit Updated Fields
      </Button>
    <div>
  )


  render() {
    let fieldsList;
    if (this.state.isEditing) {
      fieldList = this.getEditable()
    } else {
      fieldList = this.props.fields.map(f=><DisplayField {...f} />)
    }

    return (

        <div className="pure-g">
          <div className="pure-u-1-1">
            <Button variant="contained" className={classes.button} onClick={this.toggleEditing}>
              {this.state.isEditing ? Cancel Edit : Edit Fields}
            </Button>
            {fieldsList}

          </div>
        </div>

    )
  }
}

Fields.propTypes {
  fields: PropTypes.arrayOf(PropTypes.shape(
    {
      label: PropTypes.string,
      type: PropTypes.string
    }
  )),
  contractAddr: PropTypes.string
}

Fields.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    requestedHash: state.ipfs.requestedHash,
    pendingHash: state.ipfs.pendingUpload
  }
}

const dispatchToProps = (dispatch) => {
    return {
        generateIPFSHash: upload => dispatch({type: 'IPFS_UPLOAD_REQUESTED', payload: {upload}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default withStyles(styles)drizzleConnect(Fields, mapStateToProps, dispatchToProps);
