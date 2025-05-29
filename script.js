// script.js

// Function to toggle the navigation sidebar
function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const body = document.body;
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        document.querySelector('.container').style.marginLeft = "auto";
        body.classList.remove('no-scroll'); // Allow scrolling
    } else {
        sidebar.style.width = "250px";
        // Adjust content margin to prevent overlap on larger screens
        if (window.innerWidth > 768) { // Example breakpoint for larger screens
            document.querySelector('.container').style.marginLeft = "260px";
        }
        body.classList.add('no-scroll'); // Prevent scrolling
    }
}

// Close sidebar if clicked outside (optional, but good UX)
window.onclick = function(event) {
    const sidebar = document.getElementById("mySidebar");
    const hamburger = document.querySelector(".hamburger-menu");
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.style.width === "250px") {
        toggleNav();
    }
}

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to number headings and subheadings
function numberHeadings() {
    let sectionCounters = {
        h2: 0,
        h3: 0,
        h4: 0
    };
    const sections = document.querySelectorAll('section');

    sections.forEach((section, index) => {
        // Reset sub-counters for each new H2 section
        sectionCounters.h3 = 0;
        sectionCounters.h4 = 0;

        const h2 = section.querySelector('h2');
        if (h2) {
            sectionCounters.h2++;
            h2.innerHTML = `${sectionCounters.h2}. ${h2.textContent.replace(/^\d+\.\s*/, '')}`; // Remove old number if exists
            // Update sidebar link text
            const sidebarLink = document.querySelector(`.nav-sidebar a[href="#${section.id}"]`);
            if (sidebarLink) {
                sidebarLink.textContent = h2.textContent;
            }
        }

        const h3s = section.querySelectorAll('h3');
        h3s.forEach(h3 => {
            sectionCounters.h3++;
            sectionCounters.h4 = 0; // Reset h4 counter for each new h3
            h3.innerHTML = `${sectionCounters.h2}.${sectionCounters.h3}. ${h3.textContent.replace(/^\d+\.\d+\.\s*/, '')}`;
        });

        const h4s = section.querySelectorAll('h4');
        h4s.forEach(h4 => {
            sectionCounters.h4++;
            h4.innerHTML = `${sectionCounters.h2}.${sectionCounters.h3}.${sectionCounters.h4}. ${h4.textContent.replace(/^\d+\.\d+\.\d+\.\s*/, '')}`;
        });
    });
}

// Call numbering function on page load
document.addEventListener('DOMContentLoaded', numberHeadings);


// --- Emoji Tense Visualization Logic ---
const emojiTimelineDisplay = document.getElementById('emoji-timeline-display');
const currentTenseNameDisplay = document.getElementById('current-tense-name');
const currentTenseDescriptionDisplay = document.getElementById('current-tense-description');

const tensesData = {
    "present-simple": {
        name: "Present Simple",
        description: "Used for habits, routines, facts, and general truths. Actions that are permanent, habitual, or universally true. Visualized as a continuous loop of actions.",
        emoji: "⬅️---📍---🔄---📍---➡️"
    },
    "present-continuous": {
        name: "Present Continuous",
        description: "For actions happening now, temporary situations, or trends developing at the moment of speaking. Emphasizes the ongoing nature of an action. Visualized as an action currently in progress.",
        emoji: "⬅️---⏳---➡️"
    },
    "present-perfect": {
        name: "Present Perfect",
        description: "For actions that started in the past and continue to the present, or actions completed at an unspecified time in the past with a present result. Connects a past event to the present.",
        emoji: "⬅️📍---➡️"
    },
    "present-perfect-continuous": {
        name: "Present Perfect Continuous",
        description: "For actions that started in the past and are still continuing, emphasizing duration up to the present moment. Visualized as an ongoing action that began in the past and extends to now.",
        emoji: "⬅️⏳---➡️"
    },
    "past-simple": {
        name: "Past Simple",
        description: "For completed actions at a specific time in the past. Describes a single, finished action or state in the past. Visualized as a single point in the past.",
        emoji: "⬅️---📍---"
    },
    "past-continuous": {
        name: "Past Continuous",
        description: "For actions that were ongoing at a specific time in the past, often interrupted by another action. Useful for setting context or background. Visualized as an ongoing action in the past.",
        emoji: "⬅️---⏳---📍"
    },
    "past-perfect": {
        name: "Past Perfect",
        description: "For an action that happened before another action in the past. Essential for showing sequence of past events. Visualized as an action completed before another past action.",
        emoji: "⏪📍---⬅️📍---"
    },
    "past-perfect-continuous": {
        name: "Past Perfect Continuous",
        description: "For an action that was ongoing for a period before another past action. Emphasizes duration leading up to a past point. Visualized as an ongoing action that finished before a specific past point.",
        emoji: "⏪⏳---⬅️📍---"
    },
    "future-simple": {
        name: "Future Simple (will/be going to)",
        description: "For predictions, promises, or spontaneous decisions. Used when discussing future trends or solutions. Visualized as a single point in the future.",
        emoji: "---📍➡️"
    },
    "future-continuous": {
        name: "Future Continuous",
        description: "For actions that will be ongoing at a specific time in the future. Useful for describing future scenarios or overlapping future events. Visualized as an action that will be in progress in the future.",
        emoji: "---⏳➡️"
    },
    "future-perfect": {
        name: "Future Perfect",
        description: "For an action that will be completed before a specific time or another action in the future. Highly useful for projections. Visualized as an action that will be completed by a future deadline.",
        emoji: "---📍🏁➡️"
    },
    "future-perfect-continuous": {
        name: "Future Perfect Continuous",
        description: "For an action that will have been ongoing for a period before a specific time in the future. Emphasizes duration leading up to a future point. Visualized as an ongoing action that will culminate by a future deadline.",
        emoji: "---⏳🏁➡️"
    }
};

