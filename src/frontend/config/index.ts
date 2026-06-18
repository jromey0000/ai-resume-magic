export const config = {
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  STRAPI_API_KEY: import.meta.env.VITE_STRAPI_API_KEY,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
};

export default config;
