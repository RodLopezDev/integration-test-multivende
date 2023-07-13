const persons = require("./persons.json");

/** FILTER USERS WITH ADDERSS */
const personsWithAddress = persons.filter(
  (person) => !!person?.address?.length
);

/** SORT LIST ABOUT NAME */
personsWithAddress.sort((a, b) => (a.name > b.name ? 1 : -1));

// /** FILTER AGE */
const finalValue = personsWithAddress
  // FILTER 1
  .filter((person) => person.age > 20 && person.age < 30)
  // FILTER 2
  .filter((person) => {
    const firstCharOnName = person.name[0];
    return ["H", "L"].includes(firstCharOnName.toUpperCase());
  });

// FINAL RESULT
console.log(finalValue);
