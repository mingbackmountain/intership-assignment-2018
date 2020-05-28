module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/features/**/domain/entities/*.js"]
};
