module.exports = {
  saveQuery: async function (connection, data, nameTable) {
    let queryString = ``;
    queryString += `INSERT INTO ${nameTable}(`;
    let keysData = Object.keys(data);
    let valuesData = Object.values(data);
    keysData.forEach((item, i, vec) => {
      if(i !== vec.length - 1) {
        queryString += `${item},`;
      } else {
        queryString += item;
      }
    });
    queryString += ') VALUES (';
    keysData.forEach((item, i, vec) => {
      if(i !== vec.length - 1) {
        queryString += `?,`;
      } else {
        queryString += '?';
      }
    });
    queryString += ')';
    const [rows] = await connection.query(queryString, valuesData);
    return rows;
  }
}