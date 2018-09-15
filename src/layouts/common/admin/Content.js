import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types';
import classname from 'classnames'
import Paper from '@material-ui/core/Paper';

import Admin from './admin/Admin'
import InfoTypes from './info/InfoTypes'
import Spaces from './spaces/Spaces'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

class Content extends Component {
  constructor(props, context) {
    super(props);
    this.methods = context.drizzle.contracts[props.contractAddr].methods;

    this.keys = {
      feesKey: this.methods.getFees.cacheCall(),
      depositKey:this.methods.depositPct.cacheCall(),
      pausedKey: this.methods.paused.cacheCall(),
      fieldsHashKey: this.methods.getFieldsHash.cacheCall(),
      metaHashesKey: this.methods.getMetaHashes.cacheCall(),
      getSpacesKey: this.methods.getSpaces.cacheCall(),
      layoutHashKey: this.methods.layoutHash.cacheCall()
    };

    this.state = {
      pending: {
        deposit: null,
        fee: null
      }
    }
  }

  render () {
  const {view, contract, contractAddr} = this.props;
  const adminClass = classname({
    hidden: view !== 'admin'
  });

  const infoClass = classname({
    hidden: view !== 'info'
  });

  const spacesClass = classname({
    hidden: view !== 'spaces'
  });

  return (
    <Paper>
      <div className={adminClass}>
        <Admin contract={contract} contractAddr={contractAddr} {...this.keys} />
      </div>
      <div className={infoClass} >
        <InfoTypes contract={contract} contractAddr={contractAddr} {...this.keys} />
      </div>
      <div className={spacesClass}>
        <Spaces contract={contract} contractAddr={contractAddr} {...this.keys} />
      </div>
    </Paper>)
  };
}

Content.contextTypes = {
  drizzle: PropTypes.object
}

export default withStyles(styles)(drizzleConnect(Content));
