document.getElementById("search-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const keyword = document.getElementById("search-input").value.trim().toLowerCase();
  const city = document.getElementById("city-input").value.trim().toLowerCase();
  const date = document.getElementById("date-input").value;

  const events = await searchEvents(keyword, city, date);
  displayResults(events);
});

document.getElementById("view-wishlist").addEventListener("click", showWishlist);

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

function addToWishlist(event) {
  let wishlist = JSON.parse(localStorage.getItem("demoUserWishlist")) || [];
  // Unique by name, date, and venue
  const exists = wishlist.some(
    e =>
      e.name === event.name &&
      e.date === event.date &&
      e.venue === event.venue
  );
  if (!exists) {
    wishlist.push(event);
    localStorage.setItem("demoUserWishlist", JSON.stringify(wishlist));
    alert("Added to wishlist!");
  } else {
    alert("Already in wishlist!");
  }
}

function showWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("demoUserWishlist")) || [];
  displayResults(wishlist, true);
}

function removeFromWishlist(event) {
  let wishlist = JSON.parse(localStorage.getItem("demoUserWishlist")) || [];
  wishlist = wishlist.filter(
    e =>
      !(
        e.name === event.name &&
        e.date === event.date &&
        e.venue === event.venue
      )
  );
  localStorage.setItem("demoUserWishlist", JSON.stringify(wishlist));
  showWishlist();
}

function displayResults(events, isWishlist = false) {
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
      <div class="event-title">
        <span class="icon-ticket"><svg><use href="#icon-ticket"></use></svg></span>
        ${ev.name}
      </div>
      <div class="event-meta">${ev.date} – ${ev.venue}, ${ev.city}</div>
      <div class="event-card-actions">
        <a href="${ev.url}" target="_blank">View Event</a>
        ${
          isWishlist
            ? `<button class="wishlist-btn-remove">
                <span class="icon-remove"><svg><use href="#icon-remove"></use></svg></span>
                Remove from Wishlist
               </button>`
            : `<button class="wishlist-btn">
                <span class="icon-star"><svg><use href="#icon-star"></use></svg></span>
                Add to Wishlist
               </button>`
        }
      </div>
    `;
    container.appendChild(div);

    if (isWishlist) {
      div.querySelector('.wishlist-btn-remove').onclick = () => removeFromWishlist(ev);
    } else {
      div.querySelector('.wishlist-btn').onclick = () => addToWishlist(ev);
    }
  });
}
