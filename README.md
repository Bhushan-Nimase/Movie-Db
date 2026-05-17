# 🎬 MovieDB

> A dark-themed movie discovery app built with React + Vite, powered by the TMDB API.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=flat&logo=reactrouter&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?style=flat&logo=themoviedatabase&logoColor=white)

---

## 📸 Preview

<!-- Add a screenshot: drag your browser screenshot into this repo on GitHub and paste the link here -->
> _Add a screenshot of your app here_

---

## ✨ Features

- 🎥 **Hero Carousel** — Top 5 trending movies auto-rotate with poster thumbnails and navigation arrows
- 🔍 **Live Search** — Instant dropdown search with poster previews as you type
- 🎞️ **Movie Detail Page** — Backdrop, genres, rating, runtime, tagline, director and full cast
- ❤️ **My List** — Save movies with the heart button, persisted in `localStorage`
- 🌑 **Dark Cinema Theme** — Gold accent palette, film grain noise overlay, custom animated cursor
- 💀 **Skeleton Loaders** — Shimmer placeholders while data fetches
- 📱 **Responsive** — Works on desktop and mobile

---

## 🗂 Project Structure

```
moviedb/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── App.jsx                   # Router + context provider
    ├── main.jsx                  # React DOM entry point
    ├── css/
    │   └── index.css             # Global styles + CSS design tokens
    ├── Components/
    │   ├── Hero.jsx              # Full-viewport hero carousel
    │   ├── MovieCard.jsx         # Reusable card — hover, rating badge, heart
    │   ├── MyList.jsx            # Horizontal saved movies strip
    │   ├── NavBar.jsx            # Fixed nav with live search dropdown
    │   ├── SkeletonGrid.jsx      # Shimmer loading placeholders
    │   └── Cursor.jsx            # Custom gold dot cursor
    ├── pages/
    │   ├── home.jsx              # Home — hero + trending + popular + my list
    │   ├── MovieDetails.jsx      # Detail page — cast, info, my list section
    │   └── favorites.jsx         # My List full grid page
    ├── contexts/
    │   └── MovieContext.jsx      # Global favorites state + localStorage sync
    ├── services/
    │   └── api.js                # All TMDB API calls
    └── utils/
        └── images.js             # TMDB image URL builder helpers
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/moviedb.git
cd moviedb
```

**2. Install dependencies**

```bash
npm install
```

**3. Add your TMDB API key**

Open `src/services/api.js` and replace line 1:

```js
const API_KEY = "your_tmdb_api_key_here";
```

> Get a free key at [themoviedb.org → Settings → API → Create → Developer](https://www.themoviedb.org/settings/api)

**4. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI framework |
| [Vite](https://vitejs.dev) | 7 | Build tool + dev server |
| [React Router](https://reactrouter.com) | v7 | Client-side routing |
| [Lucide React](https://lucide.dev) | 0.469 | Icons |
| [TMDB API](https://developer.themoviedb.org) | v3 | Movie data + images |

---

## 📡 API Reference

All API calls live in `src/services/api.js`:

| Function | TMDB Endpoint | Where Used |
|---|---|---|
| `fetchTrending()` | `/trending/movie/week` | Hero carousel + Trending section |
| `fetchPopular()` | `/movie/popular` | Popular movies section |
| `fetchTopRated()` | `/movie/top_rated` | Available for future use |
| `fetchUpcoming()` | `/movie/upcoming` | Available for future use |
| `fetchMovieDetail(id)` | `/movie/{id}?append_to_response=credits,videos` | Movie detail page |
| `searchMovies(query)` | `/search/movie` | NavBar search dropdown |

---

## 🎨 Theme

All colours are CSS variables in `src/css/index.css`. Change `--accent` to reskin the whole app:

```css
:root {
  --bg:      #080808;   /* page background     */
  --bg3:     #161616;   /* card background     */
  --accent:  #d4a853;   /* gold — change this! */
  --text:    #f0ede8;   /* primary text        */
  --muted:   #888882;   /* secondary text      */
}
```

---

## 📦 Scripts

```bash
npm run dev      # Development server → localhost:5173
npm run build    # Production build  → /dist
npm run preview  # Preview prod build locally
```

---

## 🔮 Roadmap

- [ ] Trailer player (YouTube embed)
- [ ] Genre filter tabs
- [ ] Infinite scroll / pagination
- [ ] Movie recommendations on detail page
- [ ] PWA — install as mobile app

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 👤 Author

**Bhushan Nimase**

[![GitHub](https://img.shields.io/badge/GitHub-Bhushan--Nimase-181717?style=flat&logo=github)](https://github.com/Bhushan-Nimase)

---

> This product uses the TMDB API but is not endorsed or certified by TMDB.
