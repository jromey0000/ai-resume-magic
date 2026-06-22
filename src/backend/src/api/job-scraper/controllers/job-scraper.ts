import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async scrape(ctx) {
    const { url } = ctx.request.body;

    if (!url) {
      return ctx.badRequest('URL is required');
    }

    try {
      const jobScraper = strapi.service('api::job-scraper.job-scraper');
      const result = await jobScraper.fetchAndParse(url);

      return {
        data: result,
        meta: {
          scraped_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      strapi.log.error('Job scraper error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Invalid URL')) {
          return ctx.badRequest(error.message);
        }
        if (error.message.includes('Failed to fetch')) {
          return ctx.badRequest(
            'Could not fetch the job posting. The URL may be invalid or the site may be blocking requests.'
          );
        }
      }

      return ctx.internalServerError('Failed to scrape job posting');
    }
  },
});
