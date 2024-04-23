const request = require("request");

const fetchBreedDescription = (breedName, callback) => {
  // Construct the URL for the Cat API based on user input
  const url = "https://api.thecatapi.com/v1/breeds/search?q=" + breedName;

  // Make a request to the Cat API
  request(url, (error, response, content) => {
    // Handle request errors
    if (error) {
      callback(error, null); // Callback with error
      return;
    }

    // Parse the returned JSON content
    const data = JSON.parse(content);

    // Check if the returned data is empty
    if (data.length === 0) {
      callback("Sorry, the requested information is not found. Please check your spelling or text format and try again.", null);
      return;
    }

    // Log the status code of the response
    console.log("Status code:", response && response.statusCode);

    // Extract description
    const description = data[0].description;

    // Callback with description
    callback(null, description);
  });
};

module.exports = fetchBreedDescription;
