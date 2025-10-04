const newsContainer = document.getElementById('news-container');
let allNews = [];
let currentFeedIndex = 0;
const itemsPerLoad = 5;

// Feeds RSS via rss2json (proxy gratuito)
const feeds = [
  "https://api.rss2json.com/v1/api.json?rss_url=https://ge.globo.com/rss/feeds/espn/rss.xml",
  "https://api.rss2json.com/v1/api.json?rss_url=https://rss.uol.com.br/feed/esporte.xml"
];

// Alternar sidebar
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
}

// Alternar Dark/Light mode
document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Buscar notícias iniciais
async function fetchNews() {
  newsContainer.innerHTML = "<p>Carregando notícias...</p>";
  allNews = [];

  for (const feed of feeds) {
    try {
      const response = await fetch(feed);
      const data = await response.json();
      allNews.push(...data.items); // guardar todas as notícias para pesquisa e scroll
    } catch (e) {
      newsContainer.innerHTML += `<p style="color:red;">Não foi possível carregar notícias deste feed.</p>`;
    }
  }

  renderNews(0, itemsPerLoad);
}

// Renderizar notícias do índice start ao end
function renderNews(start, count) {
  let html = "";
  const slice = allNews.slice(start, start + count);
  if(slice.length === 0) return;
  slice.forEach(item => {
    html += `
      <article>
        <a href="${item.link}" target="_blank">
          <h2>${item.title}</h2>
          <p>${item.description}</p>
        </a>
      </article>
    `;
  });
  if (start === 0) {
    newsContainer.innerHTML = html;
  } else {
    newsContainer.insertAdjacentHTML('beforeend', html);
  }
}

// Scroll infinito
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    currentFeedIndex += itemsPerLoad;
    renderNews(currentFeedIndex, itemsPerLoad);
  }
});

// Pesquisa de notícias
function filterNews() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allNews.filter(item => item.title.toLowerCase().includes(query));
  let html = "";
  if(filtered.length > 0){
    filtered.forEach(item => {
      html += `
        <article>
          <a href="${item.link}" target="_blank">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
          </a>
        </article>
      `;
    });
  } else {
    html = "<p>Nenhuma notícia encontrada.</p>";
  }
  newsContainer.innerHTML = html;
}

// Atualiza notícias a cada 60 segundos
fetchNews();
setInterval(fetchNews, 60000);