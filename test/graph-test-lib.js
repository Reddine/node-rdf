var assert = require('assert');
var rdf = require('..');

function rdfns(v){ return "http://www.w3.org/1999/02/22-rdf-syntax-ns#".concat(v); }
function rdfsns(v){ return "http://www.w3.org/2000/01/rdf-schema#".concat(v); }

function triple(s, p, o){
	return rdf.environment.createTriple(
		typeof s=='string' ? rdf.environment.createNamedNode(s) : s ,
		typeof p=='string' ? rdf.environment.createNamedNode(p) : p ,
		typeof o=='string' ? rdf.environment.createNamedNode(o) : o
	);
}

module.exports = function GenerateGraphTest(Graph){
	var batches = {};
	describe(Graph.name+' methods exist', function(){
		var t = new Graph;
		it('add exists', function(){ assert.equal(typeof t.add, 'function'); });
		it('remove exists', function(){ assert.equal(typeof t.remove, 'function'); });
		it('removeMatches exists', function(){ assert.equal(typeof t.removeMatches, 'function'); });
		it('toArray exists', function(){ assert.equal(typeof t.toArray, 'function'); });
		it('some exists', function(){ assert.equal(typeof t.some, 'function'); });
		it('every exists', function(){ assert.equal(typeof t.every, 'function'); });
		it('filter exists', function(){ assert.equal(typeof t.filter, 'function'); });
		it('forEach exists', function(){ assert.equal(typeof t.forEach, 'function'); });
		it('match exists', function(){ assert.equal(typeof t.match, 'function'); });
		it('merge exists', function(){ assert.equal(typeof t.merge, 'function'); });
		it('addAll exists', function(){ assert.equal(typeof t.addAll, 'function'); });
		//it('actions exists', function(){ assert.ok(Array.isArray(t.actions)); });
		//it('addAction exists', function(){ assert.equal(typeof t.addAction, 'function'); });
	});
	describe(Graph.name+' data', function(){
		it('add', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/Vowel', 'http://www.w3.org/2000/01/rdf-schema#subClassOf', 'http://example.com/Letter'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Vowel'));
			g.add(triple('http://example.com/A', 'http://example.com/nextLetter', 'http://example.com/B'));
			g.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(g.match(null, null, null).length, 7);
			assert.equal(g.toArray().length, 7);
			assert.equal(g.match(null, rdfns('type'), null).length, 5);
			assert.equal(g.match(null, rdfns('type'), 'http://example.com/Letter').length, 3);
			assert.equal(g.match('http://example.com/A', null, null).length, 3);
			assert.equal(g.match('http://example.com/A', rdfns('type'), null).length, 2);
			assert.equal(g.match('http://example.com/A', rdfns('type'), 'http://example.com/Letter').length, 1);
			var gg = new Graph;
			gg.addAll(g);
			assert.equal(gg.length, g.length);
		});
		it('add (multiples)', function(){
			// "Graphs MUST NOT contain duplicate triples."
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(g.match(null, null, null).length, 2);
			assert.equal(g.toArray().length, 2);
			assert.equal(g.match(null, rdfns('type'), null).length, 2);
			assert.equal(g.match(null, rdfns('type'), 'http://example.com/Letter').length, 1);
			assert.equal(g.match('http://example.com/A', null, null).length, 1);
			assert.equal(g.match('http://example.com/A', rdfns('type'), null).length, 1);
			assert.equal(g.match('http://example.com/A', rdfns('type'), 'http://example.com/Letter').length, 1);
		});
		it('addAll', function(){
			// "the import must not produce any duplicates."
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			var gg = new Graph;
			assert.equal(gg.length, 0);
			gg.addAll(g);
			gg.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(gg.length, g.length);
			assert.equal(gg.match(null, null, null).length, 2);
			assert.equal(gg.toArray().length, 2);
			assert.equal(gg.match(null, rdfns('type'), null).length, 2);
			assert.equal(gg.match(null, rdfns('type'), 'http://example.com/Letter').length, 1);
			assert.equal(gg.match('http://example.com/A', null, null).length, 1);
			assert.equal(gg.match('http://example.com/A', rdfns('type'), null).length, 1);
			assert.equal(gg.match('http://example.com/A', rdfns('type'), 'http://example.com/Letter').length, 1);
		});
		it('every', function(){
			// "Universal quantification method, tests whether every Triple in the Graph passes the test implemented by the provided TripleFilter."
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.ok(g.every(function(triple){
				return triple.predicate.equals(new rdf.NamedNode(rdfns('type')));
			}));
			assert.ok(!g.every(function(triple){
				return triple.subject.equals(new rdf.NamedNode('http://example.com/Letter'));
			}));
		});
		it('filter', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(g.filter(function(triple){
				return triple.predicate.equals(new rdf.NamedNode(rdfns('type')));
			}).length, 4);
			assert.equal(g.filter(function(triple){
				return triple.subject.equals(new rdf.NamedNode('http://example.com/Letter'));
			}).length, 1);
			assert.ok(g.filter(function(triple){ return true; }) instanceof rdf.Graph);
		});
		it('forEach', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfsns('label'), new rdf.Literal('Letter', '@en')));
			g.add(triple('http://example.com/A', rdfsns('label'), new rdf.Literal('A')));
			g.add(triple('http://example.com/B', rdfsns('label'), new rdf.Literal('B')));
			g.add(triple('http://example.com/C', rdfsns('label'), new rdf.Literal('C')));
			var len = 0;
			g.forEach(function(triple){
				len += triple.object.valueOf().length;
			});
			assert.equal(len, 9);
		});
		it('match', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfsns('label'), new rdf.Literal('Letter', '@en')));
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			h.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			var len = 0;
			var matches = g.match(null, rdf.environment.createNamedNode(rdfns('type')), rdf.environment.createNamedNode('http://example.com/Letter'));
			assert.equal(matches, 1);
			assert(matches instanceof rdf.Graph);
		});
		it('merge', function(){
			var g = new Graph;
			var h = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			h.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			h.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			h.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			var m = g.merge(h);
			assert.equal(g.length, 1);
			assert.equal(h.length, 3);
			assert.equal(m.length, 4);
		});
		it('remove', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(g.length, 4);
			assert.equal(g.toArray().length, 4);
			g.remove(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(g.length, 3);
			assert.equal(g.toArray().length, 3);
			g.remove(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(g.length, 3);
			assert.equal(g.toArray().length, 3);
		});
		it('removeMatches', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.equal(g.length, 4);
			assert.equal(g.toArray().length, 4);
			g.removeMatches(new rdf.NamedNode('http://example.com/C'), new rdf.NamedNode(rdfns('type')), new rdf.NamedNode('http://example.com/Letter'));
			assert.equal(g.length, 3);
			assert.equal(g.toArray().length, 3);
			g.removeMatches(new rdf.NamedNode('http://example.com/C'), new rdf.NamedNode(rdfns('type')), new rdf.NamedNode('http://example.com/Letter'));
			assert.equal(g.length, 3);
			assert.equal(g.toArray().length, 3);
		});
		it('some', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			assert.ok(g.every(function(triple){
				return triple.predicate.equals(new rdf.NamedNode(rdfns('type')));
			}));
			assert.ok(!g.every(function(triple){
				return triple.subject.equals(new rdf.NamedNode('http://example.com/Letter'));
			}));
		});
		it('toArray', function(){
			var g = new Graph;
			g.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			g.add(triple('http://example.com/A', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/B', rdfns('type'), 'http://example.com/Letter'));
			g.add(triple('http://example.com/C', rdfns('type'), 'http://example.com/Letter'));
			var a = g.toArray();
			assert(Array.isArray(a));
			assert.equal(a.length, 4);
		});
		it('equals', function(){
			// Graph a
			var ga = new Graph;
			for(var ba = []; ba.length<5; ba.push(new rdf.BlankNode));
			ga.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			ga.add(triple(ba[0], rdfns('type'), 'http://example.com/Letter'));
			ga.add(triple(ba[0], rdfns('type'), ba[1]));
			ga.add(triple(ba[0], rdfns('type'), ba[2]));
			ga.add(triple(ba[2], rdfns('type'), ba[3]));
			ga.add(triple(ba[1], rdfns('type'), ba[4]));
			// Graph h - positive test
			var gh = new Graph;
			for(var bh = []; bh.length<5; bh.push(new rdf.BlankNode));
			gh.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			gh.add(triple(bh[0], rdfns('type'), 'http://example.com/Letter'));
			gh.add(triple(bh[0], rdfns('type'), bh[1]));
			gh.add(triple(bh[0], rdfns('type'), bh[2]));
			gh.add(triple(bh[2], rdfns('type'), bh[3]));
			gh.add(triple(bh[1], rdfns('type'), bh[4]));
			assert(gh.equals(ga));
			// Graph h - negative test
			var gm = new Graph;
			for(var bm = []; bm.length<5; bm.push(new rdf.BlankNode));
			gm.add(triple('http://example.com/Letter', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			gm.add(triple(bm[0], rdfns('type'), 'http://example.com/Letter'));
			gm.add(triple(bm[0], rdfns('type'), bm[1]));
			gm.add(triple(bm[0], rdfns('type'), bm[2]));
			gm.add(triple(bm[1], rdfns('type'), bm[3])); // this one is different
			gm.add(triple(bm[1], rdfns('type'), bm[4]));
			assert(!gm.equals(ga));
		});
		it('equals (no bnodes negative)', function(){
			// Graph a
			var ga = new Graph;
			for(var ba = []; ba.length<5; ba.push(new rdf.BlankNode));
			ga.add(triple('http://example.com/A', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			var gh = new Graph;
			for(var bh = []; bh.length<5; bh.push(new rdf.BlankNode));
			gh.add(triple('http://example.com/B', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			assert(!gh.equals(ga));
		});
		it('equals (no bnodes positive)', function(){
			// Graph a
			var ga = new Graph;
			for(var ba = []; ba.length<5; ba.push(new rdf.BlankNode));
			ga.add(triple('http://example.com/A', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			var gh = new Graph;
			for(var bh = []; bh.length<5; bh.push(new rdf.BlankNode));
			gh.add(triple('http://example.com/A', rdfns('type'), 'http://www.w3.org/2000/01/rdf-schema#Class'));
			assert(gh.equals(ga));
		});
	});
}
