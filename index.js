const fetchBreedDescription = require("./breedFetcher");
const readline = require("readline");
const fs = require("fs");

// Get user input from command line arguments
const userInput = process.argv.slice(2);

// Create readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const breedName = userInput[0];
const filePath = userInput[1];

fetchBreedDescription(breedName, (error, desc) => {
  if (error) {
    console.log("Error fetch details:", error);
    process.exit();
  } else {
    console.log(desc);

    // Check if file path is provided
    if (userInput.length !== 2) {
      process.exit();
    }

    // Prompt the user to confirm writing to the file
    rl.question(
      `The size of this information is ${desc.length} bytes. Do you want to write it to the specified file? (Y/N?)`,
      (answer) => {
        // Check user's answer to proceed or cancel
        if (answer.toUpperCase() !== "Y" && answer.toUpperCase() !== "YES") {
          console.log("Operation cancelled by user.");
          rl.close();
          return;
        }

        // Write description to the specified local file
        fs.writeFile(filePath, desc, (error) => {
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
  }
});
