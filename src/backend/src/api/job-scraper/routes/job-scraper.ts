export default {
  routes: [
    {
      method: 'POST',
      path: '/job-scraper/scrape',
      handler: 'job-scraper.scrape',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
