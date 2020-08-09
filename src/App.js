import React, { useState, useEffect } from 'react';

let cacheFactorialValue = {};
let factorialWorker = {};

// check web worker available in browser
if (window.Worker) {
  factorialWorker = new Worker('./workers/factorial.js');
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [resultValue, setResultValue] = useState('0');

  // work as component unmount
  // if we not remove the cache factorial value, it will make the memory leaks
  useEffect(() => {
    return () => {
      cacheFactorialValue = {};
    };
  }, []);

  // when calculate value is ready this hook will call and set the value
  factorialWorker.onmessage = (e) => {
    if (e && e.data) {
      cacheFactorialValue[Number(inputValue)] = e.data; // cache calculate value
      setResultValue(e.data);
    }
  };

  const handlingForm = function (e) {
    e.preventDefault();
    let value = Number(inputValue);

    // input value validation
    if (!(typeof value === 'number' && Number.isInteger(value))) {
      alert('Enter Valid Integer Number');
      return;
    }

    // search in cache. if found never call the calculateFactorial function again
    cacheFactorialValue[value] ? setResultValue(cacheFactorialValue[value]) : calculateFactorial();
  };

  const calculateFactorial = function () {
    // call service worker file for calculation
    factorialWorker.postMessage({ number: inputValue });
  };

  // if web work not abailable return this message
  if (!window.Worker) {
    return <h1>Update Your Browser</h1>;
  }

  return (
    <div>
      <h1>Factorial Calculator</h1>
      <form onSubmit={handlingForm}>
        <input
          type="number"
          placeholder="Enter a number..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <br />
        <button>Calculate Factorial</button>
      </form>
      <h2 style={{ wordBreak: 'break-all' }}>Factorial: {resultValue}</h2>
    </div>
  );
}

export default React.memo(App);
