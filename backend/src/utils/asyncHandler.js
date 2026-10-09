/**
 * Wrapper para controladores async.
 * NOTA: Express 5 ya maneja errores async automáticamente,
 * pero este helper es útil si en el futuro se degrada a Express 4.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;