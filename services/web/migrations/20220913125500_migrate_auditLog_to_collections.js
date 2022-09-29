const runScript = require('../scripts/migrate_audit_logs.js')

exports.tags = ['server-ce', 'server-pro']

exports.migrate = async () => {
  const options = {
    writeConcurrency: 10,
    dryRun: false,
  }
  await runScript(options)
}

exports.rollback = async () => {}
