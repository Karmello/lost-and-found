module.exports = {
  printFormattedLog: (log) => {

    if (process.env.NODE_ENV != 'testing') {

      let sign = '-';
      let line = sign;

      for (let i = 0; i < log.length; i++) { line += sign; }
      line += sign;

      console.log(line);
      console.log(' ' + log);
      console.log(line);
    }
  }
};