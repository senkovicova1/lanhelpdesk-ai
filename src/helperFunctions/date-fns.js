import * as fns from 'date-fns';

export const afterNowFNS = (unix) => {
    return unix > fns.getUnixTime(new Date()) * 1000;
};
