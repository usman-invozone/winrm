var winrm = require('../index.js');

async function performTest() {
    try {
        //var result = await winrm.runCommand('mkdir D:\\winrmtest001', '10.xxx.xxx.xxx', 5985, 'username', 'password');
        var result = await winrm.runCommand('ipconfig /all', '10.160.0.35', 'admin', 'A@miN2017', 5986, true, 'https');
        console.log(result);
    } catch (error) {
        console.error(`Exception Occurred: ${error}`);
    }
}

performTest();
