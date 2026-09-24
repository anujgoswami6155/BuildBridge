# BuildBridge

BuildBridge is a developer collaboration platform designed to help developers discover projects, form teams, recruit contributors, and manage software projects in one place.

The platform provides secure authentication, project management, team collaboration, task tracking, Kanban-style workflows, comments, dashboards, and workspace communication through a modular REST API backend.

## Features

- User registration and authentication
- Secure password hashing with bcrypt
- JWT-based authentication
- Developer and project discovery
- Project creation and management
- Contributor recruitment through applications
- Team collaboration
- Task creation and assignment
- Task status tracking for Kanban workflows
- Project comments and discussions
- Dashboard views for project activity
- MongoDB database integration
- Modular Express REST API
- React-based frontend with client-side routing

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- dotenv

## Project Structure

```text
BuildBridge/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   └── package.json
│
└── README.md
```

## Backend API Modules

The backend exposes the following API modules:

| Module | Base Route | Description |
|---|---|---|
| Authentication | `/api/auth` | Registration, login, and authentication-related operations |
| Projects | `/api/projects` | Create, view, update, and manage projects |
| Applications | `/api/applications` | Manage contributor applications |
| Tasks | `/api/tasks` | Create, assign, update, and track project tasks |
| Comments | `/api/comments` | Add and manage project discussions and comments |
| Dashboard | `/api/dashboard` | Retrieve dashboard and project activity data |

The server also provides a health-check endpoint:

```text
GET /
```

Response:

```text
BuildBridge Server is running!
```

## Data Models

BuildBridge currently includes models for:

- Users
- Projects
- Tasks
- Applications
- Comments

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or later
- npm
- MongoDB, either locally or through MongoDB Atlas
- Git

### Clone the Repository

```bash
git clone https://github.com/anujgoswami6155/BuildBridge.git
cd BuildBridge
```

## Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend in development mode:

```bash
npm run dev
```

Or start it normally:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Available Scripts

### Client

Run these commands from the `client` directory:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint checks.

### Server

Run these commands from the `server` directory:

```bash
npm run dev
```

Starts the backend with Nodemon.

```bash
npm start
```

Starts the backend with Node.js.

## Environment Variables

The backend uses environment variables for configuration.

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port used by the Express server | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/buildbridge` |
| `JWT_SECRET` | Secret used to sign authentication tokens | `your_secure_secret` |

Do not commit your `.env` file to version control.

## Application Architecture

BuildBridge follows a modular full-stack architecture:

```text
React Client
     │
     │ HTTP requests using Axios
     ▼
Express REST API
     │
     ├── Routes
     ├── Controllers
     ├── Services
     ├── Middleware
     └── Mongoose Models
     │
     ▼
MongoDB Database
```

The backend separates routing, controllers, services, middleware, configuration, and data models to keep the application maintainable and scalable.

## Development Workflow

1. Start MongoDB.
2. Start the backend server.
3. Start the frontend development server.
4. Open the frontend in your browser.
5. Register or log in to access BuildBridge features.
6. Create or discover projects.
7. Join teams and manage project tasks.

## Future Improvements

Potential improvements for BuildBridge include:

- Real-time workspace communication with WebSockets
- Email notifications
- Advanced project search and filtering
- Role-based permissions
- File and document sharing
- Activity feeds
- GitHub repository integration
- Automated testing
- API documentation with Swagger
- Production deployment configuration
- Continuous integration and deployment

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes.
4. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

5. Push the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a pull request.

## License

This project is currently available for personal and educational use. Add a specific open-source license, such as the MIT License, if you plan to officially distribute and accept contributions.

## Author

Created by [Anuj Goswami](https://github.com/anujgoswami6155).

## Repository

[BuildBridge on GitHub](https://github.com/anujgoswami6155/BuildBridge)
