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

    // ✅ Update localStorage explicitly
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update categories dropdown
    populateCategories();

    // ✅ Show notification about new server data
    showNotification(`${newQuotes.length} new quote(s) synced from server!`);
  } else {
    // Optional: notify no new quotes
    console.log("No new quotes from server.");
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

