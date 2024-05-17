import React from 'react';
import moment from 'moment';

export const getTimeDifferenceString = (timestamp) => {
  const now = moment();
  const donationMoment = moment(timestamp);
  const diff = now.diff(donationMoment);

  if (diff < moment.duration(1, 'minute').asMilliseconds()) {
    return 'Just now';
  } else if (diff < moment.duration(1, 'hour').asMilliseconds()) {
    const minutes = moment.duration(diff).minutes();
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diff < moment.duration(1, 'day').asMilliseconds()) {
    const hours = moment.duration(diff).hours();
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = moment.duration(diff).days();
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
};
