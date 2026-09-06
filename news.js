const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

const FALLBACK_ARTICLES = [
  {
    title: "Global markets steady as investors weigh rate outlook",
    description: "Major indices held firm this week as traders parsed fresh commentary from central bankers on the path ahead for interest rates.",
    urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    url: "#",
    source: { name: "Market Watch" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "New space telescope begins mapping distant galaxies",
    description: "Scientists released the first batch of images from the observatory's deep-field survey, revealing thousands of previously uncharted galaxies.",
    urlToImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    url: "#",
    source: { name: "Science Daily" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "City unveils plan for expanded public transit network",
    description: "The proposal adds two new light-rail lines and dozens of bus routes, aiming to cut commute times across the metro area by 2030.",
    urlToImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
    url: "#",
    source: { name: "City Desk" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "Startup unveils battery breakthrough for electric vehicles",
    description: "The company says its new solid-state cell design could extend EV range by up to 40 percent while cutting charging times significantly.",
    urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    url: "#",
    source: { name: "Tech Pulse" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "National team clinches dramatic victory in final minutes",
    description: "A last-minute goal sealed the win in front of a sold-out crowd, sending the team through to the next stage of the tournament.",
    urlToImage: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80",
    url: "#",
    source: { name: "Sports Wire" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "Film festival opens with record number of entries",
    description: "Organizers report a sharp rise in independent submissions this year, with entries from over 60 countries competing for top honors.",
    urlToImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    url: "#",
    source: { name: "Culture Now" },
    publishedAt: new Date().toISOString()
  }
];

window.addEventListener("load", () => {
  setDates();
  fetchNews("India");
});

function setDates() {
  const today = new Date();
  document.getElementById("today-date").textContent = today.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  document.getElementById("footer-year").textContent = today.getFullYear();
}

function reload() {
  window.location.reload();
}

function setStatus(html) {
  const container = document.getElementById("cards-container");
  container.innerHTML = `<div class="status-panel" id="status-panel">${html}</div>`;
}

async function fetchNews(query) {
  document.getElementById("section-title").textContent =
    query.charAt(0).toUpperCase() + query.slice(1);

  setStatus(`<i class="fa-solid fa-circle-notch spin"></i>Fetching the latest headlines…`);

  try {
    const res = await fetch(`${url}${encodeURIComponent(query)}&apiKey=${API_KEY}`);
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) throw new Error("No articles returned");
    bindData(data.articles);
  } catch (err) {
    console.warn("Live fetch failed, showing sample stories instead:", err);
    bindData(FALLBACK_ARTICLES, true);
  }
}

function bindData(articles, isFallback = false) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  const usable = articles.filter((a) => a.urlToImage);
  const list = usable.length ? usable : articles;

  if (list.length === 0) {
    setStatus(`<i class="fa-regular fa-face-frown"></i>No stories found. Try another search.`);
    return;
  }

  list.forEach((article) => {
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });

  if (isFallback) {
    const notice = document.createElement("div");
    notice.style.cssText =
      "grid-column:1/-1;font-size:0.8rem;color:var(--secondary-text);display:flex;align-items:center;gap:8px;margin-top:-4px;";
    notice.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation" style="color:var(--amber)"></i> Showing sample stories — live data unavailable in this environment.';
    cardsContainer.prepend(notice);
  }
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");
  const newsBadge = cardClone.querySelector("#news-badge");

  newsImg.src = article.urlToImage || "https://via.placeholder.com/400x200";
  newsImg.alt = article.title || "News image";
  newsTitle.textContent = article.title || "Untitled story";
  newsDesc.textContent = article.description || "";
  newsBadge.textContent = article.source?.name?.split(" ")[0] || "News";

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  });

  newsSource.innerHTML = `<i class="fa-regular fa-clock"></i>${article.source?.name || "Unknown"} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    if (article.url && article.url !== "#") window.open(article.url, "_blank");
  });
}

let curSelectedNav = document.getElementById("Home");
function onNavItemClick(id) {
  const query = id === "Home" ? "India" : id;
  fetchNews(query);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  if (navItem) {
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
  } else {
    curSelectedNav = null;
  }
  document.getElementById("search-text").value = "";
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", runSearch);
searchText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

function runSearch() {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const btn = e.target.querySelector("button");
  btn.innerHTML = '<i class="fa-solid fa-check"></i>';
  input.value = "";
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
  }, 2000);
  return false;
}