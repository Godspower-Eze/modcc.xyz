export const commaSeparatedToList = (input: string): Array<number> => {
  let splitted_value = input.split(",");
  let values = splitted_value
    .map((value) => parseInt(value.trim()))
    .filter((value) => !Number.isNaN(value));
  return values;
};

export const isPrime = (input: number): boolean => {
  if (input <= 1) return false; // Numbers less than or equal to 1 are not prime
  if (input <= 3) return true; // 2 and 3 are prime numbers
  if (input % 2 === 0 || input % 3 === 0) return false; // Eliminate multiples of 2 and 3

  // Check from 5 to sqrt(input), skipping even numbers and multiples of 3
  for (let i = 5; i * i <= input; i += 6) {
    if (input % i === 0 || input % (i + 2) === 0) return false;
  }
  return true;
};

export const listsToString = (x: Array<number>, y: Array<number>): string => {
  let res = "[";
  let list_of_tuples: Array<Array<number>> = [];
  x.forEach((value, index) => {
    let tuple = [value, y[index]];
    list_of_tuples.push(tuple);
  });
  list_of_tuples.forEach((value, index) => {
    if (index != list_of_tuples.length - 1) {
      res += `(${value[0]}, ${value[1]}), `;
    } else {
      res += `(${value[0]}, ${value[1]})`;
    }
  });
  res += "]";
  return res;
};
