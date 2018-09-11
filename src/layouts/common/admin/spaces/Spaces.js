import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from './MetaTypesGrid'
import Form from './MetaTypesForm'
import Dialog from '../../Dialog'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

class Spaces extends Component {
  constructor (props) {
    this.state = {showForm: false, id:0};
  }

  closeForm = () => {
    this.setState({showForm: false});
  }

  showForm = (id) => {
    this.setState({showForm: true, id});
  }

  getRenderValues () {
    return {
      metaHashes: this.props.contract.getMetaHashes[this.props.fieldsHashKey] ?
        this.props.contract.getMetaHashes[this.props.fieldsHashKey].value :
        null,
      fieldsHash: this.props.contract.getFieldsHash[this.props.fieldsHashKey] ?
        this.props.contract.getFieldsHash[this.props.fieldsHashKey].value :
        null,
      spaces: this.props.contract.getSpaces[this.props.getSpacesKey] ?
        this.props.contract.getSpaces[this.props.getSpacesKey].value :
        null,
      form: null
    }
  }

  render () {
    {metaHashes, fees, spaces, form} = this.getRenderValues();


    if (fees && metahashes && spaces) {
      form = <Form
        value={spaces[this.state.id]}
        metaHashes={metaHashes}
        fees={fees}
        contractAddr={this.contractAddr}
        id={this.state.id}
        isAdd={this.state.id === metahashes.length} />
    }
    return (
      <div>
        {metaHashes && fees && spaces ?
          <Grid metaHashes={metaHashes} fees={fees} spaces={spaces} showForm={this.showForm}/> : 'Loading Spaces'}
        {form ?
          <Dialog
            content={form}
            open={this.state.showForm}
            onClose={this.closeForm} />:
          'Loading Info Types' }
      </div>
    );
  }
};

Spaces.propTypes = {
  classes: PropTypes.object.isRequired,
  metaTypes: PropTypes.array.isRequired,
  contract: PropTypes.object.isRequired,
  fieldsHashKey: PropTypes.string.isRequired,
  metaHashesKey: PropTypes.string.isRequired,
  getSpacesKey: PropTypes.string.isRequired,
  contractAddr: PropTypes.string.isRequired

};

export default withStyles(styles)(Spaces);
