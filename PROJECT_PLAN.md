# Post Reader Project Plan

This file tracks the project work for the Codecademy Reddit client portfolio project.

## Project Goal

Build a responsive React and Redux application that allows users to browse public post data, search posts, filter posts by category, and view comments.

## Current Status

MVP in progress.

The core app is working with post fetching, subreddit filtering, search, responsive styling, and expandable comments.

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

## In Progress

- Documentation cleanup
- Requirement checklist alignment

## To Do

### Testing

- Add unit tests for components
- Add unit tests for Redux slices or reducers
- Add tests for loading states
- Add tests for error states
- Add tests for search behavior
- Add tests for comments behavior

### End-to-End Testing

- Choose an end-to-end testing tool
- Add basic test for initial page load
- Add test for search
- Add test for category filtering
- Add test for expanding comments

### Deployment

- Push project to GitHub
- Deploy application
- Update README with live URL
- Update README with repository URL

### Polish

- Add empty state polish
- Add better error messages
- Add accessibility review
- Add more categories or sorting options
- Confirm mobile layout across multiple widths

## Project Requirements Checklist

### Build Requirements

- [x] Build the application using React
- [x] Build the application using Redux
- [ ] Version control the application with Git
- [ ] Host the repository on GitHub
- [ ] Use a project management tool or project planning file
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

- [ ] Write unit tests for components
- [ ] Write end-to-end tests for the application

## Suggested Commit Sequence

1. Commit the working post reader MVP
   - feat: build initial Reddit post reader

2. Commit comments support
   - feat: add expandable Reddit comments

3. Commit README documentation
   - docs: document Reddit client project

4. Commit project planning file
   - docs: add project planning checklist

5. Commit tests
   - test: add Reddit client component tests

6. Commit deployment updates
   - docs: add deployment links

## Next Immediate Step

After README is committed, add this file to the project root as PROJECT_PLAN.md and commit it.

Suggested command:

git add PROJECT_PLAN.md
git commit -m "docs: add project planning checklist"

## Notes

This project currently uses Reddit public JSON endpoints for read-only educational use.

No client secret should be stored in the frontend application.

If future OAuth or authenticated requests are needed, create a backend layer instead of exposing secrets in React.
