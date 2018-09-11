import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default class Select extends Component {

  render() {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">this.props.label</InputLabel>
        <Select
          value={this.props.value}
          onChange={this.props.handleChange}
          inputProps={{
            name: this.props.field
          }}
        >
          {this.props.options.map(o => <MenuItem value={o.value}>{o.label}</MenuItem>)}
        </Select>
      </FormControl>
    );
  }
}
