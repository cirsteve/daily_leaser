import React, { Component } from 'react'

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
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

const Menu ({classes, changeView}) => (
  <Paper>
      <MenuList>
        <MenuItem onClick={changeView.bind(this, 'admin')} className={classes.menuItem}>
          <ListItemIcon className={classes.icon}>
            <SendIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Admin Data" />
        </MenuItem>
        <MenuItem onClick={changeView.bind(this, 'info')} className={classes.menuItem}>
          <ListItemIcon className={classes.icon}>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Info Fields" />
        </MenuItem>
        <MenuItem onClick={changeView.bind(this, 'spaces')} className={classes.menuItem}>
          <ListItemIcon className={classes.icon}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Spaces" />
        </MenuItem>
      </MenuList>
    </Paper>
  );

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
  changeView: PropTypes.func.isRequired
};

export default withStyles(styles)(Menu);
