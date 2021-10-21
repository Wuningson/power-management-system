import dotEnv from 'dotenv';

dotEnv.config();

function normalizePort() {
  const port = process.env.PORT || '';
  const normalPort = parseInt(port);
  if (isNaN(normalPort)) {
    return false;
  }

  return normalPort;
}

export default function getEnvVariables(): EnvironmentVariables {
  let apiPath = process.env.API_PATH;
  const port = normalizePort() || 3000;

  const databaseUrl = process.env.MONGO_URL;
  if (!databaseUrl) {
    console.log(`Invalid database url`);
    process.exit(1);
  }

  if (!apiPath) {
    apiPath = '/api';
  }

  return {
    port,
    apiPath,
    databaseUrl,
  };
}
