const getControl = require('./subTables.controller');
const titleProyect = 'Fast Delivery';
const nameTable = 'cargo';

const ctrl = getControl.getCtrlSub(titleProyect,nameTable);

module.exports = ctrl;