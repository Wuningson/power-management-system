import dotEnv from 'dotenv';

dotEnv.config();

function normalizePort() {
  const port = process.env.PORT || '';
  const normalPort = parseInt(port, 10);
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

  const jwtToken = process.env.JWT_TOKEN;

  if (!jwtToken) {
    console.log(`Invalid jwt token`);
    process.exit(1);
  }

  const bigChainDbUrl = process.env.BIGCHAIN_DATABASE_URL;
  if (!bigChainDbUrl) {
    console.log(`Invalid bigchain database url`);
    process.exit(1);
  }

  const publicKey = process.env.PUBLIC_KEY;
  const privateKey = process.env.PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    console.log(`Invalid bigchain database setup`);
    process.exit(1);
  }

  return {
    port,
    apiPath,
    jwtToken,
    publicKey,
    privateKey,
    databaseUrl,
    bigChainDbUrl,
  };
}
