import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData } from 'drizzle-react-components'

import Space from '../common/Space'
import Nav from '../common/Nav'

class Home extends Component {
  constructor (props, context) {
      super(props);
      this.contracts = context.drizzle.contracts;
      this.getSpacesKey = this.contracts.Blockspace.methods.getSpaces.cacheCall();
      this.getLayoutHashKey = this.contracts.Blockspace.methods.getLayoutHash.cacheCall();
  }

  render() {
    let spaces, layoutHash;
    if (!(this.getSpacesKey in this.props.Blockspace.getSpaces)) {
      spaces = "Loading Spaces";
    } else {
      let spaceIds = this.props.Blockspace.getSpaces[this.getSpacesKey].value;
      spaces = spaceIds.map(id => <Space key={id} id={id} />);
    }

    if (!(this.getLayoutHashKey in this.props.Blockspace.getLayoutHash)) {
      layoutHash = "Loading Layout Hash";
    } else {
      layoutHash = <img src={`https://ipfs.infura.io/ipfs/${this.props.Blockspace.getLayoutHash[this.getLayoutHashKey].value}`} />;
    }

    return (

      <main className="container">
        <div className="pure-g">

          <div className="pure-u-1-1">
            <Nav />
            <h2><a href="/user">Account Details</a></h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>
          {layoutHash}

          <div className="pure-u-1-1">

            {spaces}


            <br/><br/>
          </div>


        </div>
      </main>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home
