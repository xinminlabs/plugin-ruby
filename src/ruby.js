const { formatAST } = require("prettier").__debug;

const parse = require("./parse");
const print = require("./print");

const pragmaPattern = /#\s*@(prettier|format)/;
const hasPragma = text => pragmaPattern.test(text);

const locStart = node => node.char_start;
const locEnd = node => node.char_end;

const htmlErb = {
  parse: (text, parsers, opts) => {
    const replaced = text.replace(/(<%=?)\s*(.+?)\s*%>/g, (_match, tag, ruby) => {
      const ast = JSON.stringify(parsers.ruby(ruby, parsers, opts));
      const oper = tag === "<%=" ? "p" : "e";

      return `<prettier>\n${oper}-${ast}\n</prettier>`;
    });

    return parsers.html(replaced, parsers, opts);
  },
  print: (path, opts, print) => {
    const htmlOpts = Object.assign({}, opts, { parser: "html" });
    const { formatted } = formatAST(path.getValue(), htmlOpts);

    const pattern = /<prettier>\s+(p|e)-({.+})\s+<\/prettier>/g;
    const replaced = formatted.replace(pattern, (_match, oper, ast) => {
      const rubyOpts = Object.assign({}, opts, { parser: "ruby" });
      const { formatted: ruby } = formatAST(JSON.parse(ast), rubyOpts);

      const tag = oper === "p" ? "<%=" : "<%";
      return `${tag} ${ruby.replace(/\n$/, "")} %>`;
    });

    return replaced;
  }
};

/*
 * metadata mostly pulled from linguist and rubocop:
 * https://github.com/github/linguist/blob/master/lib/linguist/languages.yml
 * https://github.com/rubocop-hq/rubocop/blob/master/spec/rubocop/target_finder_spec.rb
 */

module.exports = {
  languages: [
    {
      name: "Ruby",
      parsers: ["ruby"],
      extensions: [
        ".arb",
        ".axlsx",
        ".builder",
        ".eye",
        ".fcgi",
        ".gemfile",
        ".gemspec",
        ".god",
        ".jb",
        ".jbuilder",
        ".mspec",
        ".opal",
        ".pluginspec",
        ".podspec",
        ".rabl",
        ".rake",
        ".rb",
        ".rbuild",
        ".rbw",
        ".rbx",
        ".ru",
        ".ruby",
        ".thor",
        ".watchr"
      ],
      filenames: [
        ".irbrc",
        ".pryrc",
        "Appraisals",
        "Berksfile",
        "Brewfile",
        "Buildfile",
        "Capfile",
        "Cheffile",
        "Dangerfile",
        "Deliverfile",
        "Fastfile",
        "Gemfile",
        "Guardfile",
        "Jarfile",
        "Mavenfile",
        "Podfile",
        "Puppetfile",
        "Rakefile",
        "Snapfile",
        "Thorfile",
        "Vagabondfile",
        "Vagrantfile",
        "buildfile"
      ],
      interpreters: ["jruby", "macruby", "rake", "rbx", "ruby"],
      linguistLanguageId: 326,
      vscodeLanguageIds: ["ruby"]
    },
    {
      name: "HTML ERB",
      parsers: ["htmlErb"],
      extensions: [
        ".html.erb"
      ]
    }
  ],
  parsers: {
    ruby: {
      parse,
      astFormat: "ruby",
      hasPragma,
      locStart,
      locEnd
    },
    htmlErb: {
      parse: htmlErb.parse,
      astFormat: "htmlErb"
    }
  },
  printers: {
    ruby: {
      print
    },
    htmlErb: {
      print: htmlErb.print
    }
  },
  options: {
    addTrailingCommas: {
      type: "boolean",
      category: "Global",
      default: false,
      description:
        "Adds a trailing comma to array literals, hash literals, and method calls."
    },
    inlineConditionals: {
      type: "boolean",
      category: "Global",
      default: true,
      description:
        "When it fits on one line, allows if and unless statements to use the modifier form."
    },
    inlineLoops: {
      type: "boolean",
      category: "Global",
      default: true,
      description:
        "When it fits on one line, allows while and until statements to use the modifier form."
    },
    preferHashLabels: {
      type: "boolean",
      category: "Global",
      default: true,
      description:
        "When possible, uses the shortened hash key syntax, as opposed to hash rockets."
    },
    preferSingleQuotes: {
      type: "boolean",
      category: "Global",
      default: true,
      description:
        "When double quotes are not necessary for interpolation, prefers the use of single quotes for string literals."
    }
  },
  defaultOptions: {
    printWidth: 80,
    tabWidth: 2
  }
};
