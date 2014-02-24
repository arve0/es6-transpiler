var a = "a", b = "b", a$1, b$1;

{// simple
    var a$0 = 1, b$0 = 2;
    console.log((("" + (a$0 + 1)) + ("|" + b$0) + "") === "2|2")
}

{// complex
    var a$2 = "3a", b$2 = 4;
    console.log(
        (("\"" + (a$2.toUpperCase())) + ("\"\
\n   " + (b$2 + "\\n")) + "") === "\"3A\"\n   4\\n")
}

{// with function call inside
    var a$3 = "a", b$3 = "b";
	function test1(a, b) {
		return [a, b];
	}
    var string = (("a = " + a$3) + (" | bb = " + (b$3 + b$3)) + (" | function call = " + (test1(a$3, b$3).join("\n"))) + "");
        console.log(string === "a = " + a$3 + " | bb = " + b$3 + b$3 + " | function call = " + a$3 + "\n" + b$3);
}

{// with multy function calls inside
        var a$4 = "u-n", b$4 = "b-d";
        function test(a, b) {
                return [a, b];
        }
        var string$0 = (("" + (test(a$4, b$4).join("\n"))) + ("" + (test(a$4, b$4).join("\t"))) + ("'" + (test(a$4, b$4).join("\r"))) + ("\"" + (test(a$4, b$4).join("\0"))) + ("`" + (test(a$4, b$4).join("\\"))) + ("\\/" + (test(a$4, b$4).join("/"))) + "");
        console.log(string$0 === 'u-n\nb-du-n\tb-d\'u-n\rb-d"u-n\0b-d`u-n\\b-d\\/u-n/b-d');
}

{// escaping
	var str = (("```${1}\\" + (2)) + "${3}$${{");
	console.log(str === "```${1}\\2${3}$${{");
}

{// multy lines
	var str$0 = ("\
\n		^ # match at start of string only\
\n		/ (?<year> [^/]+ ) # capture top dir as year\
\n		/ (?<month> [^/]+ ) # capture subdir as month\
\n		/ (?<title> [^/]+ ) # file name base\
\n		\\.html? # file name extension: .htm or .html\
\n		$ # end of string\
\n	");
	console.log(str$0 === "\n\t\t^ # match at start of string only\n\t\t/ (?<year> [^/]+ ) # capture top dir as year\n\t\t/ (?<month> [^/]+ ) # capture subdir as month\n\t\t/ (?<title> [^/]+ ) # file name base\n\t\t\\.html? # file name extension: .htm or .html\n\t\t$ # end of string\n\t");
}

{// special symbols
    var n = ("\n"), t = ("\t"), r = ("\r"), bs = ("\\"), q1 = ("\""), q2 = ("'"), q1q1 = ("\"\""), q2q2 = ("''"), q1_q1q1 = ("\"\"\""), q2_q2q2 = ("'\''");
    var string$1 = (("" + n) + ("|" + t) + ("|" + r) + ("|" + bs) + ("|" + q1) + ("|" + q2) + ("|" + q1q1) + ("|" + q2q2) + ("|" + q1_q1q1) + ("|" + q2_q2q2) + "");
        console.log(string$1 === "\n|\t|\r|\\|\"|'|\"\"|''|\"\"\"|'''");
}

{// just toString
    var obj = {toString: function(){ return [3, 2, 1].join("") }};
    console.log( ("" + obj).split("").join("") === "321" )
}

{// simple nesting
	var a$5 = 1, b$5 = 2, c = 3, d = 4;
	var str$1 = ("" + (a$5 + ("-" + (b$5 + ("=" + (c + ("" + d)))))));
	console.log(str$1 === a$5 + "-" + b$5 + "=" + c + d);
}

{// complex nesting
	var rows = [['Unicorns', 'Sunbeams', 'Puppies'], ['<3', '<3', '<3']];
	var html = (("<table>" + (rows.map(function(row) {
		return (("<tr>" + (row.map(function(cell)
			{return (("<td>" + cell) + "</td>")}
		))) + "</tr>")
	}))) + "</table>");

	console.log(html === '<table><tr><td>Unicorns</td>,<td>Sunbeams</td>,<td>Puppies</td></tr>,<tr><td><3</td>,<td><3</td>,<td><3</td></tr></table>')
}
