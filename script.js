/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // Creates coffeeCounter variable which selects the amount of Coffee on HTML file.
  // Updates text to equal the coffeeQty passed into the function.
  const coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  // Creates coffeeCounter variable which selects the amount of Coffee on HTML file.
  // Increments the coffee key on the data object by 1.
  // Sets the coffeeCounter variable's text to equal the data object's coffee key's value.
  const coffeeCounter = document.getElementById("coffee_counter");
  data.coffee++;
  coffeeCounter.innerText = data.coffee;
  // Uses the renderProducers function created in Slice 2 to update the DOM to display any newly available producers upon user click.
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // Use forEach Array Method to loop through producer objects in the data.js file.
  // If coffeeCount is greater than or equal to half a producerElement's price, set unlocked to true;
  producers.forEach((producerElement) => {
    if (coffeeCount >= producerElement.price / 2) {
      producerElement.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  // Uses the Filter Array Method to return a filtered array.
  // The new filtered array will only include producers that are unlocked.
  return data.producers.filter(
    (producerElement) => producerElement.unlocked === true
  );
}

function makeDisplayNameFromId(id) {
  // Takes an id and splits it into an Array.
  // Each word in the array is converted to uppercase and stored in a new array, capitalizedWordsArray.
  // The capitalizedWordsArr is joined to create a Title Case string.
  const idArrOfWords = id.split("_");
  let capitalizedWordsArr = idArrOfWords.map(
    (word) => `${word[0].toUpperCase()}${word.slice(1)}`
  );
  return capitalizedWordsArr.join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // Utilizes a while loop to continue to remove the first child of the parent if the parent has a first child.
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // If renderProducers(data) is called, it should:
  // Create a variable that selects the producer_container on the HTML file.
  let coffeeProducerContainer = document.getElementById("producer_container");
  // After which, delete all the child nodes from the container if there are any.
  deleteAllChildNodes(coffeeProducerContainer);
  // Unlock any producers that need to be unlocked.
  unlockProducers(data.producers, data.coffee);
  // Then create an array of unlocked producers.
  let arrayOfUnlockedProducers = getUnlockedProducers(data);
  // Use an array method on arrayOfUnlockedProducers to access each producerElement of the array.
  // Create a child div using the makeProducerDiv function + pass in the producerElement.
  // Append the new child to the coffeeProducerContainer so it displays correctly in the DOM.
  arrayOfUnlockedProducers.forEach((producerElement) =>
    coffeeProducerContainer.appendChild(makeProducerDiv(producerElement))
  );
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // Retrieve and return a producer object if given the producer's id value.
  // Created a for loop that returns the object at index of i when id = producerId
  // For loop was the selected method to accomplish this task since you could return out of the loop when the producerId condition was met.
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) {
      return data.producers[i];
    }
  }
}

function canAffordProducer(data, producerId) {
  // Wrote a conditional statement that utilizes the getProducerById function written above.
  // If the object's price is less than or equal to the amount of coffee available in the data object, return true, else return false.
  if (getProducerById(data, producerId).price <= data.coffee) {
    return true;
  } else {
    return false;
  }
}

function updateCPSView(cps) {
  // Selected the location where cps is displayed.
  // Updated the text of the location to be the cps value passed into this function.
  let cpsDisplay = document.getElementById("cps");
  cpsDisplay.innerText = cps;
}

function updatePrice(oldPrice) {
  // Use Math.floor to round down (old price * 1.25 or 125%) to return new updated price.
  return Math.floor(+oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // If attemptToBuyProducer is invoked, it will check that the user can afford the producer using the canAffordProducer function.
  if (canAffordProducer(data, producerId)) {
    // If the user can afford the producer, a new variable will be created to hold the producer's object.
    let producerInQuestion = getProducerById(data, producerId);
    // The user's total cps will be updated to the producer in question's cps.
    data.totalCPS += producerInQuestion.cps;
    // The producer in question's quantity will be incremented by 1.
    producerInQuestion.qty++;
    // The total coffee the user has will be subtracted by the producer's cost.
    data.coffee = data.coffee - producerInQuestion.price;
    // The producer's price will then be update to 125% of the original price.
    producerInQuestion.price = updatePrice(producerInQuestion.price);
    return true;
  } else {
    // Return false and do nothing else.
    return false;
  }
}

function buyButtonClick(event, data) {
  // Set the event.target object to a variable.
  const target = event.target;
  // Set the id value on the target object to a variable after removing the "buy_" characters as they don't match producer id on the data.js file.

  // Initialize a variable for producer ID clicked.
  let producerIDClicked = "";

  // Create a conditional to check if event.target.id is a truthy value, if so, pull that value, format it accordingly, and set it equal to producerIdClicked for use in the rest of the function.
  if (event.target.id) {
    producerIDClicked = event.target.id.slice(4);
  }

  // Create an conditional statement if the target click's tag name is "Button" and the canAffordProducer function returns true, move into the block....
  if (
    target.tagName === "BUTTON" &&
    canAffordProducer(data, producerIDClicked)
  ) {
    // and attempt to buy the producer.
    attemptToBuyProducer(data, producerIDClicked);
    // Render the updated producers.
    renderProducers(data);
    // Update the total coffee count after the purchase of the producer.
    updateCoffeeView(data.coffee);
    // Update the total CPS after the purchase of the producer.
    updateCPSView(data.totalCPS);
    // If the target's tag name is button (ie, the user clicked the appropriate button), but was unable to afford the producer, move into the block...
  } else if (
    target.tagName === "BUTTON" &&
    !canAffordProducer(data, producerIDClicked)
  ) {
    // Display an alert that the user does not have enough coffee to purchase the producer.
    window.alert("Not enough coffee!");
  } else {
    return;
  }
}

function tick(data) {
  // Increase the coffee the user has by the totalCPS.
  data.coffee += data.totalCPS;
  // Display the new amount of coffee on the page using the updateCoffeeView function.
  updateCoffeeView(data.coffee);
  // Update the DOM to reflect any newly unlocked producers as a result of the coffee count moving upwards.
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
