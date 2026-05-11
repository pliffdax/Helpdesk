module.exports = {
  apps: [
    {
      name: "helpdesk-api",
      cwd: __dirname,
      script: "apps/api/dist/server.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
