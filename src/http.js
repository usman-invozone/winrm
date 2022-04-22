const https = require('https');
const http = require('http');
const xml2jsparser = require('xml2js').parseString;

module.exports.sendHttp = async function (_data, _host, _port, _path, _auth, _params = {protocol: 'http'}) {

    var xmlRequest = _data;
    var options = {
        host: _host,
        port: _port,
        path: _path,
        method: 'POST',
        headers: {
            'Authorization': _auth,
            'Content-Type': 'application/soap+xml;charset=UTF-8',
            'User-Agent': 'NodeJS WinRM Client',
            'Content-Length': Buffer.byteLength(xmlRequest)
        },
    };
    var requestMethod = http;

    if(_params.protocol === 'https') {
        options.rejectUnauthorized = false;
        options.requestCert = true;
        options.agent = false;
        requestMethod = https;
    }

    console.log(options)
    console.log(_params)

    return new Promise((resolve, reject) => {
        var req = requestMethod.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(new Error('Failed to process the request, status Code: ', res.statusCode));
            }
            res.setEncoding('utf8');
            var dataBuffer = '';
            res.on('data', (chunk) => {
                dataBuffer += chunk;

            });
            res.on('end', () => {
                xml2jsparser(dataBuffer, (err, result) => {
                    if (err) {
                        reject(new Error('Data Parsing error', err));
                    }
                    resolve(result);
                });
            });

        });
        req.on('error', (err) => {
            console.log('error', err);
            reject(err);
        });
        if (xmlRequest) {
            req.write(xmlRequest);
        }
        req.end();
        
    });
};
