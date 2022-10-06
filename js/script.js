const list = document.querySelector(".list");
const input = document.querySelector(".input");
const options = document.querySelectorAll(".options-item");
const optionsWrapper = document.querySelector(".options");
let receivedData;

function displayAutocomplete(options, data) {
  const arr = data.items;
  for (let i in arr) {
    options[i].textContent = arr[i].name;
  }
}

function clearAutocomplete(options) {
  for (let item of options) {
    item.textContent = "";
  }
}

function debounce(cb, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, args);
    }, delay);
  };
}

function getData(string) {
  fetch(`https://api.github.com/search/repositories?q=${string}&per_page=5`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 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",
    },
  })
    .then((result) => result.json())
    .then((data) => {
      displayAutocomplete(options, data);
      receivedData = data;
    })
    .catch((err) => console.log(err));
}

function createListItem(data) {
  let el = document.createElement("li");
  el.classList.add("list-item");

  let textArea = document.createElement("div");
  textArea.classList.add("list-item__text-area");

  for (let i = 0; i < 3; i++) {
    let p = document.createElement("p");
    p.classList.add("list-item__text");
    p.textContent = `${data[i][0]}: ${data[i][1]}`;
    textArea.appendChild(p);
  }
  el.appendChild(textArea);

  let button = document.createElement("button");
  button.classList.add("close-btn");
  el.appendChild(button);

  return el;
}

let delayGetData = debounce(getData, 200);

input.addEventListener("input", (e) => {
  if (input.value == "") {
    clearAutocomplete(options);
    optionsWrapper.classList.toggle("hidden");
  } else {
    delayGetData(input.value);
    if (optionsWrapper.classList.contains("hidden")) {
      optionsWrapper.classList.toggle("hidden");
    }
  }
});

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-btn")) {
    const elem = e.target.closest(".list-item");
    list.removeChild(elem);
  }
});

optionsWrapper.addEventListener("click", (e) => {
  const obj = {};
  const targetName = e.target.textContent;

  for (let item of receivedData.items) {
    if (item.name === targetName) {
      obj["Name"] = targetName;
      obj["Owner"] = item.owner.login;
      obj["Stars"] = item.stargazers_count;
    }
  }

  list.appendChild(createListItem(Object.entries(obj)));
  input.value = "";
  clearAutocomplete(options);
  optionsWrapper.classList.toggle("hidden");
});
