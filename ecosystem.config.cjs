module.exports = {
  apps: [
    {
      name: 'nonogrammer',
      port: '3002',
      exec_mode: 'cluster',
      instances: 'max',
      cwd: '/var/www/nonogrammer.com/',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
