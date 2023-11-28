async function performSignIn(email, password) {
    const requestBody = { email, password };
    try {
        const response = await fetch("http://51.20.133.249:8000/docs#/default/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log('Sign-in successful');
            // Redirect to the dashboard page on successful sign-in
            window.location.href = "../Vemmo_Dashboard/youtube.html"; // Replace with the URL of your dashboard page
        } else {
            // Handle sign-in failure
            console.error('Sign-in failed');
            // Display an error message on the screen
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = 'Incorrect email or password. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
