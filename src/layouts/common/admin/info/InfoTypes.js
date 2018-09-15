import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '../../Grid'
import Tile from './GridTile'
import InfoFieldsForm from './InfoFieldsForm'
import InfoTypeForm from './InfoTypeForm'

import {formatMultiHashesResponse} from '../../../../util/responseHandlers'
import {getMultihash} from '../../../../util/multiHash'

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

class InfoTypes extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts[props.contractAddr].methods;


    this.state = {showForm: false, id:0};
  }

  closeForm = () => {
    this.setState({showForm: false, ...this.state});
  }

  openForm = (showForm, id=0) => {
    this.setState({showForm, id,...this.state});
  }

  getRenderValues = () => {
    const contract = this.getContract();
    return {
      fieldsHash: contract.getFieldsHash[this.props.fieldsHashKey] ?
        getMultihash(contract.getFieldsHash[this.props.fieldsHashKey].value) :
        null,
      infoHashes: contract.getMetaHashes[this.props.metaHashesKey] ?
        formatMultiHashesResponse(contract.getMetaHashes[this.props.metaHashesKey].value)
        .map((h,idx) => <Tile key={idx} id={idx} hash={h} showForm={this.openForm.bind(this, idx)} />) :
        null
    }
  }


  getContract = () => this.props.contracts[this.props.contractAddr]

  render () {
    let {fieldsHash, infoHashes} = this.getRenderValues();
    console.log('rendering ', fieldsHash, infoHashes)
    return (
      <div>
        <input type="button" onClick={this.openForm.bind(this, 'fields')} value="Add Fields" />
        <input type="button" onClick={this.openForm.bind(this, 'type')} value="Add Info Type" />
        { infoHashes ? <Grid items={infoHashes} title="Info Types" openForm={this.openForm.bind(this, 'type')}/> : 'Loading Info Options'}
        { infoHashes && fieldsHash ?
          <InfoTypeForm
            fields={fieldsHash}
            values={infoHashes[this.state.id]}
            contractAddr={this.props.contractAddr}
            id={this.state.id}
            newType={this.state.id === infoHashes.length}
            open={this.state.showForm === 'type'}
            onClose={this.closeForm} />
            : ''}
        {fieldsHash ?
          <InfoFieldsForm
            fieldsHash={fieldsHash}
            contractAddr={this.props.contractAddr}
            open={this.state.showForm === 'fields'}
            onClose={this.closeForm} />
            : ''}
      </div>
    );
  }
}

InfoTypes.propTypes = {
  classes: PropTypes.object.isRequired,
  contracts: PropTypes.object.isRequired,
  contractAddr: PropTypes.string.isRequired,
  fieldsHashKey: PropTypes.string.isRequired,
  metaHashesKey: PropTypes.string.isRequired
};

InfoTypes.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    requestedHash: state.ipfs.requestedHash,
    pendingHash: state.ipfs.pendingUpload,
    hashedContent: state.ipfs.hashedContent,
    contracts: state.contracts
  }
}

const dispatchToProps = (dispatch) => {
    return {
      getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),

    };
}

export default withStyles(styles)(drizzleConnect(InfoTypes, mapStateToProps, dispatchToProps));
