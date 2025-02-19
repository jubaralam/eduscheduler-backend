# eduscheduler-backend

# User API Documentation

## Overview
This API manages user authentication and profile operations, including registration, login, profile updates, retrieval, and deletion.

---

## Base URL
```
http://yourdomain.com/api/user
```


---

## User Schema
```javascript
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_no: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "instructor" },
  gender: { type: String, default: null },
  city: { type: String, default: null },
  highest_qualification: { type: String, default: null },
  preferred_language: { type: String, default: null },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
```

## API Endpoints

### User Registration
- **Endpoint:** `POST /register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone_no": 1234567890,
    "password": "securepassword",
    "role": "instructor",
    "gender": "male",
    "city": "New York",
    "highest_qualification": "Masters",
    "preferred_language": "English"
  }
  ```
- **Response:**
  ```json
  {
    "message": "you have registered",
    "success": true
  }
  ```

### User Login
- **Endpoint:** `POST /login`
- **Description:** Authenticates a user.
- **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "you have logged in successfully",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "johndoe@example.com"
    }
  }
  ```

### Update User Profile
- **Endpoint:** `PUT /update/:id`
- **Authentication:** Required (`auth` middleware)
- **Request Body:** Any field from the schema except `_id` and `password`.
- **Response:**
  ```json
  {
    "message": "your profile has updated",
    "data": { "updated_user_data" }
  }
  ```

### Get Single User by ID
- **Endpoint:** `GET /:id`
- **Description:** Retrieves a user by ID.
- **Response:**
  ```json
  {
    "data": { "user_data" }
  }
  ```

### Get All Users
- **Endpoint:** `GET /`
- **Authentication:** Required (`auth` and `authorizedAdmin` middlewares)
- **Response:**
  ```json
  {
    "data": [{ "user1" }, { "user2" }, ...]
  }
  ```

### Delete User
- **Endpoint:** `DELETE /delete/:id`
- **Authentication:** Required (`auth` middleware)
- **Response:**
  ```json
  {
    "message": "your account has been deleted"
  }
  ```

## Middleware Used
- **`auth` Middleware**: Ensures the user is authenticated before accessing certain routes.
- **`authorizedAdmin` Middleware**: Restricts access to admin-only routes.

## Notes
- Passwords are stored securely using `bcryptjs`.
- JWT tokens are used for authentication.
- The API follows RESTful principles for resource management.



---




# User & Course API Documentation

## Overview
This documentation provides details about the **User API** and **Course API**, including their schemas, routes, authentication requirements, and responses.


---

## Base URL
```
http://yourdomain.com/api/course
```


---

## User API
### User Schema
```javascript
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_no: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "instructor" },
  gender: { type: String, default: null },
  city: { type: String, default: null },
  highest_qualification: { type: String, default: null },
  preferred_language: { type: String, default: null },
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
```

### User Routes
| Method | Endpoint       | Description               | Authentication |
|--------|---------------|---------------------------|----------------|
| POST   | `/register`   | Register a new user       | No             |
| POST   | `/login`      | User login                | No             |
| PUT    | `/update/:id` | Update user profile       | Yes (Auth)     |
| GET    | `/:id`        | Get a specific user       | No             |
| GET    | `/`           | Get all users             | Yes (Admin)    |
| DELETE | `/delete/:id` | Delete a user account     | Yes (Auth)     |

#### **User Registration**
- **Endpoint:** `POST /register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone_no": 1234567890,
    "password": "securepassword",
    "role": "instructor",
    "gender": "male",
    "city": "New York",
    "highest_qualification": "Masters",
    "preferred_language": "English"
  }
  ```
- **Response:**
  ```json
  {
    "message": "You have registered successfully",
    "success": true
  }
  ```

#### **User Login**
- **Endpoint:** `POST /login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "You have logged in successfully",
    "token": "JWT_TOKEN_HERE",
    "user": { "id": "123", "role": "instructor" }
  }
  ```

---

## Course API
### Course Schema
```javascript
const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  poster: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  mode: { type: String, required: true },
  level: { type: String, required: false, default: "beginner" },
  language: { type: String, required: true }
});

