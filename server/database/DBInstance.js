import Database from "./Database.js";

// Get the singleton instance of the database
const dbInstance = await Database.getInstance();

// Create a new instance of the Database class
const db = new Database(dbInstance);

// Export the instance with database methods
export default db;