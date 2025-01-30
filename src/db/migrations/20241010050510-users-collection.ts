export async function up(db, client) {
  await db.createCollection('users');
}
export async function down(db, client) {
  await db.dropCollection('users');
}
