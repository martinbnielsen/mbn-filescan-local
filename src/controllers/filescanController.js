/**
 * Handle file scanning
 * @param {*} req 
 * @param {*} res 
 */

exports.showIndex = async function(req, res) {
    var data = {
        url: req.protocol + '://' + req.get('host') + req.originalUrl + 'scan'
    };

    res.render("index", data);
}

exports.scanFile = async function(req, res) {
    var fs   = require('fs');
    var cp = require('child_process');
    var filePath = req.body.filename;
    var path = process.env.CLAMAV_PATH;
    var cmd = process.env.CLAMAV_CMD;
    var r = {}, scan = {};
    var extraId, extraInfo;
    var start = Date.now();

    console.log('START Scan');

    var key = req.header('key');
    console.log('key', key);
 
    // Read extra values from the POST body
    extraId = req.body.extra_id;
    extraInfo = req.body.extra_info;

    try {
        let buffer, binaryData, result;
        if (!(process.env.NODE_ENV === 'development')) {
            // Store the file on disk
            binaryData  = Buffer.from(req.body.content, 'base64');
            fs.writeFileSync(path + filePath, binaryData,  "binary");
            console.log('file write done');

            // Execute the scan command
            try {
                buffer = cp.execSync(cmd + ' "' + path + filePath + '"');
            }
            catch (ex) {
                console.log('clamdscan call failed');
                buffer = ex.stdout;
            }        
          
            // Check for infected files
            result = buffer.toString('utf8');
            let lines = result.split('\n');
            lines.forEach(function(l) {
                let pos = l.indexOf('Infected files:');
                if (pos > -1) {
                    r.infectedFiles = Number(l.substring(pos+'Infected files:'.length));
                }
            });

            // remove the file
            fs.unlinkSync(path + filePath);
        }
        else {
            // Stubbing the file scan
            console.log('Development stub scan, sleeping 2 sec...');
            let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
            await sleep(2000);
            r.infectedFiles = 0;
            result = 'No infected files';
            binaryData  = Buffer.from(req.body.content, 'base64');
            buffer = "development - no real scan";
        }

        // register the scan result in the database
        let scanData = {
            "fileName": filePath,
            "fileSize": binaryData.length,
            "infectedFiles": r.infectedFiles,
            "scanResult": result,
            "extraId" : extraId,
            "extraInfo": extraInfo
        };

        // Return the result
        r.result = r.infectedFiles?"Infected":"Success";
        r.buffer = buffer.toString('utf8');
        console.log('Scan performed', scanData);
    }
    catch (err) {
        res.status(400);
        console.log(err);
        res.send("Unexpected error, please contact support");
    }
    console.log('END Scan (ms) : ', Date.now() - start);
    res.status(200).json(r);
};

exports.showScans = function(req, res) {

    console.log('controller - showScans');

    var key = req.header('key');
    console.log('key', key);

    var r = {scans: "List of scans here is it again"};
    res.json(r);
};
