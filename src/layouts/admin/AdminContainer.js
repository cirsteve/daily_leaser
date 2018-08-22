import Admin from './Admin'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Blockspace: state.contracts.Blockspace,
    contracts: state.contracts,
    spaceIds: Object.keys(state.contracts.Blockspace.getSpaces.valueOf()).length ? state.contracts.Blockspace.getSpaces.valueOf()["0x0"].value : [],
    space: state.space,
    drizzleInitialized: state.drizzleStatus.initialized
  }
}

const dispatchToProps = (dispatch) => {
    return {
        generateFieldsHash: fields => dispatch({type: 'FIELDS_HASH_REQUESTED', payload: {fields}}),
        getFields: hash => dispatch({type: 'GET_FIELDS_REQUESTED', payload: {hash}})
    };
}

const AdminContainer = drizzleConnect(Admin, mapStateToProps, dispatchToProps);

export default AdminContainer
