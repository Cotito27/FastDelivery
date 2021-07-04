const {connect} = require('../database');
const { saveQuery } = require('../helpers/query');

function getCtrlSub (titleProyect, nameTable)  {
  const ctrl = {};
  ctrl.register = async (req, res) => {
    let user = req.user;
    res.render('index', {
      title: titleProyect,
      section: `${nameTable}/registro`,
      data: false,
      edit: false,
      user
    });
  }

  ctrl.report = async (req, res) => {
    let user = req.user;
    const connection = await connect();
    const [rows] = await connection.query(`SELECT * FROM ${nameTable}`);
    res.render('index', {
      title: titleProyect,
      section: `${nameTable}/reporte`,
      data: rows,
      user
    });
  }

  ctrl.save = async (req, res) => {
    let body = req.body;
    const connection = await connect();
    delete body.url;
    const dataSaved = await saveQuery(connection, body, nameTable);
    res.json({success: true});
  }

  ctrl.edit = async (req, res) => {
    let user = req.user;
    const { id } = req.params;
    const connection = await connect();
    const [rows] = await connection.query(`SELECT * FROM ${nameTable} WHERE codigo = ${id}`);
    res.render('index', {
      title: titleProyect,
      section: `${nameTable}/registro`,
      data: rows[0],
      edit: true,
      user
    });
  }

  ctrl.update = async (req, res) => {
    let body = req.body;
    const { id } = req.params;
    delete body.url;
    const connection = await connect();
    const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
      body,
      id
    ]);
    res.json({success: true});
  }
  return ctrl;
}

module.exports = {getCtrlSub};