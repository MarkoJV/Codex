//const { Binding } = require("winjs");
const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
let timestamp = new Date().toLocaleDateString('en-US', dateOptions);
var modEntry = '';

//Offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            console.log('DataBase persistence failed');
        } else if (err.code == 'unimplemented') {
            console.log('DataBase persistence not available');
        }
    });


// realtime listener
db.collection('General').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        //console.log(change, change.doc.data(), change.doc.id);
        if (change.type === 'added') {
            // add DB data to page
            renderItem(change.doc.data(), change.doc.id)
        }
        if (change.type === 'removed') {
            // remove data from page 
            removeEntry(change.doc.id);
        }
    });
})

// Add new entry

const form = document.querySelector('form')
const elems = document.querySelector('elems')
const modForm = document.getElementById('mod-form')
//const formMod = document.querySelector('formsMod')
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const entry = {
        name: form.title.value,
        details: form.details.value,
        moredetails: form.moredetails.value,
        timestamp: timestamp,
        icon: form.icons.value,
    };


    db.collection('General').add(entry)
        .catch(err => console.log(err));

    form.title.value = '';
    form.details.value = '';
    form.moredetails.value = '';
    form.icons.value = '';

});

// Modify entry

const entryContainer = document.querySelector('.entries');
entryContainer.addEventListener('click', evt => {
    //console.log(evt);

    // Delete entry
    if (evt.target.id === 'deletebtn') {
        const id = evt.target.getAttribute('data-id');
        db.collection('General').doc(id).delete();
    }
    // Update entry
    else if (evt.target.id === 'editbtn') {

        console.log("Edit request");
        const id = evt.target.getAttribute('data-id');
        let card = document.getElementById(id);
        let name = document.getElementById(id + "-name").innerHTML;
        let details = document.getElementById(id + "-details").innerHTML;
        let moredetails = document.getElementById(id + "-moredetails").innerHTML;
        modForm.titleMod.value = name;
        modForm.detailsMod.value = details;
        modForm.moredetailsMod.value = moredetails;
        modEntry = id;
    }
});

// Deliver update

function updateDb() {
    const entry = {
        name: modForm.titleMod.value,
        details: modForm.detailsMod.value,
        moredetails: modForm.moredetailsMod.value,
        timestamp: timestamp,
        //icon: form.icons.value,
    };

    console.log("update to entry: " + modEntry);
    db.collection('General').doc(modEntry).update(entry)
        .catch(err => console.log(err));

    modForm.titleMod.value = '';
    modForm.detailsMod.value = '';
    modForm.moredetailsMod.value = '';
    //modForm.icons.value = '';
}