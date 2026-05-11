# Post Reader Project Plan

This file tracks the project work for the Codecademy Reddit client portfolio project.

## Project Goal

Build a responsive React and Redux application that allows users to browse public post data, search posts, filter posts by category, and view comments.

## Current Status

MVP built and test coverage added.

The core app is working with post fetching, subreddit filtering, search, responsive styling, and expandable comments. Unit, component, Redux slice, and end-to-end tests have been added.

## Done

- Initialize Vite React project
- Install Redux Toolkit and React Redux
- Create Redux store
- Create posts slice
- Fetch initial posts from r/popular
- Add category/subreddit filtering
- Add search functionality
- Normalize Reddit post data
- Render post cards with:
  - Title
  - Author
  - Subreddit
  - Upvote count
  - Comment count
  - Image/thumbnail when available
  - Link to original discussion
- Add responsive styling
- Create comments slice
- Fetch comments for selected posts
- Add expandable comments panel
- Style post action buttons
- Draft README documentation
- Add unit/component tests with Vitest and React Testing Library
- Add Redux slice tests
- Add Playwright end-to-end tests
- Split unit tests and E2E tests into separate runners
- Add project planning checklist

## In Progress

- Deployment preparation

## To Do

### Deployment

- Push project to GitHub if it has not already been pushed
- Deploy application
- Update README with live URL
- Update README with repository URL

### Polish

- Add empty state polish if desired
- Add stronger user-facing error messages if desired
- Add accessibility review
- Add more categories or sorting options
- Confirm mobile layout across multiple widths
- Confirm behavior in target modern browsers

## Project Requirements Checklist

### Build Requirements

- [x] Build the application using React
- [x] Build the application using Redux
- [x] Version control the application with Git
- [ ] Host the repository on GitHub
- [x] Use a project management tool or project planning file
- [x] Write a README using Markdown

### README Requirements

- [x] Include wireframes
- [x] Include technologies used
- [x] Include features
- [x] Include future work
- [ ] Add live project URL
- [ ] Add repository URL

### App Requirements

- [x] Users can see an initial view of the data when first visiting the app
- [x] Users can search the data using terms
- [x] Users can filter the data based on categories
- [x] Users can view posts
- [x] Users can view comments
- [x] Users can open the original discussion
- [x] Users can use the application on desktop
- [x] Users can use the application on mobile
- [ ] Users can access the application at a deployed URL
- [ ] Users can use the application on all target modern browsers

### Testing Requirements

- [x] Write unit tests for components
- [x] Write end-to-end tests for the application

## Verification Commands

Run unit and component tests:

```bash
npm run test:run
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Build the production version:

```bash
npm run build
```

Suggested full verification:

```bash
npm run test:run
npm run test:e2e
npm run build
```

## Suggested Commit Sequence

1. Commit the working post reader MVP
   - feat: build initial Reddit post reader

2. Commit comments support
   - feat: add expandable Reddit comments

3. Commit README documentation
   - docs: document Reddit client project

4. Commit project planning file
   - docs: add project planning checklist

5. Commit unit/component tests
   - test: add SearchBar component tests
   - test: add PostsList component tests
   - test: add posts slice tests
   - test: add comments slice tests

6. Commit E2E tests
   - test: add Playwright end-to-end tests

7. Commit updated checklist
   - docs: update project checklist

8. Commit deployment updates
   - docs: add deployment links

## Next Immediate Step

Replace the existing README.md and PROJECT_PLAN.md files with the updated versions.

Then run:

```bash
npm run test:run
npm run test:e2e
npm run build
```

If everything passes, commit the documentation updates:

```bash
git add README.md PROJECT_PLAN.md
git commit -m "docs: update project checklist"
```

## Notes

This project currently uses Reddit public JSON endpoints for read-only educational use.

No client secret should be stored in the frontend application.

If future OAuth or authenticated requests are needed, create a backend layer instead of exposing secrets in React.
