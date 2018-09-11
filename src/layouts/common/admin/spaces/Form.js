import React, { Component } from 'react'
import {  ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Select from '../../Select'
import AddButton from './AddButton'
import UpdateButton from './UpdateButton'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Form extends Component {
  constructor(props, context) {
      super(props)
      this.state.feeIdx = props.feeIdx;
  }

  updateValue (field, e) {
    this.setState({[e.target.name]:e.target.value, ...this.state});
  }

  render() {

    return (
      <form className={classes.root} autoComplete="off">
        <Select />
        <Select />
        {this.props.isAdd ? <AddButton /> : <UpdateButton />}
      </form>

    )
  }
}

Form.propTypes = {
  metaHashes: PropTypes.array,
  fees: PropTypes.array.isRequired,
  isAdd: PropTypes.bool.isRequired
}


export default withStyles(styles)drizzleConnect(Form, mapStateToProps, dispatchToProps);
