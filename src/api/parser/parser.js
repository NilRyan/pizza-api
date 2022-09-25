/* eslint-disable no-restricted-syntax */
function parseOrders(pml) {
  const orderNumberRegex = /^{order number="(.+?)"}(.+?){\\order}$/ms;
  const match = pml.match(orderNumberRegex);

  return {
    orderNumber: match[1],
    pizzas: match[2],
  };
}
function parsePizzas(pizzas) {
  const pizzaRegex = /{pizza number="(.+?)"}(.+?){\\pizza}/gms;
  const pizzaDetailsList = [];
  for (const match of pizzas.matchAll(pizzaRegex)) {
    pizzaDetailsList.push({
      pizzaNumber: Number(match[1]),
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
  // TODO: Add validation pizza numbers must be 1-24 only
  return pizzaJson;
}

function parsePizzaElements(pizza) {
  const pizzaElementsRegex =
    /{size}(.+?){\\size}\s*{crust}(.+?){\\crust}\s*{type}(.+?){\\type}/m;
  const match = pizza.match(pizzaElementsRegex);
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
    const [_, area, itemDetails] = match;
    const items = [];
    for (const matchItem of itemDetails.matchAll(itemsRegex)) {
      items.push(matchItem[1]);
    }
    toppingsList.push({
      area: Number(area),
      items,
    });
  }
  return toppingsList;
}

module.exports = {
  parseOrders,
  parsePizzas,
};
