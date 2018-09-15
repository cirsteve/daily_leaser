import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

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
      .updateSpace.cacheSend(this.props.id, this.props.feeIdx, this.props.metaIdx);
  }

  render() {
    const {classes} = this.props;
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
  id: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired
}

ButtonComponent.contextTypes = {
  drizzle: PropTypes.object
}

export default withStyles(styles)(drizzleConnect(ButtonComponent));
