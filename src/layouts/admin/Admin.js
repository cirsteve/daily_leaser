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
      this.pausedKey = context.drizzle.contracts.Blockspace.methods.paused.cacheCall();

      this.createSpace = this.createSpace.bind(this);

      this.state = {
          showMeta: true
      };
  }

  createSpace (hash) {
      this.createSpaceKey = this.context.drizzle.contracts.Blockspace.methods.createSpace.cacheSend(hash);
      this.props.clearCreateHash();
  }

  togglePause (isPaused) {
    if (isPaused) {
      this.context.drizzle.contracts.Blockspace.methods.unpause.cacheSend();
    } else {
      this.context.drizzle.contracts.Blockspace.methods.pause.cacheSend();
    }
  }

  showMeta (showMeta) {
      this.setState({showMeta});
  }

  render() {
    let spaces, fieldsForm, paused;
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

    const createButtonClass = classname({
        'selected': !this.state.showMeta
    });

    const metaButtonClass = classname({
        'selected': this.state.showMeta
    })

    if (!(this.pausedKey in this.props.Blockspace.paused)) {
      paused = "Loading Paused";
    } else {
      paused = this.props.Blockspace.paused[this.pausedKey].value ?
        <input type="button" value="Unpause Contract" onClick={this.togglePause.bind(this, true)} /> :
        <input type="button" value="Pause Contract" onClick={this.togglePause.bind(this, false)} /> ;
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <Nav />
            <h4>Active Account</h4>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <div className="menu pure-u-1-3">
                <div>
                  {paused}
                </div>
                <div className="nav-menu">
                  <div className={metaButtonClass} onClick={this.showMeta.bind(this, true)}>
                      Edit Meta Data
                  </div>
                  <div className={createButtonClass} onClick={this.showMeta.bind(this, false)}>
                      Create Space
                  </div>
                </div>
                <div>
                    {spaces}
                </div>
            </div>
            <div className="content pure-u-3-5">
                <div className={createClass}>
                    {fieldsForm}
                    <p>Hash: {fieldsHash}</p>
                    {this.props.space.toCreate.hash ? <input type="button" value="Create Space" onClick={this.createSpace.bind(this, this.props.space.toCreate.hash)} /> : 'Generate Hash to Create Space'}
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
