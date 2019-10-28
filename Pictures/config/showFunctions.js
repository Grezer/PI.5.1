const moment = require('moment');
const pool_db = require('./config_db');


const getSome = async ({
  nickName
}) => {
  try {
    const [
      [result]
    ] = await pool_db.query(
      `
        Select *
        From people
        Where nickName = ?
        `,
      [nickName],
    );
    return result;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getSome
};