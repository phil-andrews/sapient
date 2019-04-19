const cron = require('node-cron');

export const startCron = () => setInterval(() => { console.log('5 seconds' )}, 5000)
