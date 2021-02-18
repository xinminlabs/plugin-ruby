# awesomecode-plugin-ruby

This is a fork of prettier [plugin-ruby](https://github.com/prettier/plugin-ruby),
which is used in [Awesome Code](https://awesomecode.io)

## How to use

```
npm install prettier awesomecode-plugin-ruby
npx prettier *.rb
```

## What changed comparing to the official plugin ruby?

It removes the following configurations

- `rubyArrayLiteral`
- `rubyHashLabel`
- `rubyModifier`
- `rubyToProc`

It contains the following changes

### do not add line break for array index

```ruby
longarrayname[index]
```

won't be transformed to

```ruby
longarrayname[index]
```

### do not transform regexp

```ruby
/abc/
```

won't be transformed to

```ruby
%r{abc}
```

### do not transform to proc

```ruby
array.each { |element| element.to_s }
```

won't be transformed to

```ruby
array.each(&:to_s)
```

### do not transform array literal

```ruby
['foo']
[:bar]
```

won't be transformed to

```ruby
%w[foo]
%i[bar]
```

### do not transform conditions

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

### do not transform loops

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

### do not transform blocks

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
