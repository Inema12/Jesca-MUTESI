# CodeBridge API

Simple, plain Node.js + Express + MySQL backend for the Intango TSS Backend
Development Practical Assessment. Nothing fancy on purpose — every file is
easy to read top to bottom so your team can explain any part of it during
the live challenge.

## 1. Setup

```bash
# 1. Install dependencies
npm install

# 2. Create the database and tables
mysql -u root -p < db.sql

# 3. Copy the env file and fill in your MySQL password + a JWT secret
cp .env.example .env

# 4. Run the server
npm start
```

Server runs at `http://localhost:5000`.

## 2. React frontend

The React client is in `frontend/` and demonstrates both JSONPlaceholder
practice pages and the CodeBridge API integration.

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. Start the backend first so
registration, login, courses, enrollment, and the protected dashboard can
make requests to `http://localhost:5000/api`.

Useful frontend routes include `/courses`, `/login`, `/register`,
`/dashboard`, `/users`, `/posts`, and `/posts/:id`.

## 3. Folder structure

```
src/
  config/db.js              -> MySQL connection pool
  middleware/auth.js        -> checks the JWT on protected routes
  middleware/errorHandler.js-> catches unexpected errors
  controllers/               -> the actual logic for each feature
  routes/                     -> maps URLs to controller functions
  server.js                   -> starts Express and wires everything together
```

## 4. How each assessment requirement is covered

**1. Authentication and User Management**
- `POST /api/auth/register` validates full_name/email/password, hashes the
  password with bcrypt, saves the user.
- `POST /api/auth/login` checks the password with bcrypt, then signs a JWT
  containing the user's `id` and `role`.
- `GET /api/auth/profile` is protected by `middleware/auth.js`, which
  rejects requests with no token (401), an invalid token (401), or an
  expired token (401, with a distinct message).

**2. Course Management, Search and Pagination**
- `GET /api/courses` supports `search`, `category`, `sort` (`price_asc` /
  `price_desc`), `page`, and `limit`. Offset is calculated as
  `(page - 1) * limit`.
- `GET /api/courses/:id` returns 404 if the course doesn't exist.
- All values go through `?` placeholders (parameterized queries) — never
  string-concatenated into SQL — to prevent SQL injection.

**3. Course Enrollment and Database Transactions**
- `POST /api/enrollments` wraps the enrollment insert in a MySQL
  transaction (`beginTransaction` / `commit` / `rollback`).
- Duplicate enrollment is blocked at the database level by the
  `unique_enrollment` constraint on `(user_id, course_id)`; the code
  catches that specific MySQL error and returns 409.
- `GET /api/enrollments/my-courses` uses a SQL `JOIN` between
  `enrollments` and `courses`.
- `DELETE /api/enrollments/:courseId` lets a student drop a course.

**4. API Testing and Error Handling**
- Import `postman/CodeBridge.postman_collection.json` into Postman. It
  already includes success cases and the required failure cases: missing
  fields, wrong password, no token, course not found, duplicate
  enrollment.
- Status codes used throughout: 200, 201, 400, 401, 404, 409, 500 (403 is
  easy to add — see note below).

**5. Live Practical Challenge**
Common asks and where to make the change:
- *"Add the role to the JWT"* — already done in `authController.js`
  (`login` function), so be ready to explain it.
- *"Add course sorting"* — see the `sort` handling in
  `courseController.js`.
- *"Restrict a route to admins only" (403)* — add a small check after
  `verifyToken`, e.g.:
  ```js
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  ```
- *"Fix a transaction bug"* — look at `enrollCourse` in
  `enrollmentController.js`: every code path either calls `commit()` or
  `rollback()`, and the connection is always `release()`d.

## 5. Pushing to GitHub

```bash
git init
git add .
git commit -m "CodeBridge API - initial backend implementation"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`.env` is already in `.gitignore` so your database password and JWT
secret never get committed.
