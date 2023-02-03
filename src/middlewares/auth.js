export const authenticate = (next) => (root, args, context, info) => {
  if (!context.auth) {
    throw new Error('Not authenticated');
  }

  return next(root, args, context, info);
};
