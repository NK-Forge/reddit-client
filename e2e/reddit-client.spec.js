import { expect, test } from '@playwright/test';

const createPostListing = (post) => ({
  data: {
    children: [
      {
        data: {
          id: post.id,
          title: post.title,
          author: post.author,
          subreddit: post.subreddit,
          ups: post.ups,
          num_comments: post.comments,
          permalink: post.permalink,
          url: post.url,
          thumbnail: 'self',
          preview: {
            images: [
              {
                source: {
                  url: post.image,
                },
              },
            ],
          },
        },
      },
    ],
  },
});

const createCommentsListing = () => [
  {},
  {
    data: {
      children: [
        {
          kind: 't1',
          data: {
            id: 'comment-e2e-1',
            author: 'comment_tester',
            body: 'This is an end-to-end test comment.',
            ups: 12,
          },
        },
      ],
    },
  },
];

test.beforeEach(async ({ page }) => {
  await page.route('https://www.reddit.com/**', async (route) => {
    const url = route.request().url();

    if (url.includes('/r/popular/comments/post-popular/e2e_popular_post/.json')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(createCommentsListing()),
      });
      return;
    }

    if (url.includes('/r/popular.json')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(
          createPostListing({
            id: 'post-popular',
            title: 'Popular E2E post',
            author: 'popular_user',
            subreddit: 'popular',
            ups: 100,
            comments: 9,
            permalink: '/r/popular/comments/post-popular/e2e_popular_post/',
            url: 'https://example.com/popular',
            image: 'https://example.com/popular.jpg',
          })
        ),
      });
      return;
    }

    if (url.includes('/r/webdev.json')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(
          createPostListing({
            id: 'post-webdev',
            title: 'Webdev E2E post',
            author: 'webdev_user',
            subreddit: 'webdev',
            ups: 250,
            comments: 18,
            permalink: '/r/webdev/comments/post-webdev/e2e_webdev_post/',
            url: 'https://example.com/webdev',
            image: 'https://example.com/webdev.jpg',
          })
        ),
      });
      return;
    }

    if (url.includes('/search.json')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(
          createPostListing({
            id: 'post-search',
            title: 'React search E2E post',
            author: 'search_user',
            subreddit: 'reactjs',
            ups: 75,
            comments: 5,
            permalink: '/r/reactjs/comments/post-search/e2e_search_post/',
            url: 'https://example.com/search',
            image: 'https://example.com/search.jpg',
          })
        ),
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ data: { children: [] } }),
    });
  });
});

test('loads an initial list of posts', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /post reader/i })).toBeVisible();
  await expect(page.getByText('Popular E2E post')).toBeVisible();
  await expect(page.getByText(/u\/popular_user/i)).toBeVisible();
});

test('filters posts by subreddit category', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /r\/webdev/i }).click();

  await expect(page.getByText('Webdev E2E post')).toBeVisible();
  await expect(page.getByText(/u\/webdev_user/i)).toBeVisible();
});

test('searches posts by keyword', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel(/search posts/i).fill('react');
  await page.getByRole('button', { name: /^search$/i }).click();

  await expect(page.getByText('React search E2E post')).toBeVisible();
  await expect(page.getByText(/search results for "react"/i)).toBeVisible();
});

test('expands comments for a post', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /show comments/i }).click();

  await expect(page.getByText(/this is an end-to-end test comment/i)).toBeVisible();
  await expect(page.getByText(/u\/comment_tester/i)).toBeVisible();
});