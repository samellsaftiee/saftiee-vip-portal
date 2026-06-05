#!/usr/bin/env node
/**
 * Run this once to generate your admin password hash:
 *   node scripts/hash-password.js yourPassword123
 *
 * Copy the output into ADMIN_PASSWORD_HASH in your .env.local
 */

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\n✅ Ajoutez cette valeur dans votre .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
