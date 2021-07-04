const getControl = require('./subTables.controller');
const titleProyect = 'Fast Delivery';
const nameTable = 'estado_cliente';

const ctrl = getControl.getCtrlSub(titleProyect,nameTable);

module.exports = ctrl;