# Community-App

## Aniverse - Your Anime Rating Community

A community-driven anime ratings website where users can discover, rate, and explore top-rated anime.

## 🌐 Live Website

This site is hosted on GitHub Pages. To access it:

**URL Format:** `https://[username].github.io/[repository-name]/`

For this repository: `https://sasori1454.github.io/Community-App/`

### Troubleshooting 404 Errors

If you're getting a 404 error when trying to access the site:

1. **Verify GitHub Pages is enabled:**
   - Go to repository Settings → Pages
   - Ensure "Source" is set to deploy from a branch (typically `main`)
   - Wait 1-2 minutes after any changes for the site to rebuild

2. **Check the correct URL:**
   - Username and repository names are case-sensitive in the URL
   - Use lowercase: `https://sasori1454.github.io/Community-App/`

3. **Clear browser cache:**
   - Hard refresh: Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)

## 📁 Project Structure

- `index.html` - Main landing page (lowercase is required for GitHub Pages)
- `style.css` - Styling for the website
- `script.js` - JavaScript functionality
- `ANIVERSE (1).png` - Logo image
- `.nojekyll` - Disables Jekyll processing on GitHub Pages

## 🚀 Features

- Rate your favorite anime
- View top 10 community rankings
- Integration with Google Sheets for data storage
- Responsive design
- Dark theme

## 💻 Local Development

To run locally:

```bash
# Clone the repository
git clone https://github.com/Sasori1454/Community-App.git
cd Community-App

# Start a local server (Python)
python -m http.server 8000

# Or use Node.js http-server
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.