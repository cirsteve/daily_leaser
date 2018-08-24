import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const spaceFields = [
    {
        label: 'name',
        type: 'string'
    },
    {
        label: 'cars',
        type: 'number'
    },
    {
        label: 'people',
        type: 'number'
    },
    {
        label: 'dogs',
        type: 'number'
    }
];

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

class Fields extends Component {

  constructor(props) {
      super(props)
      this.renderInput = this.renderInput.bind(this);
      this.updateField = this.updateField.bind(this);
      this.state = {};
      this.state.fields = spaceFields.reduce((acc, f) => {
          acc[f.label] = '';
          return acc;
      }, {});
      this.state.fields.id = props.pendingId;
      this.state.serializedFields = JSON.stringify(this.state.fields)
  }

  updateField (label, e) {
      let update = {};
      update[label] = e.target.value;
      const fields = Object.assign({}, this.state.fields, update, {id: this.props.pendingId});
      this.setState(Object.assign({}, this.state, {fields, serializedFields: JSON.stringify(fields)}));
  }

  renderInput (inpt) {
      switch(inpt.type) {
        case 'string':
          return <TextField
            key={inpt.label}
            id={inpt.label}
            label={inpt.label}
            className={''}
            value={this.state[inpt.label]}
            onChange={this.updateField.bind(this, inpt.label)}
            margin="normal" />;
        case 'number':
          return <TextField
            key={inpt.label}
            type="number"
            id={inpt.label}
            label={inpt.label}
            className={''}
            value={this.state[inpt.label]}
            onChange={this.updateField.bind(this, inpt.label)}
            margin="normal" />;
      }
  }

  render() {
    return (

        <div className="pure-g">


          <div className="pure-u-1-1">

            {spaceFields.map(this.renderInput)}


            <input type="button" value="Generate Hash" onClick={this.props.generateFieldsHash.bind(this, this.state.serializedFields)} />
          </div>


        </div>

    )
  }
}

export default withStyles(styles)(Fields);
