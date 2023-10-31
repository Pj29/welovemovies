// middleware for handling requests that don't match any routes
function notFound(request, response, next) {
  next({ status: 404, message: `Path not found: ${request.originalUrl}` });
}

module.exports = notFound;
