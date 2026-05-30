const ADMIN_EMAIL_SUFFIX = '@nebula-corp.com';

function assignRoleFromEmail(email) {
  if (email.endsWith(ADMIN_EMAIL_SUFFIX)) {
    return 'Admin';
  }
  return 'Standard';
}

module.exports = { assignRoleFromEmail, ADMIN_EMAIL_SUFFIX };
