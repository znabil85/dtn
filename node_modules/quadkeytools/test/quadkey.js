/*global describe:true, it:true, module:true, require:true */
/*jslint white:true, unparam:true, nomen:true */
/*jshint expr: true*/

'use strict';

var should = require('should')
  , path = require('path')
  , quadkey = require(path.join(__dirname, '..', 'lib', 'index'))
  , assert = require('assert');


describe('quadkey', function() {
	describe('locationToPixel', function() {
		it('should convert location to pixel', function() {
			var location = { lat: 40.01234, lng: -160.02324 }
			  , pixel = quadkey.locationToPixel(location, 10);

			pixel.should.have.property('x');
			pixel.x.should.be.an.Int;
			pixel.should.have.property('y');
			pixel.y.should.be.an.Int;
		});
	});
	describe('pixelToLocation', function() {
		it('should convert pixel to location', function() {
			var pixel = { x: 14547, y: 99231 }
			  , location = quadkey.pixelToLocation(pixel, 10);
			location.should.have.property('lat');
			location.lat.should.be.a.Number;
			location.should.have.property('lng');
			location.lng.should.be.a.Number;
		});
	});
	describe('pixelToTile and tileToPixel', function() {
		it('should convert pixel to tile and back', function() {
			var pixel = { x: 14547, y: 99231 }
			  , tile = quadkey.pixelToTile(pixel)
			  , reversePixel = quadkey.tileToPixel(tile);

			tile.should.have.property('x');
			tile.x.should.be.an.Int;
			tile.should.have.property('y');
			tile.y.should.be.an.Int;

			reversePixel.should.have.property('x');
			reversePixel.x.should.be.an.Int;
			reversePixel.should.have.property('y');
			reversePixel.y.should.be.an.Int;

			pixel.x.should.equal(reversePixel.x);
			pixel.y.should.equal(reversePixel.y);
		});
	});
	describe('quadkeyToTile and tileToQuadkey', function(){
		it('should convert quadkey to tile and back', function() {
			var key = '011123'
			  , tile = quadkey.quadkeyToTile(key)
			  , reverseKey = quadkey.tileToQuadkey(tile, key.length);

			tile.should.have.property('x');
			tile.x.should.be.an.Int;
			tile.should.have.property('y');
			tile.y.should.be.an.Int;

			reverseKey.should.be.a.String.and.equal(key);
		});
		it('should throw an error when passed a bad quadkey', function() {
			assert.throws(function(){quadkey.quadkeyToTile('badkey');}, Error);
		});
	});
	describe('tileToLocation', function() {
		it('should convert a tile to location', function() {
			var tile = {x: 123, y: 213}
			  , location = quadkey.tileToLocation(tile, 4);

			location.should.have.property('lat');
			location.lat.should.be.a.Number;
			location.should.have.property('lng');
			location.lng.should.be.a.Number;
		});
	});
	describe('locationToQuadkey', function() {
		it('should convert a location to its quadkey', function() {
			var location = { lat: 4.33807358013887, lng: -133.777255414468 }
			  , key = quadkey.locationToQuadkey(location, 10);

			key.should.be.a.String.and.equal('0232220033');
		});
	});
	describe('bbox', function() {
		it('should return a bounding box', function() {
			var key = '0300'
			  , bbox = quadkey.bbox(key);

			bbox.should.have.property('min');
			bbox.min.should.have.property('lat');
			bbox.min.lat.should.be.a.Number.and.equal(55.77657301866769);
			bbox.min.should.have.property('lng');
			bbox.min.lng.should.be.a.Number.and.equal(-90.0);

			bbox.should.have.property('max');
			bbox.max.should.have.property('lat');
			bbox.max.lat.should.be.a.Number.and.equal(66.51326044311186);
			bbox.max.should.have.property('lng');
			bbox.max.lng.should.be.a.Number.and.equal(-67.5);
		});
	});
	describe('origin', function() {
		it('should return the center origin of a quadkey', function() {
			var key = '0132311'
			  , origin = quadkey.origin(key);

			origin.should.have.property('lat');
			origin.lat.should.be.a.Number;
			origin.should.have.property('lng');
			origin.lng.should.be.a.Number;
		});
	});
	describe('inside', function() {
		it('should be able to determine if a location is inside a quadkey', function() {
			var location = { lat: 40.01234, lng: -160.02324 }
			  , key = quadkey.locationToQuadkey(location, 10)
			  , inside = quadkey.inside(location, key);
			inside.should.be.a.Boolean.and.be.true;
		});
		it('should be able to determine if a location is outside a quadkey', function() {
			var tile = { x: 104, y: 40 }
			  , key = quadkey.tileToQuadkey(tile, 10)
			  , center = quadkey.origin(key)
			  , otherTile = { x: 50, y: 200 }
			  , otherKey = quadkey.tileToQuadkey(otherTile, 10)
			  , otherCenter = quadkey.origin(otherKey);

			quadkey.inside(center, otherKey).should.be.a.Boolean.and.be.false;
		});
	});
	describe('children', function() {
		it('should return the correct children', function() {
			var key = '000112312'
			  , children = quadkey.children(key);

			children.should.be.an.Array.with.lengthOf(4);
			for(var i = 0; i < 4; i++) {
				children[i].should.be.a.String;
				quadkey.inside(quadkey.origin(children[i]), key).should.be.true;
			}
		});
	});
	describe('parent', function() {
		it('should return parent for key', function() {
			var key = '000112312'
			  , origin = quadkey.origin(key)
			  , parent = quadkey.parent(key);

			parent.should.be.a.String.with.lengthOf(key.length-1);
			quadkey.inside(origin, parent).should.be.true;
		});
	});
	describe('sibling', function() {
		it('should return a sibling', function() {
			var key = '00000'
			  , sib = quadkey.sibling(key, 'left');
			sib.should.be.a.String.with.valueOf('11111');
			sib = quadkey.sibling(key, 'up')
			sib.should.be.a.String.with.valueOf('22222');

			key = '33333';
			sib = quadkey.sibling(key, 'right');
			sib.should.be.a.String.with.valueOf('22222');
			sib = quadkey.sibling(key, 'down');
			sib.should.be.a.String.with.valueOf('11111');

			key = '11111';
			sib = quadkey.sibling(key, 'right');
			sib.should.be.a.String.with.valueOf('00000');
			sib = quadkey.sibling(key, 'up');
			sib.should.be.a.String.with.valueOf('33333');

			key = '22222';
			sib = quadkey.sibling(key, 'left');
			sib.should.be.a.String.with.valueOf('33333');
			sib = quadkey.sibling(key, 'down');
			sib.should.be.a.String.with.valueOf('00000');

			key = '001';
			sib = quadkey.sibling(key, 'left');
			sib.should.be.a.String.with.valueOf('000');

			key = '';
			sib = quadkey.sibling(key, 'left');
			sib.should.be.a.String.with.valueOf('');
		});
		it('should fail with invalid quadkey character', function() {
			var key = '456a';
			assert.throws(function(){
				quadkey.sibling(key, 'left');
			}, Error);
		});
	});
});