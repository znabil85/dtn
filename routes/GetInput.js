const express = require('express');
const fs = require('fs');
const readline = require('readline');
const quadkey = require('quadkeytools');
const assets = require('../data/assets.json');
const router = express.Router();

router.get('/getinput', (req, res, next) => {
    if (assets.length === 0) {
        res.status(500).send('no assets found...');
        return;
    }
    const HEARTBEAT = 9;
    const alerts = new Map();

    //Building asset map
    const assetMap = new Map();
    assets.forEach((asset) => {
        assetMap.set(asset.quadKey, {
            assetName: asset.assetName,
            assetOwner: asset.assetOwner,
            quadKey: asset.quadKey
        })
    })

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./data/input/lightning.json', 'utf8'),
            crlfDelay: Infinity,
        })
    
        // go through every line from stream
        rl.on('line', (line) => {

            line = JSON.parse(line);

            // ignore heartbeats
            if (line.flashType !== HEARTBEAT) {
                // get quad from lat/long
                const quad = quadkey.locationToQuadkey({lat: line.latitude, lng: line.longitude}, 12);
                
                // search alerts map
                const alertIndex = alerts.get(quad);
                
                // if we don't have one already, search assets and add alert
                if (alertIndex === undefined) {
                    const asset = assetMap.get(quad);
                    if (asset !== undefined) {
                        console.log(`lightning alert for ${asset.assetOwner}:${asset.assetName}`);
                        alerts.set(asset.quadKey, {
                            assetName: asset.assetName,
                            assetOwner: asset.assetOwner,
                            quadKey: asset.quadKey
                        });
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