# quadkeytools
A library to calculate unique keys that represent tiles in a quadtree grid for geo-coordinates.  We will call these unique keys quadkeys. This was based off code put out by the Bing maps team <http://msdn.microsoft.com/en-us/library/bb259689.aspx>

## About
### Projection
In order to map a 2D plane on to the globe you have to use projection.  This library uses Mercator projection.  Which looks like this:

![Mercator Projection Image](https://bytebucket.org/steele/quadkeytools/raw/c06bb33e9bdcfb925c84478116dd44694c24c59c/mercator.jpg "Mercator Projection") 

### Detail Level
Once the globe is projected on to a 2D plane we can cut it up into quadrants then quadruple it's area and cut each quadrant into subquadrants.  Each time the plane is increased in size we increase the detail level of each quadrant.  

### QuadkeyTools
Every time we increase the detail level we mark each subquadrant with a 0, 1, 2, or 3.  Looks something like this:

![Quadtree](https://bytebucket.org/steele/quadkeytools/raw/c06bb33e9bdcfb925c84478116dd44694c24c59c/tiles.jpg "Building The Quadtree")

## Installation
    npm install quadkeytools

## Usage
### locationToQuadkey( location, detail )
Get the quadkey for lat,lng at a specific detail

    var Quadkey = requre('quadkeytools')
      , location = { lat: 40.01234, lng: -160.02324 }
      , detail = 16
      , key = Quadkey.locationToQuadkey(location, detail);

### bbox( quadkey )
Get the bounding box for a quadkey.  Detail level is inferred by the length of the key.

    var Quadkey = require('quadkeytools')
      , key = '11002122'
      , bbox = Quadkey.bbox(key);

### origin( quadkey )
Get the center origin lat,lng of a quadkey

    var Quadkey = require('quadkeytools')
      , key = '12332110'
      , origin = Quadkey.origin(key)

### inside( location, quadkey )
Check if a lat,lng is within the bounds of a quadkey.  Returns true if the location is inside the quadkey and false otherwise.  Detail level is inferred by the size of the key.

    var Quadkey = require('quadkeytools')
      , key = '00231211'
      , location = { lat: 40.01234, lng: -160.02324 }
      , isInside = Quadkey.inside(location, key);

### children( quadkey )
Get all the children of a quadkey.  This will return an array of keys representing the subquadrants at the next detail level.

    var Quadkey = require('quadkeytools')
      , key = '0123332111'
      , children = Quadkey.children(key);

### sibling( quadkey, direction )
Get a sibling of a quadkey.  This will return the key of a sibling in a particular direction.  Directions can be 'left' 'right' 'up' or 'down'.

    var Quadkey = require('quadkeytools')
      , key = '001'
      , sibling = Quadkey.sibling(key, 'left')

### parent( quadkey )
Get the parent of a quadkey.  This will return the quadkey that represents the parent quadrant in the previous detail level.

    var Quadkey = require('quadkeytools')
      , key = '0012223'
      , parent = Quadkey.parent(key);

### locationToPixel( location, detail )
Convert lat,lng to pixel coordinates.  Note - Pixel coordinates are Integers so precision will be lost.

    var Quadkey = require('quadkeytools')
      , location = { lat: 40.01234, lng: -160.02324 }
      , detailLevel = 10
      , pixel = Quadkey.locationToPixel(location, detailLevel);

### pixelToLocation( pixel, detail )
Convert pixel coordinates to lat,lng.  

    var Quadkey = require('quadkeytools')
      , pixel = { x: 14547, y: 99231 }
      , location = Quadkey.pixelToLocation(pixel, 10);

### pixelToTile( pixel )
Convert pixel coordinates to tile coordinates

    var Quadkey = require('quadkeytools')
      , pixel = { x: 14547, y: 99231 }
      , tile = Quadkey.pixelToTile(pixel);

### tileToPixel( tile )
Convert tile coordinates to pixel coordinates

    var Quadkey = require('quadkeytools')
      , tile = { x: 12, y: 200 }
      , pixel = Quadkey.tileToPixel(tile);

### tileToQuadkey( tile, detail )
Convert tile coordinates to a quadkey at a specific detail level

    var Quadkey = require('quadkeytools')
      , tile = { x: 220, y: 45 }
      , detail = 10
      , key = Quadkey.tileToQuadkey(tile, detail);

### quadkeyToTile( quadkey )
Get the tile coordinates of a quadkey. This will be the coordinates of the corner of the quadkey.

    var Quadkey = require('quadkeytools')
      , key = '000123220'
      , tile = Quadkey.quadkeyToTile(key);

### tileToLocation( tile, detail )
Get the lat,lng coordinates of a tile's corner for a specific detail level.

    var Quadkey = require('quadkeytools')
      , tile = { x: 220, y: 12 }
      , detail = 4
      , location = Quadkey.tileToLocation( tile, detail );