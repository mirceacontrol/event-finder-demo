document.getElementById("search-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const keyword = document.getElementById("search-input").value.trim().toLowerCase();
  const city = document.getElementById("city-input").value.trim().toLowerCase();
  const date = document.getElementById("date-input").value;

  const events = await searchEvents(keyword, city, date);
  displayResults(events);
});

async function searchEvents(keyword, city, date) {
  try {
    const res = await fetch("events.json");
    const allEvents = await res.json();

    let filtered = allEvents;
    if (keyword)
      filtered = filtered.filter(ev => ev.name.toLowerCase().includes(keyword));
    if (city)
      filtered = filtered.filter(ev => ev.city.toLowerCase().includes(city));
    if (date)
      filtered = filtered.filter(ev => ev.date === date);

    return filtered;
  } catch {
    return [];
  }
}

function displayResults(events) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (!events.length) {
    container.innerHTML = "<p>No events found.</p>";
    return;
  }

  events.forEach(ev => {
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = `
      <div class="event-title">${ev.name}</div>
      <div class="event-meta">${ev.date} – ${ev.venue}, ${ev.city}</div>
      <div><a href="${ev.url}" target="_blank">View Event</a></div>
    `;
    container.appendChild(div);
  });
}
