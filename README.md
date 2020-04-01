# xinminlabs-plugin-ruby

This is a fork of prettier [plugin-ruby](https://github.com/prettier/plugin-ruby),
which is used in [Awesome Code](https://awesomecode.io)

It contains the following changes

### do not add line break for aref node

e.g.

```
hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello['test']
```

won't be transformed to

```
hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello[
  'test'
]
```

### do not transform to ternary condition and vice versa

e.g.

```
if File.directory? entry
  Dir[File.join(entry, '**', "*.rb")]
else
  entry
end
```

won't be transformed to

```
File.directory? entry ? Dir[File.join(entry, '**', "*.rb")] : entry
```

### do not transform multiline if to inline if and vice versa

e.g.

```
if result
  'foo'
else
  'bar'
end
```

won't be transformed to

```
result ? 'foo' : 'bar'
```

### do not transform multiline while to inline while and vice verse

e.g.

```
while true
  break :value
end
```

won't be transformed to

```
break :value while true
```

### do not transform to single line block and vice versa

e.g.

```
included do
  has_many :build_items, dependent: :destroy
end
```

won't be transformed to

```
included { has_many :build_items, dependent: :destroy }
```

### do not tranform string_embexpr

```
"node ./node_modules/prettier/bin-prettier.js --plugin ./node_modules/xinminlabs-plugin-ruby --config #{FormatTool::DOCKER_FORMATRC_YAML} --ignore-path #{FormatTool::DOCKER_FORMAT_IGNORE} --write #{FormatTool::DOCKER_INPUT_PATH}/**/*.{rb,rake}"
```

won't be transformed to

```
"node ./node_modules/prettier/bin-prettier.js --plugin
./node_modules/xinminlabs-plugin-ruby --config #{
  FormatTool::DOCKER_FORMATRC_YAML
} --ignore-path #{FormatTool::DOCKER_FORMAT_IGNORE} --write #{
  FormatTool::DOCKER_INPUT_PATH
}/**/*.{rb,rake}"
```

### do not transform to string or symbol array

```
['foo']
[:bar]
```

won't be transformed to

```
%w[foo]
%i[bar]
```
