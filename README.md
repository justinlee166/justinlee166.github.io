# Justin Lee Portfolio

A clean, static React + Vite portfolio for [JustinLee.net](https://JustinLee.net). The site is frontend-only and designed for GitHub Pages deployment.

## Local Setup

```bash
npm install
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

The production build is generated in `dist/`.

## Preview

```bash
npm run preview
```

## Deploy

The project is configured with Vite `base: "/"` for the custom domain `JustinLee.net`.

```bash
npm run deploy
```

The deploy script builds the app and publishes `dist/` with `gh-pages`.

## Custom Domain

The root `CNAME` and `public/CNAME` files are both set to:

```text
JustinLee.net
```

Keeping `public/CNAME` ensures the custom domain file is copied into `dist/` during deployment.

## Where to Edit Content

- Projects: `src/data/projects.js`
- Experience entries: `src/data/experience.js`
- Profile/contact buttons: `src/components/ProfileLinks.jsx`
- Intro and about copy: `src/components/Intro.jsx` and `src/components/About.jsx`
- Resume viewer: `src/components/Resume.jsx`
- Skills: `src/data/skills.js`

## Resume PDF

The resume button points to:

```text
/assets/resume.pdf
```

The current resume PDF is stored at:

```text
public/assets/resume.pdf
```
