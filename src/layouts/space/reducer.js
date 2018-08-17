import { MS_PER_DAY } from '../../util/time'

const initialState = {hashedContent:{}, toCreate:{hash: null, fields:null}, reservationDates: {start: null, end: null}, days: 0};

const spaceReducer = (state = initialState, action) => {
    let toCreate;
    let hashedContent = {};
    let reservationDates = {};

    switch (action.type) {
        case 'UPDATE_RESERVATION_DATES':
            reservationDates = action.payload;
            const days = (reservationDates.endDate - reservationDates.startDate) / MS_PER_DAY + 1;
            return Object.assign({}, state, {reservationDates, days})
        case 'CLEAR_TO_CREATE':
            return Object.assign({}, state, {reservationDates})
        case 'FIELDS_HASH_SUCCEEDED':
            toCreate = {hash: action.payload.hash, fields:action.payload.fields};
            hashedContent[action.payload.hash] = action.payload.fields;
            hashedContent = Object.assign({}, state.hashedContent, hashedContent);
            return Object.assign({}, state, {toCreate}, {hashedContent});
        case 'GET_FIELDS_SUCCEEDED':
            hashedContent[action.payload.hash] = action.payload.fields;
            hashedContent = Object.assign({}, state.hashedContent, hashedContent);
            return Object.assign({}, state, {hashedContent});
        default:
            return state;
    }
}

export default spaceReducer;
