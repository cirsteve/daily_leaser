import Admin from './Admin'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    Blockspace: state.contracts.Blockspace,
    space: state.space,
  }
}

const dispatchToProps = (dispatch) => {
    return {
        generateFieldsHash: fields => dispatch({type: 'FIELDS_HASH_REQUESTED', payload: {fields}}),
        getFields: hash => dispatch({type: 'GET_FIELDS_REQUESTED', payload: {hash}}),
        clearCreateHash: () => dispatch({type: 'CLEAR_CREATE_HASH'})
    };
}

export default drizzleConnect(Admin, mapStateToProps, dispatchToProps);
