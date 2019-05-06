document.addEventListener("DOMContentLoaded", function() {

const baseUrl = "http://localhost:3000/";
const tablesUrl = "http://localhost:3000/tables";
const partiesUrl = "http://localhost:3000/parties";
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
      <div id="table-${table.id}-form-container" data-party-id=""></div>
      <ul id=table-${table.id}-list data-party-id=""><button type="button" data-add-party-to-table="${table.id}">Add Party</button></ul>
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
  const formDiv = document.getElementById(`table-${party.table_id}-form-container`);
  formDiv.dataset.partyID = party.id;
  const ul = document.getElementById(`table-${party.table.id}-list`);
  ul.dataset.partyId = party.id;
  const btn = ul.querySelector('button').classList.add("disappear");
  h4.innerHTML = `Table ${party.table_id}: ${party.name}`;
  party.orders.forEach(function(order) {
    ul.innerHTML += `<li draggable="true" id=${order.id}-order-li>${order.item_name}<span class=order-status>: ${order.served === false ? "BEING PREPARED" : "SERVED" }</span></li>`
  });
  formDiv.innerHTML = `
    <button data-add-order-to-party=${party.table_id}>New Order</button>
    <form id=party-${party.id}-order-form data-toggle="off" class="disappear">
      <input type="text" name="name" placeholder="item name"/>
      <input type="number" name="price" placeholder="price" />
      <input type="submit" value="submit" />
    </form>
    `;
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
  }).catch(error => {
    alert(error.message);
    console.log(error.message);
  })
}

getParties(partiesUrl);

function addOrder(itemName, price, partyId) {
  let formData = {
    item_name: itemName,
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
  const ul = document.body.querySelector(`[data-party-id='${order.party_id}']`);
  const li = document.createElement('li');
  ul.appendChild(li)
  li.textContent = `${order.item_name}, $${order.price}`;
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
    const partyId = parseInt(e.target.dataset.addOrderToParty);
    // get input to appear
    const orderForm = document.getElementById(`party-${partyId}-order-form`);
    if (orderForm.dataset.toggle === "off") {
      orderForm.dataset.toggle = "on";
      orderForm.classList.remove("disappear");
    } else {
      orderForm.dataset.toggle = "off";
      orderForm.reset();
      orderForm.classList.add("disappear");
    }
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addOrder(orderForm.name.value, parseInt(orderForm.price.value), partyId)
      orderForm.dataset.toggle = "off";
      orderForm.reset();
      orderForm.classList.add("disappear");
    })

  }
});

function deleteOrder (orderId) {
  fetch(`${ordersUrl}/${orderId}`, {method: "DELETE"})
  .then( res => res.json())
  .then( order => { //order is a place holder
  }).catch(error => {
    alert(error.message);
    console.log(error.message)
  })
}


tableRow.addEventListener('click', e =>  {
  // Delte order item on click
  if (e.target.tagName === 'LI') {
    let orderId = parseInt(e.target.id)
    deleteOrder(orderId);
    e.target.remove();

    //delete part name on click
    // if (e.target.tagName === 'H4') {
    // let partyId = parseInt(e.target.id)
    // deleteParty(PartyId);
    // e.target.remove();



  }
})




















});
