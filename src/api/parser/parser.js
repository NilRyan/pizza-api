/* eslint-disable no-restricted-syntax */
function parseOrders(pml) {
  const orderNumberRegex = /^{order number="(.+?)"}(.+?){\\order}$/ms;
  const match = pml.match(orderNumberRegex);

  validateMatch(match);
  const orderNumber = Number(match[1]);
  validateNumber(orderNumber);
  return {
    orderNumber: orderNumber,
    pizzas: match[2],
  };
}
function parsePizzas(pizzas) {
  const pizzaRegex = /{pizza number="(.+?)"}(.+?){\\pizza}/gms;
  const pizzaDetailsList = [];
  for (const match of pizzas.matchAll(pizzaRegex)) {
    validateMatch(match);
    const pizzaNumber = Number(match[1]);
    validateNumber(pizzaNumber);
    pizzaDetailsList.push({
      pizzaNumber,
      pizzaDetails: match[2],
    });
  }
  const pizzaJson = pizzaDetailsList.map(({ pizzaNumber, pizzaDetails }) => {
    const pizzaElements = parsePizzaElements(pizzaDetails);
    let toppings = [];
    if (pizzaElements.type === "custom") {
      toppings = parseToppings(pizzaDetails);
    }
    return {
      pizzaNumber,
      ...pizzaElements,
      toppings,
    };
  });

  validatePizzaNumbering(pizzaJson);
  validatePizzaTotal(pizzaJson);
  return pizzaJson;
}

function parsePizzaElements(pizza) {
  const pizzaElementsRegex =
    /{size}(.+?){\\size}\s*{crust}(.+?){\\crust}\s*{type}(.+?){\\type}/m;
  const match = pizza.match(pizzaElementsRegex);
  validateMatch(match);
  return {
    size: match[1],
    crust: match[2],
    type: match[3],
  };
}

function parseToppings(pizza) {
  const pizzaElementsRegex =
    /{size}(.*?){\\size}\s*{crust}(.*?){\\crust}\s*{type}(.*?){\\type}/m;
  const toppingsDetails = pizza.replace(pizzaElementsRegex, "");
  const toppingsRegex = /{toppings area="(.+?)"}(.+?){\\toppings}/gms;
  const itemsRegex = /{item}(.+?){\\item}/gms;
  const toppingsList = [];
  for (const match of toppingsDetails.matchAll(toppingsRegex)) {
    validateMatch(match);
    const [_, area, itemDetails] = match;
    const items = [];
    for (const matchItem of itemDetails.matchAll(itemsRegex)) {
      items.push(matchItem[1]);
    }
    const areaNumber = Number(area);
    validateNumber(areaNumber);
    toppingsList.push({
      area: areaNumber,
      items,
    });
  }
  validateAreaNumbering(toppingsList);
  return toppingsList;
}

function validateNumber(number) {
  if (Number.isNaN(number)) {
    throw new Error("Attribute must be a valid number");
  }
}

function validateMatch(match) {
  if (match === null) {
    throw new Error("Invalid PML Syntax");
  }
}

function validatePizzaTotal(pizzaJson) {
  if (pizzaJson.length > 24) {
    throw new Error("Total number of Pizza cannot exceed 24!");
  }
}

function validatePizzaNumbering(pizzaJson) {
  for (let index = 1; index <= pizzaJson.length; index++) {
    if (index !== pizzaJson[index - 1].pizzaNumber) {
      throw new Error("Please check Pizza numbering");
    }
  }
}

function validateAreaNumbering(toppings) {
  for (let index = 0; index < 3; index++) {
    if (index !== toppings[index].area) {
      throw new Error("Please check toppings area numbering. Must be order from 0 to 2");
    }
  }
}

module.exports = {
  parseOrders,
  parsePizzas,
};
