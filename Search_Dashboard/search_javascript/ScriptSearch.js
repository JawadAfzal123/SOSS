const urlParams = new URLSearchParams(window.location.search);
const queryFromURL = urlParams.get('query');
console.log(queryFromURL)
if (queryFromURL) {
    const queryInput = document.getElementById("queryInput");
    queryInput.value = queryFromURL;
    getResponse(); 
}

async function getResponse() {
    const queryInput = document.getElementById("queryInput");
    const userQuestionElement = document.getElementById("userQuestion");
    const queryAnswerElement = document.getElementById("queryAnswer");
    const loader = document.getElementById("loader");

    const query = queryInput.value;
    const profileId = 1; // Hardcoded profile ID

    if (query.trim() === "") {
        userQuestionElement.textContent = "Please ask a question, I am here to assisst you.";
        queryAnswerElement.textContent = "";
        return;
    }

    userQuestionElement.textContent = "Question: " + query;
    loader.style.display = "block"; // Show the loader

    const requestBody = {
        "search_query": query // Modify the request body structure to match API expectations

    };



    try {
        const response = await fetch(`http://51.20.133.249:8000/get_response/${profileId}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.status === 200) {
            const responseData = await response.json();
            const formattedResponse = formatResponse(responseData.response);

            const paragraphs = formattedResponse.split('\n');
            let formattedParagraphs = '';

            for (const paragraph of paragraphs) {
                if (paragraph.includes('[')) {
                    formattedParagraphs += `<p>${paragraph}</p>`;
                } else {
                    if (paragraph.startsWith('-')) {
                        formattedParagraphs += `<li>${paragraph.substring(1)}</li>`;
                    } else {
                        formattedParagraphs += `<p>${paragraph}</p>`;
                    }
                }
            }

            queryAnswerElement.innerHTML = formattedParagraphs;
        } else {
            queryAnswerElement.textContent = "Error: Unable to get a response from the server.";
        }
    } catch (error) {
        queryAnswerElement.textContent = "Error: " + error.message;
    } finally {
        loader.style.display = "none";
    }
}

function formatResponse(response) {
    return processThumbnails(processLinks(processPoints(response)));
}

function processThumbnails(text) {
    const thumbnailRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    return text.replace(thumbnailRegex, (match, alt, url) => {
        return `<img src="${url}" alt="${alt}" /><br>`;
    });
}

function processLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => {
        return `<a href="${url}" target="_blank" style="color: blue">${url}</a>`;
    });
}



function processPoints(text) {
    return text.replace(/\-/g, '<li>');
}

if (query) {
    getResponse(query);
}
