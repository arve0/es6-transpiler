/*globals module*/
"use strict";

module.exports = {
	is: {
		isConstLet: function(node) {
			let kind;
			return node && (kind = node.kind)
				&& (kind === "const" || kind === "let");
		}

		, isVarConstLet: function(node) {
			let kind;
			return node && (kind = node.kind)
				&& (kind === "var" || kind === "const" || kind === "let");
		}

		, isBinaryExpression: function(node) {
			return node && node.type === "BinaryExpression";
		}

		, isFunction: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "FunctionDeclaration" || type === "FunctionExpression" || type === "ArrowFunctionExpression");
		}

		, isBlock: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "BlockStatement");
		}

		, isProgram: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "Program");
		}

		, isIf: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "IfStatement");
		}

		, isExpressionStatement: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "ExpressionStatement");
		}

		, isLiteral: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "Literal");
		}

		, isIdentifier: function(node, name) {
			return node
				&& node.type === "Identifier"
				&& (!name || node.name == name)
			;
		}

		, isProperty: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "Property");
		}

		, isSpreadElement: function(node) {
			return node && node.type === 'SpreadElement';
		}

		, isMemberExpression: function(node) {
			return node && node.type === "MemberExpression";
		}

		, isMethodDefinition: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "MethodDefinition");
		}

		, isTry: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "TryStatement");
		}

		, isCatch: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "CatchClause");
		}

		, isArgumentExpression: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "UpdateExpression" || type === "UnaryExpression");
		}

		, isNonFunctionBlock: function(node) {
			return node && node.type === "BlockStatement" && !this.isFunction(node.$parentNode);
		}

		, isForWithConstLet: function(node) {
			return node && node.type === "ForStatement"
				&& this.isConstLet(node.init)
				&& node.init.type === "VariableDeclaration"
			;
		}

		, isForInOfWithConstLet: function(node) {
			return node && (node.type === "ForInStatement" || node.type === "ForOfStatement")
				&& this.isConstLet(node.left)
				&& node.left.type === "VariableDeclaration"
			;
		}

		, isForInOf: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "ForInStatement" || type === "ForOfStatement");
		}

		, isLoop: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "ForStatement" || type === "ForInStatement"
					|| type === "ForOfStatement" || type === "WhileStatement" || type === "DoWhileStatement");
		}

		, isClass: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === 'ClassDeclaration' || type === 'ClassExpression')
		}

		, isEmptyBody: function(node) {
			let bodyNode = node && node.body;

			return bodyNode && !(!this.isBlock(bodyNode) || bodyNode.body.length);
		}

		, isObjectPattern: function(node) {
			return node && node.type == 'ObjectPattern';
		}

		, isArrayPattern: function(node) {
			return node && node.type == 'ArrayPattern';
		}

		, isArrayExpression: function(node) {
			return node && node.type === 'ArrayExpression';
		}

		, isSequenceExpression: function(node) {
			return node && node.type === 'SequenceExpression';
		}

		, isReference: function(node) {
			const parent = node.$parentNode;
			const parentType = parent && parent.type;

			return node.$refToScope
				|| node.type === "Identifier"
					&& !(parentType === "VariableDeclarator" && parent.id === node) // var|let|const $
					&& !(parentType === "MemberExpression" && parent.computed === false && parent.property === node) // obj.$
					&& !(parentType === "Property" && parent.key === node && parent.computed === false) // {$: ...} not the {[$]: ...}
					&& !(parentType === "LabeledStatement" && parent.label === node) // $: ...
					&& !(parentType === "CatchClause" && parent.param === node) // catch($)
					&& !(this.isFunction(parent) && parent.id === node) // function $(..
					&& !(this.isFunction(parent) && parent.params.indexOf(node) !== -1) // function f($)..
					&& node.$parentProp !== 'label'// for 'break label', 'continue label', etc cases
					&& true
			;
		}

		, isDeclaration: function(node) {
			return node && (node.$variableDeclaration === true || node.$paramDefinition === true);
		}

		, isLvalue: function(node) {
			return this.isReference(node) &&
				(
					(node.$parentNode.type === "AssignmentExpression" && node.$parentNode.left === node)
					|| (node.$parentNode.type === "UpdateExpression" && node.$parentNode.argument === node)
				)
			;
		}

		, isBodyStatement: function(node) {
			let type;
			return node && (type = node.type)
				&& (type === "BlockStatement"
					|| type === "FunctionDeclaration"
					|| type === "FunctionExpression"
					|| type === "ArrowFunctionExpression"
					|| type === "ForStatement"
					|| type === "ForInStatement"
					|| type === "ForOfStatement"
					|| type === "WhileStatement"
					|| type === "DoWhileStatement"
					|| type === "Program"
				)
			;
		}

		, isExpression: function(node) {
			let type;
			return node && (type = node.type)
				&& String(type).endsWith('Expression')
			;
		}
	}
};
