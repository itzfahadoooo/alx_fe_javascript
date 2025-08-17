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
