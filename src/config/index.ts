import dotenv from 'dotenv';

dotenv.config();

const ListenPort = parseInt(process.env.LISTEN_PORT);

export const Config = {
  MySQL: {
    Host: process.env.MYSQL_HOST,
    User: process.env.MYSQL_USER,
    Password: process.env.MYSQL_PASSWORD,
    Database: process.env.MYSQL_DATABASE,
  },

  ListenPort: isNaN(ListenPort) ? 8080 : ListenPort,
};
