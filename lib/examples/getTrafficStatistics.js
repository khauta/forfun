const router = require('../dist/index.cjs');

router.config.setUrl('http://192.168.8.1');
router.config.setUsername('admin');
router.config.setPassword('Technomath');

async function checkStatistics() {
  // Check if we are logged into the router already
  const loggedIn = await router.admin.isLoggedIn();
  if (!loggedIn) {
    // If we aren't, login
    await router.admin.login();
  }
  const stats = await router.dialup.dial(0);
  console.log(stats);
}

checkStatistics();
