const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your real key

document.getElementById("search-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const keyword = document.getElementById("search-input").value;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=k156BSaQ1r0q4CvsJy9krPXyqoy3IsaZ&keyword=${keyword}&size=5`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResults(data._embedded?.events || []);
  } catch (err) {
    console.error("Error fetching events:", err);
    document.getElementById("results").innerHTML = "<p>Failed to fetch events.</p>";
  }
});

function displayResults(events) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (events.length === 0) {
    container.innerHTML = "<p>No events found.</p>";
    return;
  }

  events.forEach(event => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${event.name}</h3>
      <p>${event.dates.start.localDate}</p>
      <p>${event._embedded?.venues[0]?.name || "No venue info"}</p>
      <a href="${event.url}" target="_blank">View Event</a>
      <hr/>
    `;
    container.appendChild(div);
  });
}
