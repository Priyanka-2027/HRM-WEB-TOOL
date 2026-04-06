export function createSuccessResponse(message, data = {}) {
  return {
    success: true,
    message,
    data,
  };
}
