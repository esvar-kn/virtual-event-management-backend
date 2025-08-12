# Virtual Event Management Backend 🎤

## Overview ✨

A **Node.js** and **Express** REST API for managing virtual events. This backend enables secure user authentication, role-based access, event creation and registration, email notifications, and robust error handling. The architecture emphasizes scalability and security, with clear separation between attendee and organizer roles.

## Features 🚀

- **User Registration & Authentication** 🔐  
    Secure sign-up and login using hashed passwords and JWT tokens.

- **Role-Based Access Control** 🛡️  
    Users can be attendees or organizers. Organizers manage events; attendees register for events.

- **Event Management** 📅  
    Organizers can create, update, and delete events. All users can view and register for events.

- **Event Registration & Attendee Management** 📝  
    Authenticated users can register for events. Organizers can view attendee lists.

- **Email Notifications** 📧  
    Users receive confirmation emails upon successful event registration.

- **Consistent Error Handling** ⚠️  
    API responses include descriptive error messages and HTTP status codes.

## Technology Stack 🛠️

- **Node.js**, **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Nodemailer** for email notifications
- **dotenv** for environment configuration

## API Endpoints 📡

### User Endpoints 👤

| Method | Endpoint               | Access      | Description                          | Request Body Example                                                                                                  |
|--------|-----------------------|-------------|--------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| POST   | `/api/users/register` | Public      | Register a new user                  | <pre>{<br>  "name": "Jane Doe",<br>  "email": "jane@example.com",<br>  "password": "securePassword123"<br>}</pre>    |
| POST   | `/api/users/login`    | Public      | Authenticate user, returns JWT token | <pre>{<br>  "email": "jane@example.com",<br>  "password": "securePassword123"<br>}</pre>                             |

### Event Endpoints 🎟️

| Method | Endpoint                        | Access        | Description                                 | Request Body Example                                                                                                  |
|--------|---------------------------------|---------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| POST   | `/api/events`                   | Organizer     | Create a new event                          | <pre>{<br>  "title": "Tech Conference 2024",<br>  "description": "A virtual tech conference.",<br>  "date": "2024-08-01T10:00:00Z",<br>  "location": "Online",<br>  "capacity": 100<br>}</pre> |
| GET    | `/api/events`                   | Public        | List all events                             | Not Applicable                                                                                                                  |
| GET    | `/api/events/:id`               | Public        | Get event by ID                             | Not Applicable                                                                                                                  |
| PUT    | `/api/events/:id`               | Organizer     | Update an event                             | <pre>{<br>  "title": "Updated Title",<br>  "description": "Updated description"<br>}</pre>                           |
| DELETE | `/api/events/:id`               | Organizer     | Delete an event                             | Not Applicable                                                                                                                  |
| POST   | `/api/events/:id/register`      | Authenticated | Register for an event                       | Not Applicable                                                                                                                  |
| GET    | `/api/events/:id/registrations` | Organizer     | List all attendees for an event             | Not Applicable                                                                                                                  |

**Authenticated** endpoints require the `Authorization: Bearer <token>` header.  
**Organizer** endpoints require the user to have the `organizer` role.

## Authentication 🔑

- Authenticate via `/api/users/login` to receive a JWT.
- Use the JWT in the `Authorization` header for protected endpoints:

        ```
        Authorization: Bearer <your_token>
        ```

- JWT secret and expiration are set via environment variables.

## Data Models 🗂️

### User 👥

- **name:** String, required
- **email:** String, required, unique, valid email
- **password:** String, hashed, min length 6
- **role:** Enum ["attendee", "organizer"], default "attendee"

### Event 🎫

- **title:** String, required
- **description:** String, required
- **date:** Date, required
- **location:** String, required
- **organizer:** Reference to user, required
- **attendees:** Array of user references
- **capacity:** Number, required
- **status:** Enum ["scheduled", "cancelled", "completed"], default "scheduled"

## Email Notifications 📬

- Users receive confirmation emails after registering for events.
- Email service is configured via environment variables using Nodemailer.

## Error Handling 🛑

API responses follow a consistent error structure:

```json
{
    "error": "ValidationError",
    "message": "Email is required."
}
```

Common error responses:

- **400 Bad Request:** Invalid input or missing fields
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource does not exist
- **500 Internal Server Error:** Unexpected server error

## Project Structure 🗃️

| File/Folder           | Purpose                                      |
|-----------------------|----------------------------------------------|
| app.js                | Main server, app setup, routes, MongoDB      |
| controllers/          | Business logic for users and events          |
| routes/               | API route definitions                        |
| models/               | Mongoose schemas for users and events        |
| middlewares/          | JWT authentication and role-based access     |
| utils/emailService.js | Email notification helpers                   |
| .env                  | Environment variables                        |
| package.json          | Project dependencies and scripts             |
| README.md             | Project documentation                        |

## Getting Started 🏁

### 1. Clone and Install 🧑‍💻

```bash
git clone <repository-url>
cd virtual-event-management-backend
npm install
```

### 2. Configure Environment Variables ⚙️

Create a `.env` file and set the following:

```
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
JWT_EXPIRATION=1d

# Nodemailer credentials
EMAIL_SERVICE=gmail
EMAIL_USER=<your_email_address>
EMAIL_PASS=<your_email_app_password>
```

### 3. Run the Server (Development) 🏗️

```bash
npm run dev
```

### 4. Run the Server (Production) 🚦

```bash
npm start
```

### 5. API Usage 📲

Use Postman or similar tools to interact with `/api/users` and `/api/events`.

## License 📄

This project is open source under the MIT License.

For issues or contributions, please open a pull request or contact the maintainer.