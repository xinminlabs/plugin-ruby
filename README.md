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

### do not transform to ternary condition

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

### wrap call name with group

e.g.

```
Config::Download.new(
  'rubocop-config-prettier',
  filename: 'rubocop.yml',
  url:
    'https://raw.githubusercontent.com/xinminlabs/rubocop-config-prettier/master/config/rubocop.yml'
).perform
```

won't be transformed to

```
Config::Download.new(
  'rubocop-config-prettier',
  filename: 'rubocop.yml',
  url:
    'https://raw.githubusercontent.com/xinminlabs/rubocop-config-prettier/master/config/rubocop.yml'
)
  .perform
```
