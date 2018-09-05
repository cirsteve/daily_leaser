export const MS_PER_DAY = 24 * 60 * 60 * 1000;

const treatAsUTC = function(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

export function daysFromEpoch(epoch, date) {
    return Math.ceil((treatAsUTC(date) - treatAsUTC(epoch)) / MS_PER_DAY);
}

export const dateFromEpoch = function(epoch, daysLater) {
    return new Date(new Date(epoch).getTime() + daysLater * MS_PER_DAY);
}

export const generateEpoch = () => new Date().getTime() - MS_PER_DAY;
