let databaseURL;

if (__DEV__) {
	// databaseURL = "http://10.0.0.145:3000/api"; // Surface Pro IP address
	databaseURL = "http://10.0.0.78:3000/api"; // Macboox Pro IP address
	// databaseURL = "https://www.recipe-share.com/api";// Production server
	// databaseURL = "http://10.0.0.144:3000/api"
	// databaseURL = "http://10.0.0.78:3000/api" // testServer must be local ip. see package.json for command to get
	// databaseURL = "http://192.168.1.190:3000/api"
	// databaseURL = 'http://10.11.152.28:3000/api'
	// databaseURL = 'http://73.166.74.229:3000'
	// databaseURL = 'http://192.168.1.150:3000/api'
	// databaseURL = 'http://34.68.157.148'
	// databaseURL = 'http://10.11.21.101:3000'
	// databaseURL = 'http://168.168.1.68:3000'
	// databaseURL = 'http://172.17.37.201:3000'
	// databaseURL = "https://recipe-share-272202.appspot.com/api";
	// databaseURL = "https://20240314t133853-dot-recipe-share-272202.appspot.com/api";
} else {
	databaseURL = "https://www.recipe-share.com/api";
}

export { databaseURL };
