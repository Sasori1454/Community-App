const animes = [
    { id: 1, title: "Attack on Titan" },
    { id: 2, title: "Demon Slayer" },
    { id: 3, title: "Jujutsu Kaisen" },
    { id: 4, title: "My Hero Academia" },
    { id: 5, title: "One Piece" },
    { id: 6, title: "Naruto" },
    { id: 7, title: "Death Note" },
    { id: 8, title: "Fullmetal Alchemist" },
    { id: 9, title: "Tokyo Ghoul" },
    { id: 10, title: "Sword Art Online" },
    { id: 11, title: "Hunter x Hunter" },
    { id: 12, title: "Steins;Gate" }
];

let ratings = JSON.parse(localStorage.getItem("animeRatings")) || {};

const animeList = document.getElementById("animeList");
const topList = document.getElementById("topList");

function renderAnimeList() {
    animeList.innerHTML = "";
    animes.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";
        const avg = getAverage(anime.id);
        card.innerHTML = `
      <h3>${anime.title}</h3>
      <p>Average Rating: ${avg.toFixed(1)} ⭐</p>
      <label>Rate:
        <select id="rate-${anime.id}">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>
      <br>
      <button onclick="submitRating(${anime.id})">Submit</button>
    `;
        animeList.appendChild(card);
    });
}

function getAverage(id) {
    const arr = ratings[id] || [];
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function submitRating(id) {
    const value = parseInt(document.getElementById(`rate-${id}`).value);
    if (!ratings[id]) ratings[id] = [];
    ratings[id].push(value);
    localStorage.setItem("animeRatings", JSON.stringify(ratings));
    renderAnimeList();
    fetchTop10FromSheets();
    document.getElementById('top10').scrollIntoView({ behavior: 'smooth' });
}

function renderTopList() {
    const ranked = animes
        .map(a => ({
            ...a,
            avg: getAverage(a.id),
            votes: (ratings[a.id] || []).length
        }))
        .filter(a => a.votes > 0)
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 10);

    topList.innerHTML = "";

    if (ranked.length === 0) {
        topList.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>No ratings yet! Be the first to rate an anime.</p>";
        return;
    }

    ranked.forEach((a, index) => {
        const div = document.createElement("div");
        div.className = "top-card";
        const rankEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
        div.innerHTML = `
            <span class="rank">${rankEmoji}</span>
            <h4>${a.title}</h4>
            <p>${a.avg.toFixed(1)} ⭐ (${a.votes} votes)</p>
        `;
        topList.appendChild(div);
    });
}

function clearLocalStorage() {
    if (confirm("Are you sure you want to clear all ratings? This cannot be undone.")) {
        localStorage.removeItem("animeRatings");
        ratings = {};
        renderAnimeList();
        renderTopList();
        alert("All ratings have been cleared!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderAnimeList();
    fetchTop10FromSheets();
});

async function fetchTop10FromSheets() {
    const topList = document.getElementById('topList');
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDIhZW7onnv21E3jHd5Gc-rlFskYBds9tCwZa_61_mzO-cAfANzJYrtwzvgkte8B924JAwoBx7vuvZ/pub?gid=1344050197&single=true&output=csv';

    try {
        topList.innerHTML = '<p class="loading">🔄 Loading top anime...</p>';
        const response = await fetch(csvUrl + '&timestamp=' + new Date().getTime());
        if (!response.ok) {
            throw new Error('Failed to fetch data: ' + response.status);
        }
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const animeData = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
            if (!matches || matches.length < 2) continue;
            const name = matches[0].replace(/^"|"$/g, '').trim();
            const rating = parseFloat(matches[1]) || 0;
            const votesRaw = matches[2] ? matches[2].replace(/^"|"$/g, '').trim() : '0';
            const votes = parseInt(votesRaw, 10) || 0;
            if (name && rating > 0) {
                animeData.push({ name, rating, votes });
            }
        }
        const top10 = animeData
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);
        if (top10.length > 0) {
            displayTop10(top10);
        } else {
            topList.innerHTML = '<p class="empty-message">No ratings available yet. Be the first to rate!</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        topList.innerHTML = `<p class="error-message">Unable to load top anime. ${error.message}<br><small>Check console for details</small></p>`;
    }
}

function displayTop10(animeList) {
    const topList = document.getElementById('topList');

    if (animeList.length === 0) {
        topList.innerHTML = '<p class="empty-message">No ratings available yet. Be the first to rate!</p>';
        return;
    }

    topList.innerHTML = animeList.map((anime, index) => {
        const rank = index + 1;

        const ratingVal = Number(anime.rating);
        const votesNum = Number.isFinite(anime.votes) ? anime.votes : parseInt(anime.votes || '0', 10) || 0;
        const voteLabel = votesNum === 1 ? 'vote' : 'votes';

        return `
            <div class="top-card">
                <span class="rank">#${rank}</span>
                <h4>${anime.name}</h4>
                <div class="rating-meta">⭐ ${ratingVal.toFixed(2)} avg · 📊 ${votesNum} ${voteLabel}</div>
            </div>
        `;
    }).join('');
}

(function disableLocalVotes() {
    try {
        if (typeof ratings !== 'undefined') ratings = {};
    } catch (_) { }

    window.renderAnimeList = function () {
        const list = document.getElementById('animeList');
        if (list) {
            list.innerHTML = '';
            list.style.display = 'none';
        }
    };

    window.submitRating = function () {
        alert('Ratings are now submitted via the Google Sheet above. Please use the embedded form.');
        const ratingsSection = document.getElementById('ratings');
        if (ratingsSection) ratingsSection.scrollIntoView({ behavior: 'smooth' });
    };

    window.clearLocalStorage = function () {
        alert('Local ratings are disabled. Use the Google Sheet to manage votes.');
    };
})();
