import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { drizzleConnect } from 'drizzle-react'
import { withRouter } from 'react-router-dom'

class Spaces extends Component {
  constructor (props, context) {
      super(props);
      this.contractAddr = props.match.params.address;
      this.methods = context.drizzle.contracts[this.contractAddr].methods;
      this.getSpacesKey = this.methods.getSpaces.cacheCall(1,1*props.spaceLimit+1);
      this.depositKey = this.methods.depositAmount.cacheCall();
      this.feeKey = this.methods.fee.cacheCall();

  }

  formatSpaces (value) {
    return value[0].map((v,i)=>({id:v, address: value[1][i]}));
  }

  reserveSpace (id, value) {
    this.methods.reserveSpace.cacheSend(id, {value});
  }

  renderSpace (id, fee) {
    return (
      <div key={id}>
        <div>
          {id}
        </div>
        <input type="button" value="Book" onClick={this.reserveSpace.bind(this,id, fee)} />
      </div>
    )
  }

  render() {
    let spaces;
    let fee = 'Loading Fee';
    let deposit = 'Loading Deposit';
    if (this.depositKey in this.props.contracts[this.contractAddr].depositAmount) {
      deposit = this.props.contracts[this.contractAddr].depositAmount[this.depositKey].value;
    }

    if (this.feeKey in this.props.contracts[this.contractAddr].fee) {
      fee = this.props.contracts[this.contractAddr].fee[this.feeKey].value;
    }

    if (this.props.contracts[this.contractAddr].getSpaces[this.getSpacesKey]) {
      spaces = this.formatSpaces(this.props.contracts[this.contractAddr].getSpaces[this.getSpacesKey].value);
        spaces = spaces.map(s=>{
            let space = parseInt(s.address.replace(/^#/,''), 16) !== 0;
             return space ? <div key={s.id}>{s.id} - Booked</div> :
            this.renderSpace(s.id, fee);
        })
    }



    return (
      <div className="spaces">
        <div>
          Fee: {fee}
        </div>
        <div>
          Deposit: {deposit}
        </div>
        { spaces }
      </div>)
  }
}

Spaces.contextTypes = {
  drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  }
}

export default withRouter(drizzleConnect(Spaces, mapStateToProps));
