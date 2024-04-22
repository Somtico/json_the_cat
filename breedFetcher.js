const request = require("request");
const readline = require("readline");
const fs = require("fs");

// Get user input from command line arguments
const userInput = process.argv.slice(2);

// Create readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Construct the URL for the Cat API based on user input
const url = "https://api.thecatapi.com/v1/breeds/search?q=" + userInput[0];
const filePath = userInput[1];

// Make a request to the Cat API
request(url, (error, response, content) => {
  // Handle request errors
  if (error) {
    console.log("There was an error with your request:", error);
    process.exit();
  }

  // Parse the returned JSON content
  const data = JSON.parse(content);

  // Check if the returned data is empty
  if (data.length === 0) {
    console.log(
      "Sorry, the requested information is not found. Please check your spelling or text format and try again."
    );
    process.exit();
  }

  // Log the status code of the response
  console.log("Status code:", response && response.statusCode);

  // Function to extract description from the data
  const output = (data) => {
    for (let array of data) {
      for (let key in array) {
        if (key === "description") {
          return array[key]; // Return the description
        }
      }
    }
  };

  // Log the description to the console
  console.log(output(data), "\n");

  // Check if file path is provided
  if (userInput.length !== 2) {
    process.exit();
  }

  // Prompt the user to confirm writing to the file
  rl.question(
    `The size of this information is ${content.length} bytes. Do you want to write it to the specified file? (Y/N?)`,
    (answer) => {
      // Check user's answer to proceed or cancel
      if (answer.toUpperCase() !== "Y" && answer.toUpperCase() !== "YES") {
        console.log("Operation cancelled by user.");
        rl.close();
        return;
      }

      // Write description to the specified local file
      fs.writeFile(filePath, output(data), (error) => {
        if (error) {
          console.log("Error:", error);
          rl.close();
          return;
        }

        // Confirm successful write operation
        console.log(
          `The information has been downloaded and saved to ${filePath}`
        );
        rl.close();
      });
    }
  );
});
