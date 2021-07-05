import https from 'https';

const USERNAME = 'username'
const PASSWORD = 'password'

function runRequest(url, options) {
    console.log('runRequest', url, options);
    return new Promise((resolve, reject)=>{
        http.get(url, options, (err, res, body) => {
            if (err) { 
                reject(err);
            } else {
                 resolve(body);
            }
        });
    })
}
try {
    const tokenResult = await runRequest(`https://myurl/getToken?username=${USERNAME}&password=${PASSWORD}`, { headers:{} });
    console.log('got Token', tokenResult);
    const myprofile = await runRequest(`https://myurl/myprofile?`, { headers:{"Authorization":`Bearer ${tokenResult.access_oken}`} });
    console.log('my profile', myprofile);

} catch(err) {
    console.error(err.statusCode, err.statusMessage, err.toString());
}
