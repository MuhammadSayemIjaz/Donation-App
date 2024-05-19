import React from 'react';
import moment from 'moment';

export  const getTimeDifferenceString = async (timestamp) => {
  const now = moment();
  const donationMoment =  moment(timestamp);
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

export function generateAutoNumber(length = 20) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  // Generate a random string of the specified length
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  // Optionally enforce specific format
  const format = "vvvvCCffuuuuuuMddddddgggAAAUUUUkkVvyy"; // Adjust the format pattern as needed

  // Insert random characters at specific positions based on the format
  for (let i = 0; i < format.length; i++) {
    if (format[i] !== result[i]) {
      result = result.slice(0, i) + characters[Math.floor(Math.random() * characters.length)] + result.slice(i + 1);
    }
  }

  return result;
}

export function getFormatedDate(inputDate) {
  const timestampObject = inputDate;

  // Combine seconds and nanoseconds into milliseconds
  const milliseconds = timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1000000;

  // Create a Date object from the milliseconds
  const date = new Date(milliseconds);

  // Extract date and time components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-indexed (January is 0)
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const millisecondsFormatted = date.getMilliseconds().toString().padStart(3, '0'); // Pad with leading zeros

  const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  return formattedDate;
}
export function getFormatedTime(inputDate) {
  const timestampObject = inputDate;

  // Combine seconds and nanoseconds into milliseconds
  const milliseconds = timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1000000;

  // Create a Date object from the milliseconds
  const date = new Date(milliseconds);

  // Extract date and time components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-indexed (January is 0)
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const millisecondsFormatted = date.getMilliseconds().toString().padStart(3, '0'); // Pad with leading zeros

  const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  return formattedTime;
}
export function getFormatedDateTime(inputDate) {
  const timestampObject = inputDate;

  // Combine seconds and nanoseconds into milliseconds
  const milliseconds = timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1000000;

  // Create a Date object from the milliseconds
  const date = new Date(milliseconds);

  // Extract date and time components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-indexed (January is 0)
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const millisecondsFormatted = date.getMilliseconds().toString().padStart(3, '0'); // Pad with leading zeros

  const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  return formattedDateTime;
}
