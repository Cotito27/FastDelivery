const {connect} = require('../database');
const ctrl = {};

const titleProyect = 'Fast Delivery';
const nameTable = 'clientes';

async function consultEstadosCli(connection) {
  const [rows] = await connection.query(`SELECT codigo,nombre FROM estado_cliente`);
  return rows;
}

ctrl.edit = async (req, res) => {
  let user = req.user;
  //CONCAT(cli.apellido_paterno, ' ', cli.apellido_materno) as apellidos
  const { id } = req.params;
  const connection = await connect();
  const [rows] = await connection.query(`SELECT cli.codigo, cli.nombres, cli.apellido_paterno, cli.apellido_materno, cli.dni, cli.direccion, cli.telefono, esta.nombre as estado, cli.correo, cli.imagen FROM ${nameTable} cli INNER JOIN estado_cliente esta ON cli.cod_estado = esta.codigo WHERE cli.codigo = ${id}`);
  const estados = await consultEstadosCli(connection);
  res.render('index', {
    title: titleProyect,
    section: 'clientes/registro',
    data: rows[0],
    estados,
    edit: true,
    user
  });
}

ctrl.update = async (req, res) => {
  let body = req.body;
  const { id } = req.params;
  let urlResult = '';
  let public_id = '';
  const connection = await connect();
  const [rows] = await connection.query(`SELECT imagen, public_id FROM ${nameTable} WHERE codigo = ${id}`);
  if(req.body.url) {
    const urlReceived = req.body.url;
    // console.log(urlReceived);
    const ext = '.jpg';
    const fileUrl = uuid.v4();
    const newUrlDownload = path.resolve(`src/public/upload/${fileUrl}${ext}`);
    await download(urlReceived, newUrlDownload, async function(){
      const result = await cloudinary.v2.uploader.upload(newUrlDownload);
      // console.log(newUrlDownload);
      await fs.unlink(newUrlDownload);
      urlResult = result.url;
      public_id = result.public_id;
      delete body.url;
      if(rows[0].imagen !== urlResult) {
        if(rows[0].public_id) {
          await cloudinary.v2.uploader.destroy(rows[0].public_id);
        }
      }
      const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
        {...body, imagen: urlResult, public_id},
        id
      ]);
      console.log(results);
      res.json({success: true, imagen: urlResult});
    });
  } else {
    if(!req.file) {
      const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
        body,
        id
      ]);
      console.log(results);
      return res.json({success: true, imagen: null});
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    urlResult = result.url;
    public_id = result.public_id;
    if(rows[0].imagen !== urlResult) {
      if(rows[0].public_id) {
        await cloudinary.v2.uploader.destroy(rows[0].public_id);
      }
    }
    const results = await connection.query(`UPDATE ${nameTable} SET ? WHERE codigo = ?`, [
      {...body, imagen: urlResult, public_id},
      id
    ]);
    console.log(results);
    res.json({success: true, imagen: urlResult});
  }
}

ctrl.report = async (req, res) => {
  let user = req.user;
  const connection = await connect();
  const [rows] = await connection.query(`SELECT cli.codigo, cli.nombres, cli.apellido_paterno, cli.apellido_materno, cli.dni, cli.direccion, cli.telefono, esta.nombre as estado, cli.correo, cli.imagen FROM ${nameTable} cli INNER JOIN estado_cliente esta ON cli.cod_estado = esta.codigo`);
  res.render('index', {
    title: titleProyect,
    section: 'clientes/reporte',
    data: rows,
    user
  });
}

module.exports = ctrl;