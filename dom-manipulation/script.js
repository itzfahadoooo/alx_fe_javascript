// Initial quotes array
let quotes = [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Motivation" }
];

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `${randomQuote.text} — ${randomQuote.category}`;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Show a quote when page loads
showRandomQuote();
