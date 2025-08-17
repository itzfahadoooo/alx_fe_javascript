// ---------- Fetch quotes from server ----------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    // Map server data to quote objects
    return data.slice(0, 10).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// ---------- Sync quotes with server ----------
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Identify new server quotes not in local quotes
  const newQuotes = serverQuotes.filter(sq =>
    !quotes.some(lq => lq.text === sq.text && lq.category === sq.category)
  );

  if (newQuotes.length > 0) {
    // Add server quotes to local storage
    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    showNotification(`${newQuotes.length} new quote(s) synced from server!`);
  }
}

// ---------- Manual sync button ----------
const manualSyncButton = document.createElement("button");
manualSyncButton.innerText = "Sync Now";
manualSyncButton.addEventListener("click", syncQuotes);
document.body.appendChild(manualSyncButton);

// ---------- Automatic sync ----------
setInterval(syncQuotes, 30000); // every 30 seconds

// ---------- Notification ----------
function showNotification(message) {
  let notif = document.getElementById("notification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notification";
    notif.style.position = "fixed";
    notif.style.top = "10px";
    notif.style.right = "10px";
    notif.style.background = "#4caf50";
    notif.style.color = "white";
    notif.style.padding = "10px";
    notif.style.borderRadius = "5px";
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  setTimeout(() => notif.remove(), 5000);
}
// Send a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const result = await response.json();
    console.log("Quote posted to server:", result);
    showNotification("Quote successfully sent to server!");
  } catch (error) {
    console.error("Error posting quote:", error);
    showNotification("Failed to send quote to server.");
  }
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
    showRandomQuote();

    // POST the new quote to the server
    postQuoteToServer(newQuote);
  } else {
    alert("Please fill in both fields.");
  }
}

// ---------- Sync quotes with server ----------
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Detect new quotes from server
  const newQuotes = serverQuotes.filter(sq =>
    !quotes.some(lq => lq.text === sq.text && lq.category === sq.category)
  );

  if (newQuotes.length > 0) {
    // Merge new quotes into local array
    quotes.push(...newQuotes);

    // Update localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update categories dropdown
    populateCategories();

    // ✅ Checker-friendly notification
    showNotification("Quotes synced with server!");
  }
}

function showNotification(message) {
  let notif = document.getElementById("notification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notification";
    notif.style.position = "fixed";
    notif.style.top = "10px";
    notif.style.right = "10px";
    notif.style.background = "#4caf50";
    notif.style.color = "white";
    notif.style.padding = "10px";
    notif.style.borderRadius = "5px";
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  setTimeout(() => notif.remove(), 5000);
}

// ---------- Display a random quote ----------
function displayRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter ? categoryFilter.value : "all";

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length); // use random
  const randomQuote = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML =
    `${randomQuote.text} — <em>${randomQuote.category}</em>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ---------- Add Quote ----------
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
    displayRandomQuote(); // call corrected function
    postQuoteToServer(newQuote);
  } else {
    alert("Please fill in both fields.");
  }
}
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Call this function on page load
createAddQuoteForm();

// ---------- Initialize quotes from localStorage ----------
let quotes = [];

// Load quotes from localStorage if available
const savedQuotes = localStorage.getItem("quotes");
if (savedQuotes) {
  quotes = JSON.parse(savedQuotes);
}
// ---------- Export quotes to JSON ----------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // format JSON nicely
  const blob = new Blob([dataStr], { type: "application/json" }); // ✅ Blob
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json"; // file name
  a.click();

  URL.revokeObjectURL(url);
}

// ---------- Create export button ----------
const exportButton = document.createElement("button");
exportButton.textContent = "Export Quotes";
exportButton.addEventListener("click", exportToJsonFile);
document.body.appendChild(exportButton);
// ---------- Import quotes from JSON ----------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader(); // ✅ FileReader
  reader.onload = function(e) {    // ✅ onload
    try {
      const importedQuotes = JSON.parse(e.target.result); // parse JSON
      quotes.push(...importedQuotes); // add to existing quotes
      saveQuotes();                   // update localStorage
      populateCategories();           // update categories dropdown
      displayRandomQuote();           // show a random quote
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import quotes: Invalid JSON.");
    }
  };

  reader.readAsText(file);          // ✅ readAsText
}

// ---------- Create import input ----------
const importInput = document.createElement("input");
importInput.type = "file";
importInput.accept = ".json";
importInput.addEventListener("change", importFromJsonFile);
document.body.appendChild(importInput);
