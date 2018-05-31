"use strict";

/**
 * RDF
 *
 * Implement a mash-up of the RDF Interfaces API, the RDF API, and first and foremost whatever makes sense for Node.js
 */

var api = exports;

api.Triple = require('./lib/RDFNode.js').Triple;
api.RDFNode = require("./lib/RDFNode.js").RDFNode;
api.NamedNode = require("./lib/RDFNode.js").NamedNode;
api.BlankNode = require("./lib/RDFNode.js").BlankNode;
api.Literal = require("./lib/RDFNode.js").Literal;

api.Profile = require('./lib/Profile.js').Profile;
api.RDFEnvironment = require('./lib/RDFEnvironment.js').RDFEnvironment;

api.TurtleParser = require('./lib/TurtleParser.js').Turtle;

api.Graph = require("./lib/Graph.js").Graph;

api.setObjectProperties = require('./lib/Builtins').setObjectProperties;
api.setStringProperties = require('./lib/Builtins').setStringProperties;
api.setArrayProperties = require('./lib/Builtins').setArrayProperties;
api.setBooleanProperties = require('./lib/Builtins').setBooleanProperties;
api.setDateProperties = require('./lib/Builtins').setDateProperties;
api.setNumberProperties = require('./lib/Builtins').setNumberProperties;
api.environment = require('./lib/Builtins').environment;
api.setBuiltins = require('./lib/Builtins').setBuiltins;
api.unsetBuiltins = require('./lib/Builtins').unsetBuiltins;
api.ref = require('./lib/Builtins').ref;
api.parse = function(o, id){
	return api.ref.call(o, id);
}

api.ns = function(ns){
	return function(v){return ns+v;};
}
api.rdfns = api.ns('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
api.rdfsns = api.ns('http://www.w3.org/2000/01/rdf-schema#');
api.xsdns = api.ns('http://www.w3.org/2001/XMLSchema#');
