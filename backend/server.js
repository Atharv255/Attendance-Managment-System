const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/config/logger');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Failed to connect to database: ${error.message}`);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});