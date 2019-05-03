document.addEventListener("DOMContentLoaded", function() {

const baseUrl = "http://localhost:3000/";
const tablesUrl = "http://localhost:3000/tables";
const partiesUrl = "http://localhost:3000/parties";
const tableRow = document.querySelector("#table-row");


function getTables(url){
  fetch(url)
    .then(res => res.json() )
    .then(tables => renderTables(tables) )
}

function renderTables(tables){
  tableRow.innerHTML = '';
  tables.forEach(table => {
    let div = document.createElement('div');
    div.className = "col-lg-3 table-col";
    tableRow.appendChild(div);
    div.innerHTML = `
      <h4 id=table-${table.id}-party-header></h4>
      <ul id=table-${table.id}-list></ul>
    `
  })
}

getTables(tablesUrl)

function getParties(url) {
  fetch(url)
    .then(res => res.json() )
    .then(parties => renderParties(parties) )
}

function renderParties(parties){
  parties.forEach(function(party) {
    const tableList = document.getElementById(`table-${party.table.id}-list`)
    const h4 = document.getElementById(`table-${party.table.id}-party-header`);
    const ul = document.getElementById(`table-${party.table.id}-list`);
    h4.textContent = party.name;
    party.orders.forEach(function(order) {
      ul.innerHTML += `<li>${order.item_name}<span class=order-status>Status: ${order.served === false ? "BEING PREPARED" : "SERVED" }</span></li>`
    })
  });

}

getParties(partiesUrl);


});
