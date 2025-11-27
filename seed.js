/**
 * Database Seeding Script
 * 
 * This script seeds the database with fake users and tasks using the faker package.
 * Users are created with realistic fake data, and tasks are randomly associated to users.
 * 
 * Usage: npm run seed
 */

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const config = require("./config");
const User = require("./users/user.model");
const Task = require("./tasks/task.model");
const Hash = require("./utils/hash");
const { GENDER_LIST } = require("./utils/constants");
const {
  TASK_STATUS,
  TASK_PRIORITY,
  getStatusValue,
  getPriorityValue
} = require("./tasks/task.enum");

// Configuration
const NUM_USERS = 20; // Number of users to create
const MIN_TASKS_PER_USER = 2; // Minimum tasks per user
const MAX_TASKS_PER_USER = 8; // Maximum tasks per user

/**
 * Generate a random date of birth (between 18 and 80 years old)
 */
function generateDateOfBirth() {
  const minAge = 18;
  const maxAge = 80;
  const birthYear = new Date().getFullYear() - faker.number.int({ min: minAge, max: maxAge });
  const birthMonth = faker.number.int({ min: 0, max: 11 });
  const birthDay = faker.number.int({ min: 1, max: 28 }); // Use 28 to avoid month-end issues
  return new Date(birthYear, birthMonth, birthDay);
}

/**
 * Generate a random due date (between past and future dates)
 */
function generateDueDate() {
  const daysOffset = faker.number.int({ min: -30, max: 60 }); // -30 to +60 days
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
}

/**
 * Create fake users
 */
async function createUsers() {
  console.log(`Creating ${NUM_USERS} users...`);
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const phone = faker.phone.number();
    const gender = faker.helpers.arrayElement(GENDER_LIST);
    const dateOfBirth = generateDateOfBirth();
    const password = "Password123"; // Default password for seeded users
    const hashedPassword = await Hash.hashKey(password);

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      password: hashedPassword,
      verified: true, // Set verified to true for seeded users
      active: true // Set active to true for seeded users
    });

    users.push(user);
  }

  const savedUsers = await User.insertMany(users);
  console.log(`✓ Created ${savedUsers.length} users`);
  return savedUsers;
}

/**
 * Create fake tasks associated to users
 */
async function createTasks(users) {
  console.log(`Creating tasks for users...`);
  const tasks = [];
  let totalTasks = 0;

  for (const user of users) {
    // Random number of tasks per user
    const numTasks = faker.number.int({ min: MIN_TASKS_PER_USER, max: MAX_TASKS_PER_USER });

    for (let i = 0; i < numTasks; i++) {
      const status = faker.helpers.arrayElement(TASK_STATUS);
      const priority = faker.helpers.arrayElement(TASK_PRIORITY);
      const statusValue = getStatusValue(status);
      const priorityValue = getPriorityValue(priority);

      const task = new Task({
        title: faker.lorem.sentence({ min: 3, max: 8 }).slice(0, -1), // Remove period
        description: faker.lorem.paragraph({ min: 2, max: 5 }),
        status,
        priority,
        statusValue,
        priorityValue,
        dueDate: faker.datatype.boolean({ probability: 0.7 }) ? generateDueDate() : undefined, // 70% chance of having a due date
        user: user._id
      });

      tasks.push(task);
      totalTasks++;
    }
  }

  // Insert tasks in batches for better performance
  const batchSize = 50;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Task.insertMany(batch);
  }

  console.log(`✓ Created ${totalTasks} tasks`);
}

/**
 * Main seeding function
 */
async function seed() {
  try {
    console.log("Starting database seeding...\n");

    // Connect to database
    await mongoose.connect(config.database.URI);
    console.log(`✓ Connected to database: ${config.database.URI}\n`);

    // Clear existing data (optional - uncomment if you want to clear before seeding)
    // console.log("Clearing existing data...");
    // await Task.deleteMany({});
    // await User.deleteMany({});
    // console.log("✓ Cleared existing data\n");

    // Create users
    const users = await createUsers();
    console.log("");

    // Create tasks
    await createTasks(users);
    console.log("");

    console.log("✓ Seeding completed successfully!");
    console.log(`  - Users: ${users.length}`);
    const taskCount = await Task.countDocuments();
    console.log(`  - Tasks: ${taskCount}`);

    // Close database connection
    await mongoose.connection.close();
    console.log("\n✓ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seed();