const CourseModel = mongoose.model("course", courseSchema);
module.exports = CourseModel;
```

### Course Routes
| Method | Endpoint         | Description              | Authentication |
|--------|-----------------|--------------------------|----------------|
| POST   | `/create`       | Create a new course      | Yes (Admin)    |
| GET    | `/:id`          | Get a course by ID       | No             |
| GET    | `/`             | Get all courses          | No             |
| PUT    | `/update/:id`   | Update a course          | Yes (Admin)    |
| DELETE | `/delete/:id`   | Delete a course          | Yes (Admin)    |

#### **Create Course**
- **Endpoint:** `POST /create`
- **Request Body:**
  ```json
  {
    "poster": "https://image.url",
    "title": "JavaScript Mastery",
    "description": "Advanced JS Course",
    "mode": "Online",
    "language": "English",
    "level": "Advanced"
  }
  ```
- **Response:**
  ```json
  {
    "message": "New course has been added"
  }
  ```

#### **Get Course by ID**
- **Endpoint:** `GET /:id`
- **Response:**
  ```json
  {
    "data": {
      "_id": "course_id",
      "title": "JavaScript Mastery",
      "description": "Advanced JS Course",
      "mode": "Online",
      "language": "English",
      "level": "Advanced"
    }
  }
  ```

#### **Delete Course**
- **Endpoint:** `DELETE /delete/:id`
- **Response:**
  ```json
  {
    "message": "Course has been deleted"
  }
  ```

---

## Authentication & Authorization
- **JWT Token** is required for protected routes.
- **Admin Role** is required for managing courses.
- **User Authorization:** Users can only update or delete their own profiles.
- **Middleware Used:**
  - `auth` → Verifies JWT token
  - `authorizedAdmin` → Checks if user has admin role

### Error Handling
All errors are returned in the following format:
```json
{
  "error": "Error message here"
}
```

### Status Codes
- `200 OK` → Successful operation
- `201 Created` → Resource created successfully
- `400 Bad Request` → Invalid data
- `401 Unauthorized` → No valid token provided
- `403 Forbidden` → Access denied
- `404 Not Found` → Resource not found
- `500 Internal Server Error` → Unexpected error

---

## Conclusion
This API provides essential endpoints for user authentication and course management. Ensure proper authentication and role-based access control while using the API.




# Lecture API Documentation

## Base URL
```
http://yourdomain.com/api/lecture
```

## Endpoints

### 1. Assign a Lecture
**Endpoint:**
```
POST /assign
```
**Description:** Assigns a lecture to an instructor for a specific course.
**Authorization:** Admin only.

**Request Body:**
```json
{
  "courseId": "string (ObjectId)",
  "instructorId": "string (ObjectId)",
  "topic": "string",
  "start_time": "DateTime",
  "end_time": "DateTime"
}
```

**Response:**
- **200 OK:** Lecture assigned successfully.
- **400 Bad Request:** Missing required fields.
- **404 Not Found:** Instructor not found or invalid.
- **403 Forbidden:** Instructor has an overlapping lecture.
- **500 Internal Server Error:** Server-side error.

---

### 2. Get Lectures for a Specific Course
**Endpoint:**
```
GET /get/:courseId
```
**Description:** Retrieves all lectures assigned to a specific course.
**Authorization:** Admin only.

**Response:**
- **200 OK:** Returns an array of lectures.
- **404 Not Found:** No lectures found for the course.
- **500 Internal Server Error:** Server-side error.

**Sample Response:**
```json
{
  "data": [
    {
      "_id": "string",
      "courseData": [{ "_id": "string", "name": "string" }],
      "instructorId": "string",
      "start_time": "DateTime",
      "end_time": "DateTime"
    }
  ]
}
```

---

### 3. Get All Lectures
**Endpoint:**
```
GET /gets
```
**Description:** Retrieves all assigned lectures.
**Authorization:** Admin only.

**Response:**
- **200 OK:** Returns all lectures.
- **404 Not Found:** No lectures found.
- **500 Internal Server Error:** Server-side error.

---

### 4. Get Lectures Assigned to an Instructor
**Endpoint:**
```
GET /get-assigned/:instructorId
```
**Description:** Retrieves all lectures assigned to a specific instructor.
**Authorization:** None.

**Response:**
- **200 OK:** Returns an array of lectures.
- **404 Not Found:** No lectures found for the instructor.
- **500 Internal Server Error:** Server-side error.

**Sample Response:**
```json
{
  "data": [
    {
      "_id": "string",
      "courseData": [{ "_id": "string", "name": "string" }],
      "instructorId": "string",
      "start_time": "DateTime",
      "end_time": "DateTime"
    }
  ]
}
```

