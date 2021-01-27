const rubyPrinter = require("./ruby/printer");
const rubyParser = require("./ruby/parser");

const rbsPrinter = require("./rbs/printer");
const rbsParser = require("./rbs/parser");

const hamlPrinter = require("./haml/printer");
const hamlParser = require("./haml/parser");

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
        ".rbi",
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
        ".simplecov",
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
      name: "RBS",
      parsers: ["rbs"],
      extensions: [".rbs"]
    },
    {
      name: "HAML",
      parsers: ["haml"],
      extensions: [".haml"],
      vscodeLanguageIds: ["haml"]
    }
  ],
  parsers: {
    ruby: rubyParser,
    rbs: rbsParser,
    haml: hamlParser
  },
  printers: {
    ruby: rubyPrinter,
    rbs: rbsPrinter,
    haml: hamlPrinter
  },
  options: {
    rubyModifier: {
      type: "boolean",
      category: "Ruby",
      default: true,
      description:
        "When it fits on one line, allows if, unless, while, and until statements to use the modifier form."
    },
    rubySingleQuote: {
      type: "boolean",
      category: "Ruby",
      default: true,
      description:
        "When double quotes are not necessary for interpolation, prefers the use of single quotes for string literals."
    }
  },
  defaultOptions: {
    printWidth: 80,
    tabWidth: 2,
    trailingComma: "none"
  }
};
