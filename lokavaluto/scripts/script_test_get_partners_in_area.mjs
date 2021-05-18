import https from 'https';

const URL_MAP = 'https://odoo12.dev.lokavaluto.fr/lokavaluto_api/public/partner_map/search_in_area';
const LAT_MIN = '0.5';
const LAT_MAX = '1.5';
const LON_MIN = '0.5';
const LON_MAX = '1.5';

function runPost(url, jsonData, options) {
    const data = JSON.stringify(jsonData);
    console.log('runRequest', url, data, options);
    return new Promise((resolve, reject) => {
        const req = https.request(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                },
                ...options
            },
            (res) => {
                let data = '';
                
                res.on('data', chunk => {
                  data += chunk.toString('utf8');
                });
                res.on('end', () => {
                  resolve(JSON.parse(data));
                });
            }
        );

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}
function runGet(url, options) {
    console.log('runRequest', encodeURI(url), options);
    return new Promise((resolve, reject) => {
        https.get(encodeURI(url), options, (res) => {
          let data = '';
          res.on('data', chunk => {
            data += chunk.toString('utf8');
          });
          res.on('end', () => {
            resolve(JSON.parse(data));
          });
          res.on('error', (error) => {
              reject(error);
          });
        });
    });
}

try {
    let res = await runPost(
        `${URL_MAP}`,
        {
	    bounding_box: {
  	        minLat: `${LAT_MIN}`,
	        maxLat: `${LAT_MAX}`,
                minLon: `${LON_MIN}`,
                maxLon: `${LON_MAX}`
            }
        },
    );
    console.log('partner info : ', res);

} catch (err) {
    console.error(err.statusCode, err.statusMessage, err.toString(), err.stack);
}

