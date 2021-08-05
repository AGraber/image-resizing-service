### Read in German: [link](README.de.md)

---

# image-resizing-service
Example of image resizing service done as part of an assignment.
Written in TypeScript for Node JS.

# Quick start
You can use docker-compose to quickly get this project running in port 8080.
```
docker-compose up
```

Alternatively, configure environment variables appropiately (see `.env.example` file) and build and start manually using the following commands (requires NodeJS installed):

```
npm i # install dependencies
npm run start # build and start
```

# Caches
2 types of image caching are implemented:
- File system cache
- MariaDB / MySQL cache

The code currently only uses the MariaDB, but it can be trivially changed with a few lines of code on `/src/cacheStorage/index.ts`.
A cache interface is defined so implementing another type of cache storage is easy.