// Function to update the tense visualization
function updateTenseVisualization(tenseId) {
    const data = tensesData[tenseId];

    // Remove active class from all rows
    document.querySelectorAll('.tense-table-row').forEach(row => {
        row.classList.remove('active');
    });

    if (tenseId) {
        // Add active class to the clicked row
        const activeRow = document.querySelector(`.tense-table-row[data-tense-id="${tenseId}"]`);
        if (activeRow) {
            activeRow.classList.add('active');
        }
    }

    if (data) {
        currentTenseNameDisplay.textContent = data.name;
        currentTenseDescriptionDisplay.textContent = data.description;
        emojiTimelineDisplay.textContent = data.emoji; // Display the emoji string
    } else {
        currentTenseNameDisplay.textContent = "Click a tense in the table below to see its emoji timeline!";
        currentTenseDescriptionDisplay.textContent = "";
        emojiTimelineDisplay.textContent = "⬅️ Past | Now | Future ➡️"; // Default emoji timeline
    }
}

// Add event listeners to table rows for tense visualization
document.querySelectorAll('.tense-table-row').forEach(row => {
    row.addEventListener('click', function() {
        const tenseId = this.dataset.tenseId;
        updateTenseVisualization(tenseId);
    });
});

// Initialize emoji visualization on window load
window.onload = function () {
    updateTenseVisualization(null); // Set initial state
}

// --- AI-Powered Sentence Enhancer Logic ---
const sentenceInput = document.getElementById('sentenceInput');
const enhanceButton = document.getElementById('enhanceButton');
const outputArea = document.getElementById('outputArea');
const loadingIndicator = document.getElementById('loadingIndicator');
const enhancedSentenceHeader = document.getElementById('enhancedSentenceHeader');
const enhancedSentence = document.getElementById('enhancedSentence');
const explanationHeader = document.getElementById('explanationHeader');
const explanation = document.getElementById('explanation');

enhanceButton.addEventListener('click', async () => {
    const userSentence = sentenceInput.value.trim();

    if (!userSentence) {
        enhancedSentence.textContent = "Please enter a sentence to enhance.";
        explanation.textContent = "";
        enhancedSentenceHeader.classList.remove('hidden');
        explanationHeader.classList.add('hidden');
        return;
    }

    // Clear previous output and show loading
    enhancedSentence.textContent = "";
    explanation.textContent = "";
    enhancedSentenceHeader.classList.add('hidden');
    explanationHeader.classList.add('hidden');
    loadingIndicator.classList.add('active');
    enhanceButton.disabled = true; // Disable button during processing

    try {
        // Construct the prompt for the LLM
        const prompt = `You are an expert English grammar tutor specializing in IELTS Band 8+ writing.
        Enhance the following simple sentence by rephrasing it to use more complex and varied grammatical structures, suitable for academic writing.
        After providing the enhanced sentence, explain the specific grammatical changes you made (e.g., "Used a relative clause," "Incorporated a participle phrase," "Applied inversion," "Used nominalization," "Changed simple sentence to complex sentence").
        Format your response as a JSON object with two keys: "enhancedSentence" and "explanation".
        
        Example Input: "People like to use phones."
        Example Output:
        {
          "enhancedSentence": "The widespread adoption of mobile phones has significantly influenced human interaction patterns.",
          "explanation": "1. Used nominalization: 'People like to use phones' became 'The widespread adoption of mobile phones'.\n2. Incorporated an adverb of degree: 'significantly'.\n3. Changed a simple verb phrase to a more formal and descriptive one: 'influenced human interaction patterns'."
        }

        Now, enhance this sentence: "${userSentence}"`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "enhancedSentence": { "type": "STRING" },
                        "explanation": { "type": "STRING" }
                    },
                    "propertyOrdering": ["enhancedSentence", "explanation"]
                }
            }
        };

        const apiKey = ""; // Leave as is, Canvas will inject
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const jsonString = result.candidates[0].content.parts[0].text;
            const parsedResponse = JSON.parse(jsonString);

            enhancedSentence.textContent = parsedResponse.enhancedSentence;
            explanation.textContent = parsedResponse.explanation;
            enhancedSentenceHeader.classList.remove('hidden');
            explanationHeader.classList.remove('hidden');
        } else {
            enhancedSentence.textContent = "Could not enhance the sentence. Please try again.";
            explanation.textContent = "Unexpected API response structure.";
            enhancedSentenceHeader.classList.remove('hidden');
            explanationHeader.classList.remove('hidden');
        }

    } catch (error) {
        console.error("Error enhancing sentence:", error);
        enhancedSentence.textContent = "An error occurred while enhancing the sentence.";
        explanation.textContent = "Please check your network connection or try again later.";
        enhancedSentenceHeader.classList.remove('hidden');
        explanationHeader.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.remove('active');
        enhanceButton.disabled = false; // Re-enable button
    }
});
