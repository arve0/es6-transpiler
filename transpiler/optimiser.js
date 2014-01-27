"use strict";

const assert = require("assert");
const core = require("./core");
const is = require("simple-is");

function getline(node) {
	return node.loc.start.line;
}

function isFunction(node) {
	let type;
	return node && (type = node.type)
		&& type === "FunctionDeclaration" || type === "FunctionExpression" || type === "ArrowFunctionExpression";
}

function isLoop(node) {
	let type;
	return node && (type = node.type)
		&& type === "ForStatement" || type === "ForInStatement" || type === "ForOfStatement" || type === "WhileStatement" || type === "DoWhileStatement";
}

function isObjectPattern(node) {
	return node && node.type === 'ObjectPattern';
}

function isArrayPattern(node) {
	return node && node.type === 'ArrayPattern';
}


let plugin = module.exports = {
	reset: function() {

	}

	, setup: function(alter, ast, options) {
		if( !this.__isInit ) {
			this.reset();
			this.__isInit = true;
		}

		this.alter = alter;
		this.options = options;

		let resetUnCapturedVariables = options.resetUnCapturedVariables;

		return Array.isArray(resetUnCapturedVariables) && resetUnCapturedVariables.length > 1 || false;
	}

	, pre: function(node) {
		let isVariableDeclaration = node.type === "VariableDeclaration";
		let isFunctionDeclaration = !isVariableDeclaration && node.type === 'FunctionDeclaration';

		if( isVariableDeclaration ) {
			let kind = node.$originalKind || node.kind;

			core.getVariableDeclarationNodes(node).forEach(function(declarationNode) {
				if( !declarationNode.$captured ) {
					plugin.resetVariable(
						declarationNode
						, null
					);
				}
			});
		}
		else if( isFunctionDeclaration ) {
			this.resetVariable(node.id, "fun", node.$scope.parent.node);
		}
		else if( node.$refToScope ) {
			if( node.$captured === false ) {
				this.resetVariable(node);
			}
		}
	}

	, resetVariable: function(node, kind, scopeNode) {
		if( node.$captured ) {
			return;
		}

		const name = node.name;
		kind = kind || node.$originalKind || (node.$refToScope && node.$refToScope.getKind(name)) || node.kind || node.$scope.closestHoistScope().getKind(name);

		if( !is.someof(kind, this.options.resetUnCapturedVariables) ) {
			return;
		}

		scopeNode = scopeNode || (node.$refToScope && node.$refToScope.node) || node.$scope.node;

		if( kind === 'var' || kind === 'fun' ) {
			scopeNode = scopeNode.$scope.closestHoistScope().node;
		}

		if( isLoop(scopeNode.$parent) && scopeNode.$parent.$iify === true ) {
			// TODO:: allow reset variables inside IIFY (it's buggy now)
			return;
		}

		const insertIndex = scopeNode.range[1] + (isLoop(scopeNode) ? 0 : (scopeNode.type === "Program" ? 0 : -1));

//		if( !isFunction(scopeNode) ) {
			if( !scopeNode.$voidsInsert ) {
				scopeNode.$voidsInsert = {};
			}
			if( scopeNode.$voidsInsert[name] === void 0 ) {
				scopeNode.$voidsInsert[name] = null;

				this.alter.insertBefore(
					insertIndex
					, ";" + name + " = void 0;"
				);
			}
//		}
//		else {
			// TODO::
			// function test(){ let a = {}; return; } -> function test(){ var a = {}; a = void 0;return; }
			// function test(){ let a = {}; return a; } -> function test(){ var a = {}; return; }
//		}
	}
};

for(let i in plugin) if( plugin.hasOwnProperty(i) && typeof plugin[i] === "function" ) {
	plugin[i] = plugin[i].bind(plugin);
}
