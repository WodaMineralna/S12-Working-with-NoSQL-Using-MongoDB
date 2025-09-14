# Node.js Course - S12 Working with NoSQL & Using-MongoDB

Practice code for Section 12 - Working with NoSQL & Using-MongoDB, part of the course "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)" by Maximilian Schwarzmüller.

This project covers:
- Connecting a Node.js app to MongoDB using the official driver
- Working with documents and collections instead of SQL tables
- Performing CRUD operations with MongoDB (insert, query, update, delete)
- Managing relations by storing references between documents
- Managing secrets and connection URIs with environment variables
- Running MongoDB locally with Docker Compose (for demo/testing)
- Connecting to a hosted MongoDB Atlas cluster (for production/remote use)

# Project type
- Independently implemented while following a Node.js course, writing all functionalities from scratch and extending the project with personal improvements.

## Tech Stack
- Node.js
- Express.js
- JavaScript (ES6+)
- MongoDB
- MongoDB Atlas
- Docker
- dotenv
- Nodemon
  
# How to Run

### 1) Clone the repo
```bash
git clone https://github.com/S12-Working-with-NoSQL-Using-MongoDB
cd ./S12-Working-with-NoSQL-Using-MongoDB
```

---

### 2) Environment variables

#### 2.1) Copy the example file
```bash
cp .env.example .env
```
> Note: **`USE_MONGODB_ATLAS`** variable must be set to _`false`_

---

## 3) Run the app via Docker (already installed)

#### 1. Make sure your Docker app is running

#### 2. Start MongoDB with Docker Compose
   ```bash
   docker compose up -d
   ```
   - Creates database `shop`

#### 3. Run the app
   ```bash
   npm install
   node .\app.js
   ```

#### 4. Stop the container
   ```bash
   docker compose down -v
   ```

#### 5. Reset database (remove data + re-run init scripts)
   ```bash
   docker compose down -v && docker compose up -d
   ```

---

## Testing DB Connection
A helper script is included to quickly test DB connectivity

```bash
npm run test:db
```

Expected output:
```

===== DB connection OK =====

[will be implemented soon]

```

---

## NPM Scripts

- **`npm start` / `node .\app.js`** → start the Node app
- **`npm run test:db`** → run DB connectivity test (`scripts/test-db.mjs`)
- **`npm run db:up`** → start MongoDB container in background
- **`npm run db:down`** → stop MongoDB container
- **`npm run db:reset`** → reset database (drop volume + re-init)

---

## Notes
- `.env` is ignored by Git; only `.env.example` is committed