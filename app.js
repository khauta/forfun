const router = require('./lib/core/index.cjs.js');

// set vars for login

router.config.setUrl('http://192.168.8.1');
router.config.setUsername('admin');
router.config.setPassword('Technomath');

async function myAsync(data)  {
    const loggedIn = await router.admin.isLoggedIn();
          if (!loggedIn) {
            // If we aren't, login
            await router.admin.login();
          }

          // crazy test duo

          // pass the random # to the content
          // data.content = data.content + `${Math.floor(100000 + Math.random() * 900000)}`;
          let parsedData = data;
          
          const stats = await router.ussd.sendUssdCommand(parsedData); //getMobileNetworkInfo();//
          const stats2 = await router.ussd.getUssdStatus();
          console.log(stats2);
          return stats;
};
// particular use case for sanity check [preliminary test]
myAsync("*111*100#").then(val => console.log(val));