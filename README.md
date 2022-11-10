# description
This program goes through lightning.json as a stream input line by line.
For each line it converts the lat/long info into quadKey format then finds a match 
in the assets.json file that gets converted into a map for faster lookup and shows an alert.

1- open command/terminal and run: npm install

# npm start
will start the app

navigate to homepage 
http://localhost:4000/

to run the lightning.json file process navigate to
http://localhost:4000/getinput
terminal will show alerts