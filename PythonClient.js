
PythonClient.run('./PythonClient.py', options, function (err, results) {
    if (err) throw err;
    
    console.log('results: %j', results);
  });