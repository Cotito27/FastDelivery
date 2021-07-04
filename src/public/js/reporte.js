// paginator({
//   table: document.querySelector(".table-responsive").querySelector('table'),
//   box: document.getElementById("index_native"),
//   active_class: "color_page"
// });
let tableStruct = $('.table-striped').DataTable({
  responsive: true,
  autoWidth: false,
  select: 'single', dom: 'Blfrtip',
  lengthMenu: [ [10, 25, 50, -1], ['10', '25', '50', 'Mostrar todo'] ],
  buttons: [ { extend: 'pdf', text: ' Exportar a PDF' }, { extend: 'csv', text: ' Exportar a CSV' }, { extend: 'excel', text: ' Exportar a EXCEL' }, { extend: 'pageLength', text: ' Mostrar _TOTAL_' } ],
  language: {
      processing: "Tratamiento en curso...",
      search: "Buscar&nbsp;:",
      lengthMenu: "Agrupar de _MENU_ items",
      info: "Mostrando del item _START_ al _END_ de un total de _TOTAL_ items",
      infoEmpty: "No existen datos.",
      infoFiltered: "(filtrado de _MAX_ elementos en total)",
      infoPostFix: "",
      loadingRecords: "Cargando...",
      zeroRecords: "No se encontraron datos con tu busqueda",
      emptyTable: "No hay datos disponibles en la tabla.",
      paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Ultimo"
      },
      aria: {
          sortAscending: ": active para ordenar la columna en orden ascendente",
          sortDescending: ": active para ordenar la columna en orden descendente"
      },
  },
});

tableStruct.columns().every( function () {
  var that = this;

  $('.input-search-table').on( 'keyup change clear', function () {
    //console.log(that.search(), this.value);
    tableStruct.search(this.value).draw()      
  } );
});

let btnEdit = document.querySelector('.btn-edit');
if(btnEdit) {
  btnEdit.addEventListener('click', () => {
    let targetChecked = document.querySelector('.inp-cbx:checked');
    if(targetChecked) {
      const id = targetChecked.parentElement.parentElement.querySelector('.codigo-item').textContent.trim();
      location.href = `/${nameSection}/editar/${id}`;
    } else {
      msgError('Debe de seleccionar alguna fila');
    }
  });
}
