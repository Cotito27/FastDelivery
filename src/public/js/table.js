function formatTable() {
  // let table = document.querySelector('table');
  let trs = document.querySelectorAll('table tbody tr');

  let selectedRow;

  trs.forEach((item) => {
    item.addEventListener('click', (e) => {
      // let selectedTr = document.querySelector('.selected-tr');
      // if(selectedTr) {
      //   if(selectedTr != e.currentTarget) {
      //     selectedTr.classList.remove('selected-tr');
      //   }
      // }
      // item.classList.toggle('selected-tr');
    });
    
    let checkSelectItem = item.querySelector('.inp-cbx');
    checkSelectItem.addEventListener('change', (e) => {
      if(selectedRow) {
        if(selectedRow !== e.target) {
          selectedRow.checked = false;
        }
      }
      selectedRow = e.target;
    });
  });
}

formatTable();