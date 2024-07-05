// Add click event listener to the submit button to call addWord function when clicked
document.getElementById('submitButton').addEventListener('click', addWord);

// Add keydown event listener to the word input field to call addWord function when Enter key is pressed
document.getElementById('wordInput').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) { // Check if Enter key is pressed
        addWord();
    }
});

// Array of features to be displayed (Definitions, Examples, Synonyms, Rhymes)
const features = ['Definitions', 'Examples', 'Synonyms', 'Rhymes'];

// Variable to keep track of the currently displayed feature index
let currentFeatureIndex = 0;

// Object to store the content for each feature
let content = {};

// Variable to store the current word being processed
let currentWord = '';

// Function to add event listeners to the left and right arrow buttons for feature navigation
function addArrowEventListeners() {
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');
    if (leftArrow && rightArrow) {
        // Add click event listener to the left arrow to move to the previous feature
        leftArrow.addEventListener('click', () => {
            currentFeatureIndex = (currentFeatureIndex === 0) ? features.length - 1 : currentFeatureIndex - 1;
            updateFeature();
        });

        // Add click event listener to the right arrow to move to the next feature
        rightArrow.addEventListener('click', () => {
            currentFeatureIndex = (currentFeatureIndex === features.length - 1) ? 0 : currentFeatureIndex + 1;
            updateFeature();
        });
    }
}

// Function to update the displayed feature based on the current feature index
function updateFeature() {
    const featureHeading = features[currentFeatureIndex];
    updatecurrentFeature();
}

// Function to fetch and display data for the entered word
function addWord() {
    const word = document.getElementById('wordInput').value; // Get the word from the input field
    document.getElementById('wordInput').value = ''; // Clear the input field

    // Fetch main word data from the server
    fetch(`/api/word/${word}`)
    .then(response => response.json()) // Parse the response as JSON
    .then(wordData => {
        console.log('API response: ', wordData); // Log the API response for debugging
        if (!wordData || !wordData.results) {
            throw new Error('Invalid word or no data found.'); // Throw error if no data found
        }

        currentWord = word; // Update the current word

        // Extract examples and synonyms from the word data
        const examples = wordData.results.flatMap(result => result.examples || []);
        const synonyms = wordData.results.flatMap(result => result.synonyms || []);

        // Fetch rhymes separately
        return fetch(`/api/word/${word}/rhymes`)
            .then(rhymeResponse => rhymeResponse.json()) // Parse the rhyme response as JSON
            .then(rhymeData => {
                const rhymes = rhymeData.rhymes && rhymeData.rhymes.all ? rhymeData.rhymes.all : [];
                displayWordData(wordData.results, word, examples, synonyms, rhymes); // Display the word data
            });
    })
    .catch(error => {
        console.error('Error:', error.message); // Log any errors
        document.getElementById('wordData').innerHTML = `<p>Error: ${error.message}</p>`; // Display error message
    });
}

// Function to display the fetched word data in the HTML
function displayWordData(results, word, examples, synonyms, rhymes) {
    // Create HTML list items for definitions
    const definitions = results.map(result => {
        console.log('Definition:', result.definition); // Log each definition for debugging
        return result.definition ? `<li>${result.definition}</li>` : ''; // Create list item if definition exists
    }).join('');
    
    // Create HTML list items for examples, synonyms, and rhymes
    const exampleList = examples.map(example => `<li>${example}</li>`).join('');
    const synonymList = synonyms.map(synonym => `<li>${synonym}</li>`).join('');
    const rhymesList = rhymes.map(rhyme => `<li>${rhyme}</li>`).join('');

    // Update the global content variable with the HTML for each feature
    content = {
        Definitions: `<ul>${definitions}</ul>`,
        Examples: `<ul>${exampleList}</ul>`,
        Synonyms: `<ul>${synonymList}</ul>`,
        Rhymes: `<ul>${rhymesList}</ul>`
    };

    console.log('Content object:', content); // Log the content object for debugging
    updatecurrentFeature(); // Update the displayed feature
}

// Function to update the displayed content for the current feature
function updatecurrentFeature() {
    const featureHeading = features[currentFeatureIndex]; // Get the current feature heading
    console.log('Current feature heading:', featureHeading); // Log the current feature heading for debugging
    console.log('Content for current feature:', content[featureHeading]); // Log the content for the current feature
    const featureContent = content[featureHeading]; // Get the content for the current feature

    // Update the HTML with the current word, feature heading, and feature content
    document.getElementById('wordData').innerHTML = `
        <h2>${currentWord}</h2>
        <div class="feature-container">
            <span id="leftArrow" class="arrow">&#8592;</span>
            <p><strong>${featureHeading}:</strong></p>
            <span id="rightArrow" class="arrow">&#8594;</span>
        </div>
        ${featureContent}
    `;

    addArrowEventListeners(); // Re-attach event listeners to the arrows after updating innerHTML
}
