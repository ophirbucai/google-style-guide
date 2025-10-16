## google html/css style guide – demo portfolio

This project is a small, single-page developer portfolio that demonstrates practical application of the principles from the Google HTML/CSS Style Guide. It focuses on clean structure, consistent formatting, and a clear separation of concerns across HTML, CSS, and JavaScript.

### what is the google html/css style guide?

The guide defines conventions for authoring HTML and CSS to improve collaboration, readability, and maintainability. It covers formatting (indentation, capitalization), semantics, accessibility, and CSS authoring patterns.

- **reference**: [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)

### what this repo includes

- **`index.html`**: semantic document structure with `header`, `nav`, `main`, `section`, and `footer`.
- **`styles.css`**: structured layout (grid/flex), tokens, and formatting that mirrors the guide.
- **`main.js`**: a minimal, accessible interactive header that cycles through style-guide responsibilities.
- **`PLAN.md`**: a short plan describing goals and constraints.

### key principles showcased

- **https for embedded resources**: all external assets use `https:`.
- **indentation & lowercase**: 2-space indent; lowercase element/attribute/class names.
- **utf-8**: `<meta charset="utf-8">` used.
- **semantics & accessibility**: proper elements, `alt` text, and `aria-live` for the carousel.
- **separation of concerns**: no inline styles/scripts; HTML for structure, CSS for presentation, JS for behavior.
- **class naming**: hyphen-delimited classes with a small `dp-` prefix; avoid ID selectors in CSS.
- **css formatting**: shorthands; a space after property colons; semicolons after declarations; blank line between rules.
- **values**: omit units after `0`; include leading `0`s (e.g., `0.8em`); prefer 3-digit hex when possible.
- **quotations**: single quotes in CSS; no quotes inside `url()`.
- **no `!important`**: use specificity instead.

### try it locally

- Open `index.html` in your browser, or serve the folder with a simple static server.

```bash
# example: python
python3 -m http.server 8080
# then visit http://localhost:8080
```

### interaction notes

- The header includes an accessible carousel of “developer responsibilities”.
- Controls: prev/next/play buttons; keyboard support for ArrowLeft/ArrowRight and Space (play/pause).

### deploy to github pages

This repo is preconfigured to deploy from the `main` branch using GitHub Actions.

1. Push the repository to GitHub.
2. In the repository settings, go to “Pages” and set the source to “GitHub Actions”.
3. On push to `main`, the workflow `.github/workflows/pages.yml` will build and publish the site.
4. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

Notes:

- A `.nojekyll` file is included to disable Jekyll processing.
- Artifacts deploy the repo root; `index.html` must be at the project root.
