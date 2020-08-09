self.onmessage = (e) => {
  if (e.data.number) {
    const value = factorial(e.data.number);
    self.postMessage(value);
  }
};

function factorial(n) {
  // string convert to interger number
  n = parseInt(n);

  if (n === 0 || n === 1) {
    return 1;
  }

  // define table to hold values
  let table = [];

  // base case
  table[0] = 1;

  for (let i = 1; i <= n; i++) {
    // use the value stored in the previos slot
    table[i] = multiply(i.toString(), table[i - 1].toString());
  }

  // return final slot value
  return table[n];
}

function multiply(a, b) {
  // check value 0 or not
  if (parseInt(a) == 0 || parseInt(b) == 0) {
    return '0';
  }

  // reverse the string and add one by one digit
  a = a.split('').reverse();
  b = b.split('').reverse();
  let result = [];

  for (let i = 0; a[i] >= 0; i++) {
    for (let j = 0; b[j] >= 0; j++) {
      if (!result[i + j]) {
        result[i + j] = 0;
      }

      result[i + j] += a[i] * b[j];
    }
  }

  for (let i = 0; result[i] >= 0; i++) {
    if (result[i] >= 10) {
      if (!result[i + 1]) {
        result[i + 1] = 0;
      }

      result[i + 1] += parseInt(result[i] / 10);
      result[i] %= 10;
    }
  }

  return result.reverse().join('');
}
