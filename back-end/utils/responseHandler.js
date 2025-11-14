export const successResponse = (res, statusCode = 200, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode = 500, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const paginatedResponse = (res, statusCode = 200, data, page, limit, total) => {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: Number(limit),
    },
  });
};

export const createdResponse = (res, message, data) => {
  return successResponse(res, 201, message, data);
};

export const noContentResponse = (res) => {
  return res.status(204).send();
};

export const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, 401, message);
};

export const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, 403, message);
};

export const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, 404, message);
};

export const validationErrorResponse = (res, errors) => {
  return errorResponse(res, 400, 'Validation failed', errors);
};
