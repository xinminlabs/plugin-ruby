# awesomecode-plugin-ruby

This is a fork of prettier [plugin-ruby](https://github.com/prettier/plugin-ruby),
which is used in [Awesome Code](https://awesomecode.io)

It contains the following changes

### do not add line break for aref node

e.g.

```ruby
hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello['test']
```

won't be transformed to

```ruby
hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello.foo.bar.hello[
  'test'
]
```

### do not transform to ternary condition and vice versa

e.g.

```ruby
if File.directory? entry
  Dir[File.join(entry, '**', "*.rb")]
else
  entry
end
```

won't be transformed to

```ruby
File.directory? entry ? Dir[File.join(entry, '**', "*.rb")] : entry
```

### do not transform multiline if to inline if and vice versa

e.g.

```ruby
if result
  'foo'
else
  'bar'
end
```

won't be transformed to

```ruby
result ? 'foo' : 'bar'
```

### do not transform multiline while to inline while and vice verse

e.g.

```ruby
while true
  break :value
end
```

won't be transformed to

```ruby
break :value while true
```

### do not transform to single line block and vice versa

e.g.

```ruby
included do
  has_many :build_items, dependent: :destroy
end
```

won't be transformed to

```ruby
included { has_many :build_items, dependent: :destroy }
```

### do not tranform string_embexpr

```ruby
"node ./node_modules/prettier/bin-prettier.js --plugin ./node_modules/awesomecode-plugin-ruby --config #{FormatTool::DOCKER_FORMATRC_YAML} --ignore-path #{FormatTool::DOCKER_FORMAT_IGNORE} --write #{FormatTool::DOCKER_INPUT_PATH}/**/*.{rb,rake}"
```

won't be transformed to

```ruby
"node ./node_modules/prettier/bin-prettier.js --plugin
./node_modules/awesomecode-plugin-ruby --config #{
  FormatTool::DOCKER_FORMATRC_YAML
} --ignore-path #{FormatTool::DOCKER_FORMAT_IGNORE} --write #{
  FormatTool::DOCKER_INPUT_PATH
}/**/*.{rb,rake}"
```

### do not transform to string or symbol array

```ruby
['foo']
[:bar]
```

won't be transformed to

```ruby
%w[foo]
%i[bar]
```

### do not transform regexp

```ruby
/abc/
```

won't be transformed to

```ruby
%r{abc}
```

### do not transform to to_proc

```ruby
array.each { |element| element.to_s }
```

won't be transformed to

```ruby
array.each(&:to_s)
```
