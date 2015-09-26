# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
libsass:  48 ms  (1.2 times faster)
PostCSS:  58 ms
Rework:   96 ms  (1.7 times slower)
Less:     166 ms (2.9 times slower)
Stylecow: 181 ms (3.1 times slower)
Stylus:   194 ms (3.4 times slower) 
```

To get results on your environment:

```sh
npm install
bundle install
npm test preprocessors
```
