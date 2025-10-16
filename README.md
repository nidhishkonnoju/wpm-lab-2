# MEAN Marketing Automation

This is a full-stack marketing automation tool built with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## Technologies Used

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Handlebars for email templates

**Frontend:**
- Angular
- TypeScript
- Tailwind CSS
- ngx-charts for charts
- lucide-angular for icons

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GEMINI-CLI-USER/mean-marketing-automation.git
   cd mean-marketing-automation
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   - In the `backend` directory, create a `.env` file and add the following:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/marketing-automation
     ```

## Running the project

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will be running on `http://localhost:3000`.

2. **Start the frontend development server:**
   ```bash
   cd ../frontend
   npm start
   ```
   The frontend application will be running on `http://localhost:4200`.

## Seeding the database

To seed the database with some initial data, run the following command in the `backend` directory:

```bash
cd backend
npm run seed
```

This will populate the database with sample campaigns, customers, segments, and templates.
"# wpm-lab-2" 
