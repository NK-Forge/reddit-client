# Post Reader

Post Reader is a React and Redux application that lets users browse public post data, filter by category, search posts, and view top comments for selected posts.

This project was built as part of the Codecademy Reddit client portfolio project.

## Live Project

Deployment URL will be added after the app is deployed.

## Repository

GitHub repository URL will be added after the repository is pushed.

## Wireframes

### Desktop Layout

```text
 ------------------------------------------------------------
| Header                                                     |
| NK Forge Coursework                                        |
| Post Reader                         [ Search posts... ][ ] |
| Browse popular posts, filter, and search public post data. |
 ------------------------------------------------------------
| [ r/popular ] [ r/webdev ] [ r/reactjs ] [ r/gaming ]      |
 ------------------------------------------------------------
| Showing r/popular                                          |
 ------------------------------------------------------------
| [thumbnail]  r/subreddit - Posted by u/author              |
|              Post title                                    |
|              upvotes - comments                            |
|              [View discussion] [Show comments]             |
|                                                            |
|              Top Comments                                  |
|              comment card                                  |
 ------------------------------------------------------------
```

### Mobile Layout

```text
 ----------------------------
| Header                     |
| Post Reader                |
| Description                |
| [ Search posts... ]        |
| [ Search ]                 |
 ----------------------------
| [ r/popular ] [ r/webdev ] |
| [ r/reactjs ] [ r/gaming ] |
 ----------------------------
| Showing r/popular          |
 ----------------------------
| [thumbnail]                |
| r/subreddit - author       |
| Post title                 |
| upvotes - comments         |
| [View discussion]          |
| [Show comments]            |
 ----------------------------
```

## Technologies Used

- React
- Redux Toolkit
- React Redux
- Vite
- JavaScript
- HTML
- CSS
- Reddit public JSON endpoints

## Features

- Users see an initial list of posts when the app loads.
- Users can filter posts by category.
- Users can search for posts by keyword.
- Users can view post metadata, including subreddit, author, upvotes, and comment count.
- Users can open the original post discussion in a new browser tab.
- Users can expand a post to view top comments.
- Users can use the app on desktop and mobile screen sizes.
- The app includes loading and error states for post and comment requests.

## Current Categories

- r/popular
- r/webdev
- r/reactjs
- r/gaming

## API Notes

This app currently uses Reddit public JSON endpoints for read-only educational use.

Example endpoints:

```text
https://www.reddit.com/r/popular.json
https://www.reddit.com/search.json?q=react
https://www.reddit.com/r/reactjs/comments/{postId}/{slug}.json
```

No client secret is stored in the frontend application.

## Future Work

- Add React Router for dedicated post detail pages.
- Add more subreddit/category options.
- Add saved/favorite posts.
- Add sorting options such as hot, new, and top.
- Add stronger automated test coverage.
- Add end-to-end tests.
- Improve accessibility testing.
- Deploy the project and update the live URL.

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project folder:

```bash
cd reddit-client
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

## Scripts

```bash
npm run dev
```

Starts the local Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

## Project Status

Current status: MVP in progress.

Completed:

- Initial React and Vite setup
- Redux store setup
- Post fetching
- Subreddit filtering
- Search
- Responsive styling
- Expandable comments panel

Remaining:

- Unit tests
- End-to-end tests
- Deployment
- Final README URLs
