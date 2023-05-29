// testUtils.js

let currentTestFile = '';

export function setTestFile(testFileName) {
  currentTestFile = testFileName;
}

export function logTestResult(result, description) {
  const testResultsElement = document.getElementById('test-results');
  const headerElement = document.createElement('h2');
  const listItem = document.createElement('li');
  
  if (currentTestFile) {
    headerElement.textContent = currentTestFile;
    testResultsElement.appendChild(headerElement);
    currentTestFile = '';
  }
  
  listItem.textContent = result ? `✓ ${description}` : `✗ ${description}`;
  listItem.style.color = result ? 'green' : 'red';
  testResultsElement.appendChild(listItem);
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function test(description, testFunction) {
  try {
    testFunction();
    logTestResult(true, description);
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(error);
    logTestResult(false, description);
  }
}

export let beforeEachSetupFunction = null;

export function beforeEach(setupFunction) {
  beforeEachSetupFunction = setupFunction;
}
