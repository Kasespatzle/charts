# Charts

Chart generator

## install
```bash
$ git clone https://github.com/Kasespatzle/charts
$ cd charts
$ npm start
```

## Example Usage

- Curl
```
$ curl -H "Content-Type: application/json" -X POST -d '{"label":"votos","labels":[1,2,3],"values":[10,20,30]}' localhost:3000

```
That will return the url to the generated chart
