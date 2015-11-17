Basically, have your project's package.json be like:

``` js
{
  "devDependencies": {
      "mocha-bow-reporter": ">=0.0.1"
  }
}
```

Then call mocha with:

mocha --reporter mocha-bow-reporter test
