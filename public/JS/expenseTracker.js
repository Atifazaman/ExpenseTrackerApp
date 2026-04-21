const formContainer = document.getElementById("formContainer");
const PlusBtn = document.getElementById("plusBtn");
const addBtn = document.getElementById("addBtn");
const formCloseBtn = document.getElementById("formCloseBtn");
const form = document.getElementById("form");
const ulExpense=document.getElementById("expenseList")
const ulIncome=document.getElementById("incomeList")
const filterType = document.getElementById("filterType");
const leftBtn = document.getElementById("leftBtnIcon");
const rightBtn = document.getElementById("rightBtnIcon");
const incomeContainer = document.querySelector(".incomeDateList");
const expenseContainer = document.querySelector(".expenseDateList");
const searchInput = document.getElementById("searchInput");
let searchQuery = "";
const suggestionsBox = document.getElementById("suggestionsBox");

let currentFilter = "daily"; 
let currentDate = new Date();

filterType.addEventListener("change", () => {
  currentFilter = filterType.value;
  currentDate = new Date();   
  updateDateUI();             
  loadData();
});

const categoryIcons = {
  food: "🍔",
  travel: "✈️",
  salary: "💰",
  shopping: "🛒",
  transport: "🚗",
  movies: "🎬",
  medicine: "💊",
  electricity:"💡",
  rent: "🏠",
  fuel: "⛽"
};

const BASE_URL = "http://localhost:3000/expensetracker";
let editId = null;

function createList(data) {
  const li = document.createElement("li");

  if (data.typeSelect === "income")
  li.classList.add("incomeLi");
else
  li.classList.add("expenseLi");

  li.dataset.id = data.id;
  li.dataset.type = data.typeSelect;
  li.dataset.title = data.title;
  li.dataset.amount = data.amount;
  li.dataset.category = data.category;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.textContent = "Delete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.textContent = "Edit";

  const left = document.createElement("div");
left.classList.add("left");

const category = document.createElement("span");
category.textContent = `${categoryIcons[data.category] || ""} ${data.category}`;

const title = document.createElement("span");
title.textContent = data.title;

left.append(category, title);

const amount = document.createElement("span");
amount.classList.add("amount");

if (data.typeSelect === "income") {
  amount.textContent = `+${data.amount}`;
} else {
  amount.textContent = `-${data.amount}`;
}

li.append(left, amount, editBtn, deleteBtn);

  if (data.typeSelect === "income") {
    ulIncome.appendChild(li);
  } else {
    ulExpense.appendChild(li);
  }
}

async function loadData() {
  try {
    const response = await axios.get(
      `${BASE_URL}?filter=${currentFilter}&date=${currentDate.getTime()}`
    );
    const data = response.data;
    const filteredData = (data.transactions || []).filter(item =>
  item.title.toLowerCase().includes(searchQuery) ||
  item.category.toLowerCase().includes(searchQuery)
);

showSuggestions(filteredData, searchQuery);
    ulIncome.innerHTML = "";
    ulExpense.innerHTML = "";

    let totalIncome = data.totalIncome || 0;
let totalExpense = data.totalExpense || 0;

  if (data.transactions && data.transactions.length > 0) {
  data.transactions.forEach(item => {

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery);

    if (
      currentFilter === "daily" &&
      (!searchQuery || matchesSearch)
    ) {
      createList(item);
    }

  });
}
    
  if (
  currentFilter === "daily" &&
  searchQuery && 
  data.transactions.filter(item =>
    item.title.toLowerCase().includes(searchQuery) ||
    item.category.toLowerCase().includes(searchQuery)
  ).length === 0
) {
  ulIncome.innerHTML = "<p>No matching income</p>";
  ulExpense.innerHTML = "<p>No matching expense</p>";
}
    
 if (currentFilter === "daily") {
  incomeContainer.style.display = "block";
  expenseContainer.style.display = "block";
} else {
  incomeContainer.style.display = "none";
  expenseContainer.style.display = "none";

  
  ulIncome.innerHTML = "";
  ulExpense.innerHTML = "";
}
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("balance").textContent =
      (totalIncome - totalExpense).toFixed(2);

  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
    return;
  }

  updateDateUI();
  loadData();
});

