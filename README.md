https://github.com/visionmedia/mocha/wiki/Third-party-reporters describes using third party reporters in mocha.

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


Then you got the cute dog!

``` js
15  -_-_-_-_-_-_-_-_-_-_- /)_/)
0   -_-_-_-_-_-_-_-_-_-_ < ^ .^>
0   -_-_-_-_-_-_-_-_- ﾉ) /　　|
    -_-_-_-_-_-_-_-_- ＼(＿＿_)
15 passing (22ms)

```
