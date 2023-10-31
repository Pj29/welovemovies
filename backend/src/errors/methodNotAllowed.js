// middleware for responding with a 405 method not allowed when a resource is being requested incorrectly
function methodNotAllowed(request, response, next) {
  next({
    status: 405,
    message: `${request.method} not allowed for ${request.originalUrl}`,
  });
}

module.exports = methodNotAllowed;
