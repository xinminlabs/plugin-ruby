# xinminlabs-plugin-ruby

This is a fork of prettier [plugin-ruby](https://github.com/prettier/plugin-ruby),
which contains the following changes

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
