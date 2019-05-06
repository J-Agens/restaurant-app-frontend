document.addEventListener("DOMContentLoaded", function() {

const baseUrl = "http://localhost:3000/";
const tablesUrl = "http://localhost:3000/tables";
const partiesUrl = "http://localhost:3000/parties";
// TESTING ORDERS url
const ordersUrl = "http://localhost:3000/orders"
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
      <h4 id=table-${table.id}-party-header>Table ${table.id} :</h4>
      <ul id=table-${table.id}-list><button type="button" data-add-party-to-table="${table.id}">Add Party</button></ul>
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
    renderParty(party);
  });

}

function renderParty(party) {
  const tableList = document.getElementById(`table-${party.table.id}-list`)
  const h4 = document.getElementById(`table-${party.table.id}-party-header`);
  const ul = document.getElementById(`table-${party.table.id}-list`);
  const btn = ul.querySelector('button').classList.add("disappear");
  h4.innerHTML = `Table ${party.table_id}: ${party.name}`;
  party.orders.forEach(function(order) {
    ul.innerHTML += `<li>${order.item_name}<span class=order-status>Status: ${order.served === false ? "BEING PREPARED" : "SERVED" }</span></li>`
  })
  ul.innerHTML += `<button data-add-order-to-party=${party.table_id}>New Order</button>`;
}

function addParty(partyName, tableId) {
  let formData = {
    name: partyName,
    table_id: tableId
  }

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch(partiesUrl, configObj)
  .then(res => res.json())
  .then(party => {
    console.log(party);
    renderParty(party);
  })
}

getParties(partiesUrl);

function addOrder(itemName, price, partyId) {
  let formData = {
    item_name: itemName,
    served: false,
    price: price,
    party_id: partyId
  };

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Application": "application/json"
    },
    body: JSON.stringify(formData)
  };

  fetch(ordersUrl, configObj)
  .then(res => res.json())
  .then(order => {
    renderOrder(order)
  })
  .catch(error => {
    alert(error.message);
    console.log(error.message);
  })
}

function renderOrder(order) {
  const ul = document.getElementById(`table-${party.table.id}-list`);
  
}

tableRow.addEventListener('click', function(e) {
  if (e.target.hasAttribute("data-add-party-to-table")) {
    const tableNum = e.target.dataset.addPartyToTable;
    const input = document.createElement('input');
    input.type = "text";
    e.target.classList.add("disappear");
    e.target.parentNode.appendChild(input);
    input.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        addParty(input.value, parseInt(tableNum));
        input.classList.add("disappear");
      }
    })
  }
});

tableRow.addEventListener('click', function(e) {
  if (e.target.hasAttribute("data-add-order-to-party")) {
    // get input to appear
    const itemNameInput = document.createElement('input');
    itemNameInput.type = "text";
    itemNameInput.placeholder = "Item Name";
    const priceInput = document.createElement('input');
    priceInput.type = "text";
    priceInput.placeholder = "Item Price";
    e.target.parentNode.appendChild(itemNameInput);
    e.target.parentNode.appendChild(priceInput);
    itemNameInput.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        // add order to ul --> post to /orders
        itemNameInput.classList.add("disappear");
        // render order
      }
    })

  }
});

});
