/**
 * This helper will help to format a date for the ui components
 */

/**
 * Retrieve the value of sec, min and hrs of a timestamp
 * @param {number} ms
 */
export const convertMsToTime = ms => {
  let sec = Math.floor(ms / 1000)
  const hrs = Math.floor(sec / 3600)
  const min = Math.floor((sec - hrs * 3600) / 60)

  // Re-calculate secondes
  sec = sec - (min * 60 + hrs * 3600)
  return { sec: sec, min: min, hrs: hrs }
}

/**
 * calculate the time spent between now and a futur date
 * @param {string || Date} date
 */
export const getTimeSpent = date => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return Math.floor(new Date().getTime() - date.getTime())
}

/**
 * calculate the time left between now and a date
 * @param {string || Date} date
 * @param {number} delay
 */
export const getTimeLeft = date => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return -Math.floor(new Date().getTime() - date.getTime())
}

/**
 * Convert an object of time (sec, min, hrs) to an adaptable string
 * @param {{sec:number, min:number, hrs: number}} time
 */
export const toTimeString = time => {
  return time === null
    ? '-'
    : time.hrs === 0 && time.min === 0
    ? `${time.sec} secondes`
    : `${time.hrs} heures et ${time.min} minutes`
}
/**
 * Add time to a Date
 * @param {Date || string} date
 * @param {number} time
 */
export const addTimeToDate = (date, time) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new Date(date.getTime() + time)
}
