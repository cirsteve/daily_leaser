import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import classname from 'classnames'

import FieldsForm from './SpaceFields'
import MetaFields from './MetaFields'
import Space from '../common/Space'
import Nav from '../common/Nav'

class Admin extends Component {
  constructor (props, context) {
      console.log('con', props, context)
      super(props);
      this.getSpacesKey = context.drizzle.contracts.Blockspace.methods.getSpaces.cacheCall();

      this.createSpace = this.createSpace.bind(this);

      this.state = {
          showMeta: true
      };
  }

  createSpace (hash) {
      this.createSpaceKey = this.context.drizzle.contracts.Blockspace.methods.createSpace.cacheSend(hash);
  }

  showMeta (showMeta) {
      this.setState({showMeta});
  }

  render() {
    let spaces, fieldsForm;
    let pendingId = 0;
    if (!(this.getSpacesKey in this.props.Blockspace.getSpaces)) {
      spaces = "Loading Spaces";
      fieldsForm = "Loading Form Data";
    } else {
      let spaceIds = this.props.Blockspace.getSpaces[this.getSpacesKey].value;
      pendingId = 1*spaceIds[spaceIds.length -1] + 1;
      spaces = spaceIds.map(id => <Space key={id} id={id} />);
      fieldsForm = <FieldsForm pendingId={pendingId} generateFieldsHash={this.props.generateFieldsHash}/>
    }

    const fieldsHash = this.props.space.pendingHashGeneration ?
        'Generating Hash' : this.props.space.toCreate.hash;

    const createClass = classname({
        'create': true,
        'hidden': this.state.showMeta
    });

    const metaClass = classname({
        'meta': true,
        'hidden': !this.state.showMeta
    })

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <Nav />
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <div className="menu pure-u-1-3">
                <div onClick={this.showMeta.bind(this, true)}>
                    Edit Meta Data
                </div>
                <div onClick={this.showMeta.bind(this, false)}>
                    Create Space
                </div>
                <div>
                    {spaces}
                </div>
            </div>
            <div className="content pure-u-2-3">
                <div className={createClass}>
                    <p><strong>Create Space</strong>:</p>
                    {fieldsForm}
                    <p>Hash: {fieldsHash}</p>
                    <input type="button" value="Create Space" onClick={this.createSpace.bind(this, this.props.space.toCreate.hash)} />
                </div>
                <div className={metaClass}>
                    <MetaFields />
                </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

Admin.contextTypes = {
  drizzle: PropTypes.object
}

export default Admin
