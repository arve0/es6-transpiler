"use strict";

const fs = require("fs");
const alter = require("./lib/alter");
const traverse = require("./lib/traverse");
const error = require("./lib/error");
const defaultOptions = require("./options");

let plugins = [
	require("./transpiler/classes")
	//, require("./transpiler/loopClosures")TODO::
	, require("./transpiler/core")
	, require("./transpiler/letConst")
	, require("./transpiler/functions")
	, require("./transpiler/destructuring")
];

module.exports = {
	runned: false

	, setupPlugins: function(config) {
		var optionsList = this.optionsList = [];

		plugins.forEach(function(plugin, index) {
			var options = optionsList[index] = {};
			for(let i in config)if(config.hasOwnProperty(i))options[i] = config[i];

			if( typeof plugin.setup === "function" ) {
				plugin.setup(this.src, this.changes, this.ast, options);
			}
		}, this);
	}

	, applyChanges: function(config) {
		if( this.changes.length ) {// has changes in classes replacement Step
			this.src = alter(this.src, this.changes);
			this.ast = this.esprima.parse(this.src, {
				loc: true,
				range: true
			});

			error.reset();
			this.changes = [];
			this.setupPlugins(config);
		}
	}
	, reset: function() {
		this.ast = this.src = null;
		error.reset();

		plugins.forEach(function(plugin) {
			if( typeof plugin.reset === "function" ) {
				plugin.reset();
			}
		})
	}

	, run: function run(config) {
		for(let i in defaultOptions)if(defaultOptions.hasOwnProperty(i) && !config.hasOwnProperty(i))config[i] = defaultOptions[i];

		if( this.runned === true ) {
			this.reset();
		}
		this.runned = true;

		this.changes = [];

		// esprima
		let esprima;
		if( config.fullES6 === true ) {
			esprima = require("./lib/esprima_harmony");
		}
		else {
			esprima = require("esprima");
		}
		this.esprima = esprima;

		// input
		if( typeof config.filename === "string" ) {
			this.src = String(fs.readFileSync(config.filename));
		}
		else if( typeof config.source === "string" || typeof config.source === "object" ) {
			this.src = String(config.source);
		}
		else if( typeof config.ast === "object" ) {
			throw new Error("Currently unsupported");
			/*
			src = null;
			ast = config.ast;
			*/
		}


		if( !this.ast && this.src ) {
			this.ast = esprima.parse(this.src, {
				loc: true,
				range: true
			});
		}
		else {
			throw new Error("Input not found " + config.filename);
		}

		// output
		const output = {errors: [], src: ""};

		this.setupPlugins(config);

		plugins.forEach(function(plugin, index) {
			var options = this.optionsList[index];

			if( typeof plugin.before === "function" ) {
				plugin.before(this.ast);
			}

			if( typeof plugin.pre === "function" ) {
				traverse(this.ast, {pre: plugin.pre});
			}

			if( typeof plugin.after === "function" ) {
				plugin.after(this.ast, output);
			}

			if( options.applyChangesAfter ) {
				this.applyChanges(config);
			}
		}, this);

		// output
		if( error.errors.length ) {
			output.exitcode = -1;
			output.errors = error.errors;
		}
		else if (config.outputType === "ast") {
			// return the modified AST instead of src code
			// get rid of all added $ properties first, such as $parent and $scope
			traverse(this.ast, {cleanup: true});

			output.ast = this.ast;
		}
		else {
			// apply changes produced by varify and return the transformed src
			//console.log(changes);var transformedSrc = "";try{ transformedSrc = alter(src, changes) } catch(e){ console.error(e+"") };

			output.src = alter(this.src, this.changes);
		}

		if( config.outputToConsole === true ) {
			outputToConsole(output, config);
		}
		return output;
	}

};

function outputToConsole(output, config) {
	if (output.errors.length) {
		process.stderr.write(output.errors.join("\n"));
		process.stderr.write("\n");
		process.exit(-1);
	}

	if (config.outputType === "stats" && output.stats) {
		process.stdout.write(output.stats.toString());
		process.exit(0);
	}
	if (config.outputType === "ast" && output.ast) {
		process.stdout.write(JSON.stringify(output.ast, null, 4));
	}
	if (output.src) {
		process.stdout.write(output.src);
	}
	process.exit(0);
}
