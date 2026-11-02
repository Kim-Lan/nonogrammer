module.exports = {
  apps: [
    {
      name: 'nonogrammer',
      port: '3002',
      exec_mode: 'cluster',
      instances: '1',
      listen_timeout: 15000,
      kill_timeout: 10000,
      cwd: '/var/www/nonogrammer.com/',
      script: './.output/server/index.mjs',
      node_args: ['--env-file=/var/www/nonogrammer.com/.env'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
