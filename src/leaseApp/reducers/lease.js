import { MS_PER_DAY } from '../util/time'

const initialState = {
    reservationDates: {
        start: null,
        end: null
    },
    days: 0
};

export default (state = initialState, action) => {
    let reservationDates = {};

    switch (action.type) {
        case 'UPDATE_RESERVATION_DATES':
            reservationDates = action.payload;
            const days = (reservationDates.endDate - reservationDates.startDate) / MS_PER_DAY + 1;
            return Object.assign({}, state, {reservationDates, days})
        default:
            return state;
    }
}
