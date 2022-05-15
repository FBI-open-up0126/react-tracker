const addDataButton = document.querySelector("#add-data-button");
const printDataButton = document.querySelector("#print-data");

const request = indexedDB.open("test", 1);

let db;

request.onupgradeneeded = event => {
  db = event.target.result;
  switch (event.oldVersion) {
    case 0:
      // initialize database
      db.createObjectStore("aTest", { autoIncrement: true });
      alert("Successfully updated database!");
      break;
  }
};

request.onerror = error => {
  console.warn(`Cannot open database! Error: ${error}`);
};

request.onsuccess = () => {
  db = request.result;

  db.onversionchange = () => {
    db.close();
    alert("Database is outdated, please reload the page");
  };
};

request.onblocked = () => {};

addDataButton.onclick = () => {
  const transaction = db.transaction("aTest", "readwrite");
  const objectStore = transaction.objectStore("aTest");
  const request = objectStore.add({ content: "It works!" });

  request.onsuccess = () => {
    alert("Added successful!");
  };
  request.oncomplete = () => {
    alert("Completed!");
  };
  request.onerror = () => {
    alert("Something went wrong!");
  };
};

printDataButton.onclick = () => {
  /** @type {IDBObjectStore} */
  const objectStore = db.transaction("aTest").objectStore("aTest");

  objectStore.openCursor().onsuccess = e => {
    const cursor = e.target.result;

    if (cursor) {
      alert(`the value of content is ${cursor.value.content}`);
    }
  };
};

function test() {
	this++;
}

test.bind(10)();
