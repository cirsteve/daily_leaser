import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/EditIcon';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class ButtonComponent extends Component {

  submit() {
    this.context.drizzle.contracts[this.props.contractAddr].methods
      .updateSpace.cacheSend(this.props.feeIdx, this.props.metaIdx);
  }

  render() {
    return (
      <Button variant="contained" size="small" className={classes.button} disabled={this.props.disabled}>
        <EditIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
        Submit
      </Button>
    );
  }
}

ButtonComponent.propTypes = {
  feeIdx: PropTypes.number.isRequired,
  metaIdx: PropTypes.number.isRequired,
  disabled: PropTypes.bool.is
}

ButtonComponent.contextTypes = {
  drizzle: PropTypes.object
}

export default withStyles(styles)drizzleConnect(ButtonComponent);
