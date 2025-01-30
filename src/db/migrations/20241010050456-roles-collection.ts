export async function up(db, client) {
  await db.createCollection('roles');
}
export async function down(db, client) {
  await db.dropCollection('roles');
}
