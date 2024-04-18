module.exports = {
  apps: [
    {
      name: 'ALX Bot',
      exec_mode: 'cluster',
      instances: '1',
      script: './index.js'
    }
  ]
}