async function add(obj) {
  try {
    formContainer.style.display = "none";
    await axios.post(`${BASE_URL}/add`, obj);
    await loadData();
  } catch (error) {
    console.log(error);
  }
}
async function update(obj) {
  try {
    formContainer.style.display = "none";
    await axios.put(`${BASE_URL}/update/${editId}`, obj);
    await loadData(); 
    form.expenseIncome.disabled = false;
    editId = null;
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const expenseIncomeSelect = e.target.expenseIncome.value;
  const category = e.target.category.value;
  const title = e.target.title.value;
  const amount = Number(e.target.amount.value);

  const obj = {
    typeSelect: expenseIncomeSelect,
    category: category,
    title: title,
    amount: amount,
  };
 
if (editId) {
  await update(obj);
} else {
  await add(obj);
}
form.reset()
});

document.body.addEventListener("click", async (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("deleteBtn")) {
  try {
  await axios.delete(`${BASE_URL}/delete/${id}`);
  await loadData();
} catch (error) {
  console.log(error);
}
  } else if (e.target.classList.contains("editBtn")) {
    formContainer.style.display = "flex";
    addBtn.textContent = "Update";

    form.expenseIncome.value = li.dataset.type;
    form.expenseIncome.disabled=true
    form.title.value = li.dataset.title;
    form.category.value = li.dataset.category;
    form.amount.value = li.dataset.amount;

    
    editId = id;
  }
});

PlusBtn.addEventListener("click", () => {
  formContainer.style.display = "flex";
   addBtn.textContent = "Add";
  form.expenseIncome.disabled = false;
  editId = null;
});
formCloseBtn.addEventListener("click", () => {
  formContainer.style.display = "none";
   form.expenseIncome.disabled = false; 
  editId = null; 
});

function updateDateUI() {
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const dateNumber = document.getElementById("dateNumber");
  const monthEl = document.querySelector("#monthYear p:nth-child(1)");
  const yearEl = document.querySelector("#monthYear p:nth-child(2)");

 
  monthEl.textContent = month;
  yearEl.textContent = year;

  if (currentFilter === "daily") {
    dateNumber.style.display = "block";
    dateNumber.textContent = day;
  } else if(currentFilter==="monthly") {
    dateNumber.style.display = "none";
    monthEl.style.display = "block";
  } else{
    monthEl.style.display="none"
    dateNumber.style.display = "none";
  }
}
leftBtn.addEventListener("click", () => {
  if (currentFilter === "daily") {
    currentDate.setDate(currentDate.getDate() - 1);
  } else if (currentFilter === "monthly") {
    currentDate.setMonth(currentDate.getMonth() - 1);
  } else {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
  }
  updateDateUI();
  loadData();
});

rightBtn.addEventListener("click", () => {
  if (currentFilter === "daily") {
    currentDate.setDate(currentDate.getDate() + 1);
  } else if (currentFilter === "monthly") {
    currentDate.setMonth(currentDate.getMonth() + 1);
  } else {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
  }
  updateDateUI();
  loadData();
});

 searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  loadData();
});

function showSuggestions(data, query) {
  suggestionsBox.innerHTML = "";

if (!query) {
  suggestionsBox.innerHTML = "";
  return;
}

  const suggestions = new Set();

  data.forEach(item => {
  if (item.title.toLowerCase().includes(query)) {
    suggestions.add(item.title);
  }
  if (item.category.toLowerCase().includes(query)) {
    suggestions.add(item.category);
  }
});

if (suggestions.size === 0) {
  const div = document.createElement("div");
  div.classList.add("suggestionDiv")
  div.textContent = "No results found";
  div.style.padding = "5px";
  div.style.color = "gray";

  suggestionsBox.appendChild(div);
  return;
}
 
  suggestions.forEach(text => {
    const div = document.createElement("div");
    div.textContent = text;
    div.classList.add("suggestion-item");

    div.addEventListener("click", () => {
      searchInput.value = text;
      searchQuery = text.toLowerCase();
      suggestionsBox.innerHTML = "";
      loadData();
    });

    suggestionsBox.appendChild(div);
  });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchContainer")) {
    suggestionsBox.innerHTML = "";
  }
});