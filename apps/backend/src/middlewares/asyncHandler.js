/** Express 4 helper — forwards async route errors to errorHandler. */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
