// Mapper for environment variables
export const environment = process.env.NODE_ENV || 'development';
export const port = process.env.PORT || 3030;
export const timezone = process.env.TZ;
export const logDirectory = process.env.LOG_DIR;