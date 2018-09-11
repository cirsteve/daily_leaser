import React, { Component } from 'react'

import classname from 'classnames'
import Paper from '@material-ui/core/Paper';

import AdminFields from './AdminFields.js'
import InfoTypes from './meta/InfoTypes'
import Spaces from './Spaces.js'

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

const Content ({view}) => {
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
        <AdminFields />
      </div>
      <div className={infoClass} >
        <InfoTypes />
      </div>
      <div className={spacesClass}>
        <Spaces />
      </div>
    </Paper>)
  };

export default withStyles(styles)(Content);
