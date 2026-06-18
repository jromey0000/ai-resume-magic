/**
 * user-resume router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/user-resumes',
      handler: 'user-resume.find',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/user-resumes/:id',
      handler: 'user-resume.findOne',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/user-resumes',
      handler: 'user-resume.create',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/user-resumes/:id',
      handler: 'user-resume.update',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/user-resumes/:id',
      handler: 'user-resume.delete',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
