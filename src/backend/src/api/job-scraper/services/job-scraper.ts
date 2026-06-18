import * as cheerio from 'cheerio';

interface ExtractedJobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: string | null;
  source: string;
  url: string;
}

interface JobBoardParser {
  name: string;
  match: (url: string) => boolean;
  parse: ($: cheerio.CheerioAPI, url: string) => Partial<ExtractedJobData>;
}

const greenhouseParser: JobBoardParser = {
  name: 'Greenhouse',
  match: (url) => url.includes('greenhouse.io') || url.includes('boards.greenhouse.io'),
  parse: ($, _url) => {
    const title =
      $('h1').first().text().trim() ||
      $('[class*="job-title"]').first().text().trim() ||
      $('title').text().split(' at ')[0]?.trim() ||
      '';

    const companyMatch = $('title')
      .text()
      .match(/at\s+(.+?)(?:\s*-|$)/);
    const company =
      companyMatch?.[1]?.trim() || $('[class*="company"]').first().text().trim() || '';

    const location =
      $('[class*="location"]').first().text().trim() ||
      $('div')
        .filter((_, el) => $(el).text().toLowerCase().includes('location'))
        .first()
        .text()
        .replace(/location[:\s]*/i, '')
        .trim();

    const mainContent =
      $('#content').html() ||
      $('main').html() ||
      $('[class*="job-description"]').html() ||
      $('body').html() ||
      '';

    const $content = cheerio.load(mainContent);
    const description = $content.text().trim();

    const requirements: string[] = [];
    const responsibilities: string[] = [];

    $('h2, h3, h4, strong').each((_, el) => {
      const headerText = $(el).text().toLowerCase();
      const $list = $(el).nextAll('ul').first();

      if (headerText.includes('requirement') || headerText.includes('qualification')) {
        $list.find('li').each((_, li) => {
          requirements.push($(li).text().trim());
        });
      } else if (
        headerText.includes('responsibilit') ||
        headerText.includes('you will') ||
        headerText.includes('what you')
      ) {
        $list.find('li').each((_, li) => {
          responsibilities.push($(li).text().trim());
        });
      }
    });

    const salaryMatch = description.match(
      /\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*(?:per|\/)\s*(?:year|hour|annum))?/i
    );
    const salary = salaryMatch?.[0] || null;

    return {
      title,
      company,
      location,
      description,
      requirements,
      responsibilities,
      salary,
      source: 'Greenhouse',
    };
  },
};

const leverParser: JobBoardParser = {
  name: 'Lever',
  match: (url) => url.includes('lever.co') || url.includes('jobs.lever.co'),
  parse: ($, url) => {
    const title =
      $('h2').first().text().trim() || $('[class*="posting-headline"] h2').text().trim() || '';

    const company = $('[class*="company-name"]').text().trim() || url.split('/')[3] || '';

    const location = $('[class*="location"]').first().text().trim() || '';

    const description =
      $('[class*="posting-description"]').text().trim() || $('main').text().trim() || '';

    const requirements: string[] = [];
    const responsibilities: string[] = [];

    $('h3').each((_, el) => {
      const headerText = $(el).text().toLowerCase();
      const $list = $(el).nextUntil('h3', 'ul');

      if (headerText.includes('requirement') || headerText.includes('qualification')) {
        $list.find('li').each((_, li) => {
          requirements.push($(li).text().trim());
        });
      } else if (headerText.includes('responsibilit')) {
        $list.find('li').each((_, li) => {
          responsibilities.push($(li).text().trim());
        });
      }
    });

    const salaryMatch = description.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?/);
    const salary = salaryMatch?.[0] || null;

    return {
      title,
      company,
      location,
      description,
      requirements,
      responsibilities,
      salary,
      source: 'Lever',
    };
  },
};

const linkedInParser: JobBoardParser = {
  name: 'LinkedIn',
  match: (url) => url.includes('linkedin.com/jobs'),
  parse: ($, _url) => {
    const title =
      $('h1').first().text().trim() || $('[class*="job-title"]').first().text().trim() || '';

    const company =
      $('[class*="company-name"]').first().text().trim() ||
      $('a[class*="company"]').first().text().trim() ||
      '';

    const location = $('[class*="location"]').first().text().trim() || '';

    const description =
      $('[class*="description"]').text().trim() || $('#job-details').text().trim() || '';

    return {
      title,
      company,
      location,
      description,
      requirements: [],
      responsibilities: [],
      salary: null,
      source: 'LinkedIn',
    };
  },
};

const genericParser: JobBoardParser = {
  name: 'Generic',
  match: () => true,
  parse: ($, url) => {
    const title = $('h1').first().text().trim() || $('title').text().split(/[-|]/)[0]?.trim() || '';

    const domain = new URL(url).hostname.replace('www.', '').split('.')[0];
    const company = domain.charAt(0).toUpperCase() + domain.slice(1);

    const mainContent =
      $('main').text() || $('article').text() || $('#content').text() || $('body').text() || '';

    const requirements: string[] = [];
    const responsibilities: string[] = [];

    $('ul').each((_, ul) => {
      const prevText = $(ul).prev().text().toLowerCase();
      $(ul)
        .find('li')
        .each((_, li) => {
          const text = $(li).text().trim();
          if (text.length > 10 && text.length < 500) {
            if (prevText.includes('requirement') || prevText.includes('qualification')) {
              requirements.push(text);
            } else if (prevText.includes('responsibilit')) {
              responsibilities.push(text);
            }
          }
        });
    });

    return {
      title,
      company,
      location: '',
      description: mainContent.substring(0, 10000),
      requirements,
      responsibilities,
      salary: null,
      source: 'Web',
    };
  },
};

const parsers: JobBoardParser[] = [greenhouseParser, leverParser, linkedInParser, genericParser];

export default {
  async fetchAndParse(url: string): Promise<ExtractedJobData> {
    if (!url?.startsWith('http')) {
      throw new Error('Invalid URL provided');
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const parser = parsers.find((p) => p.match(url)) || genericParser;
    const extracted = parser.parse($, url);

    return {
      title: extracted.title || '',
      company: extracted.company || '',
      location: extracted.location || '',
      description: extracted.description || '',
      requirements: extracted.requirements || [],
      responsibilities: extracted.responsibilities || [],
      salary: extracted.salary || null,
      source: extracted.source || 'Unknown',
      url,
    };
  },
};
