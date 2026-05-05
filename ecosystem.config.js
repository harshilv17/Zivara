module.exports = {
  apps: [
    {
      name: 'zivara-backend',
      script: 'npm',
      args: 'run dev',
      cwd: './backend',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'zivara-frontend',
      script: 'serve',
      args: '-s out -p 3000',
      cwd: './frontend',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
