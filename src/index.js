document.addEventListener("DOMContentLoaded", function() {

const baseUrl = "https://powerful-oasis-44271.herokuapp.com/";
const tablesUrl = "https://powerful-oasis-44271.herokuapp.com/tables";
const partiesUrl = "https://powerful-oasis-44271.herokuapp.com/parties";
const ordersUrl = "https://powerful-oasis-44271.herokuapp.com/orders"
const tableRow = document.querySelector("#table-row");

function getTables(url){
  fetch(url)
    .then(res => res.json() )
    .then(tables => renderTables(tables) )
}

function renderTables(tables){
  tableRow.innerHTML = '';
  tables.forEach(table => {
    renderTable(table);
  })
}

function renderTable(table) {
  let div = document.createElement('div');
  div.className = "col-lg-3 table-col";
  div.id = `${table.id}-table-col`;
  tableRow.appendChild(div);
  renderTableInterior(table.id)
}

function renderTableInterior(tableId) {
  const tableDiv = document.getElementById(`${tableId}-table-col`)
  tableDiv.innerHTML = `
    <h4 class="my-header" id=table-${tableId}-party-header>Table ${tableId} :</h4>
    <div id="table-${tableId}-form-container" data-party-id=""></div>
    <ul id="allItems" runat="server" class=table-${tableId}-list data-party-id=""><button class="btn btn-primary other-btn" type="button" data-add-party-to-table="${tableId}">Add Party</button></ul>
  `
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
  const tableList = document.getElementsByClassName(`table-${party.table.id}-list`)[0]
  const h4 = document.getElementById(`table-${party.table.id}-party-header`);
  const formDiv = document.getElementById(`table-${party.table_id}-form-container`);
  formDiv.dataset.partyID = party.id;
  const ul = document.getElementsByClassName(`table-${party.table.id}-list`)[0];
  ul.dataset.partyId = party.id;
  const btn = ul.querySelector('button').classList.add("disappear");
  h4.innerHTML = `Table ${party.table_id}: ${party.name} $<span class="party-total" id="party-${party.id}-total">${party.grand_total}</span>`;
  party.orders.forEach(function(order) {
    ul.innerHTML += `<li draggable="true" id="node${order.id}" class=${order.id}-order-li ondragstart="drag(event)">${order.item_name}<span class="order-status" data-order=${order.id}>: ${order.served === false ? "BEING PREPARED" : "SERVED" }</span></li>`
  });
  const orderStatusIndicators = document.body.querySelectorAll('.order-status');
  orderStatusIndicators.forEach(element => {
    if (element.textContent === ": SERVED") {
      element.style.color = "#03A678";
    }
  })
  formDiv.innerHTML = `
    <button class="btn btn-primary my-btn new-order-btn" data-add-order-to-party=${party.table_id} data-party-id-number=${party.id} ondrop="dropMenuItem(event)" ondragover="allowDropMenuItem(event)">New Order</button>
    <form id=party-${party.id}-order-form data-toggle="off" class="disappear">
      <input type="text" name="name" placeholder="item name..."/>
      <input type="number" name="price" placeholder="price" />
      <input class="form-hidden" type="submit" value="submit" />
    </form>
    `;
    const orderForm = formDiv.querySelector('form');
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addOrder(orderForm.name.value, parseInt(orderForm.price.value), party.id)
      orderForm.dataset.toggle = "off";
      orderForm.reset();
      orderForm.classList.add("disappear");
    })
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
      "Accept": "application/json"
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
  const totalSpan = document.querySelector(`#party-${order.party_id}-total`);
  let total = parseInt(totalSpan.textContent);
  total += order.price;
  totalSpan.textContent = `${total}`;
  ul.innerHTML += `<li draggable="true" id="node${order.id}" class=${order.id}-order-li ondragstart="drag(event)">${order.item_name}<span class=order-status data-order=${order.id}>: ${order.served === false ? "BEING PREPARED" : "SERVED" }</span></li>`;
}

function deleteOrder (orderId) {
  fetch(`${ordersUrl}/${orderId}`, {method: "DELETE"})
  .then( res => res.json())
  .then( order => {
    order;
  }).catch(error => {
    alert(error.message);
    console.log(error.message)
  })
}

function changeOrderStatus(orderId) {
  let formData = {
    served: true
  };

  let configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };

  fetch(`${ordersUrl}/${orderId}`, configObj)
  .then(res => res.json())
  .then(order => order)
  .catch(error => {
    alert(error.message);
    console.log(error.message);
  })
}

function deleteParty(partyId) {
  fetch(`${partiesUrl}/${partyId}`, {method: "DELETE"})
  .then(res => res.json())
  .then(party => party)
  .catch(error => {
    alert(error.message);
    console.log(error.message);
  })
}


tableRow.addEventListener('click', function(e) {
  if (e.target.hasAttribute("data-add-order-to-party")) {
    const partyId = parseInt(e.target.dataset.addOrderToParty);
    // get input to appear
    const orderForm = e.target.nextElementSibling;
    if (orderForm.dataset.toggle === "off") {
      orderForm.dataset.toggle = "on";
      orderForm.classList.remove("disappear");
    } else {
      orderForm.dataset.toggle = "off";
      orderForm.reset();
      orderForm.classList.add("disappear");
    }

  } else if (e.target.hasAttribute("data-add-party-to-table")) {
    const tableNum = e.target.dataset.addPartyToTable;
    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "party name...";
    input.classList.add("party-name-input")
    e.target.classList.add("disappear");
    e.target.parentNode.appendChild(input);
    input.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        addParty(input.value, parseInt(tableNum));
        input.classList.add("disappear");
      }
    })
  } else if (e.target.tagName === "H4") {
    $.confirm({
      title: 'Confirm!',
      content: 'Are you sure you want to delete this party?',
      buttons: {
          confirm: function () {
            const tableNumber = parseInt(e.target.parentNode.id);
            const partyIdNum = parseInt(e.target.nextElementSibling.dataset.partyID);
            // DELETE PARTY AND RE-RENDER TABLE INTERIOR
            deleteParty(partyIdNum);
            renderTableInterior(tableNumber);
          },
          cancel: function () {
              // $.alert({
              //   title: 'Canceled!',
              //   content: "",
              // });
          }
      }
    });

  } else if (e.target.className === "order-status") {
      const orderId = parseInt(e.target.dataset.order);
      changeOrderStatus(orderId);
      e.target.textContent = ": SERVED";
      e.target.style.color = "#03A678"
  }
});

$(".menu-item").mouseover(function(){
  $(this).animate({
    opacity: '0.5',
    paddingLeft: "2px"
  });
});

$(".menu-item").mouseleave(function(){
  $(this).animate({
    opacity: '1.0',
    paddingLeft: "0px"
  });
});


});
