const entries = document.querySelector('.entries');
/*var timestamp = new Date().toLocaleDateString();
<div class="">${timestamp}</div>*/

document.addEventListener('DOMContentLoaded', function () {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'right' });

    // add item form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, { edge: 'left' });

    // modify side form

    const formsMod = document.querySelectorAll('.side-form-modify');
    M.Sidenav.init(formsMod, { edge: 'left', draggable: false});

    // Icon selector

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, { edge: 'left', draggable: false});
});

// render items from DB

const renderItem = (data, id) => {

    const html = `
    <div class="card-panel item white row" id="${id}" data-id="${id}">
     <img src="${data.icon}" alt="placeholder thumb">
     <div class="entry-details">
      <div class="timestamp">${data.timestamp}</div>
      <div id="${id}-name" class="entry-title">${data.name}</div>
      <div id="${id}-details" class="entry-properties">${data.details}</div>
      <div id="${id}-moredetails" class="entry-info">${data.moredetails}</div>
    </div>
    <div class="entry-delete">
      <i class="material-icons sidenav-trigger" data-target="side-form-modify" id="editbtn" data-id="${id}">edit</i>
      <br><i class="material-icons" id="deletebtn" data-id="${id}">delete_outline</i>
     </div>
    </div>
    `;

    entries.innerHTML += html;

};

// Remove entry
const removeEntry = (id) => {
    const entry = document.querySelector(`.item[data-id=${id}]`);
    entry.remove();
}


/*function renderItem(data, id){

}*/