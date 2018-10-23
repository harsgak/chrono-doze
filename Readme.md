# chrono-doze
Sleeping patterns on 24-h clock-face  
[[Try it here]](https://harsgak.github.io/chrono-doze/chrono-doze.html)

## Quickstart

First clone (download) this repository to your device and navigate to the chrono-doze directory.
Then host it using any server of your choice.  

### Node.js
If you already have [node](https://nodejs.org/), getting chrono-doze up and running is as easy as :
1. Install requirements
```
npm install
```

2. Run server
```
node index.js
```

3. Open chrono-doze being served at http://localhost:8080/chrono-doze.html

### Python

Starting up chrono-doze with [python](https://www.anaconda.com/download/) is even simpler :

1. Run http.server
```
python -m http.server 8080
```

2. Open chrono-doze being served at http://localhost:8080/chrono-doze.html  

> Note: If you are stuck with Python 2.x use SimpleHTTPServer instead of http.server

## Input

The way to provide your sleep data to chrono-doze is old fasioned, yet straightforward.
1. [Export]() your sleep data from `SleepAsAndroid` and simply place your `sleep-export.csv` file 
into the data folder.
2. Reload the chrono-doze page with `Ctrl` + `F5` to load your data.

