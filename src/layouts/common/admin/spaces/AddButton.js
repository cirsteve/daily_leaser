import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';


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
      .addSpace.cacheSend(this.props.feeIdx, this.props.metaIdx);
  }


  render() {
    const {classes} = this.props;

    return (

      <Button variant="contained" size="small" className={classes.button} >
        <AddIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
        Submit
      </Button>

    )
  }
}

ButtonComponent.propTypes = {
  feeIdx: PropTypes.number.isRequired,
  metaIdx: PropTypes.number.isRequired,
  contractAddr: PropTypes.string.isRequired
}

ButtonComponent.contextTypes = {
  drizzle: PropTypes.object
}

export default withStyles(styles)(drizzleConnect(ButtonComponent));
