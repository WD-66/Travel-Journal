import type { RequestHandler } from 'express';

const hasRole = (...roles: string[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      next(new Error('Unauthorized', { cause: { status: 401 } }));
      return;
    }

    // if user's roles include admin, call next right away

    // if roles parameters include self
    // query db for post and compare it to user.id

    // check for other roles
    next();
  };
};

// hasRole('user', 'admin', 'self');
export default hasRole;
