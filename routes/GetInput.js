const express = require('express');
const fs = require('fs');
const readline = require('readline');
const quadkey = require('quadkeytools');
const assets = require('../data/assets.json');
const router = express.Router();

router.get('/getinput', (req, res, next) => {
    if (assets.length === 0) {
        res.send('no assets found...');
        return;
    }
    const alerts = [];

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./data/input/lightning.json', 'utf8'),
            crlfDelay: Infinity,
        })
    
        // go through every line from stream
        rl.on('line', (line) => {

            line = JSON.parse(line);

            // ignore heartbeats
            if (line.flashType !== 9) {
                // get quad from lat/long
                const quad = quadkey.locationToQuadkey({lat: line.latitude, lng: line.longitude}, 12);
                
                // search alerts array
                const alertIndex = alerts.findIndex(alert => alert.quadKey === quad);
                
                // if we don't have one already, search assets and add alert
                if (alertIndex === -1) {
                    const asset = assets.find(obj => obj.quadKey === quad);
                    if (asset !== undefined) {
                        console.log(`lightning alert for ${asset.assetOwner}:${asset.assetName}`);
                        alerts.push(asset);
                    }
                }
            }
            
        }).on('close', () => {
            console.log('done');
            res.send();
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('error while processing your request, please try again later');
    }

})

module.exports = router;