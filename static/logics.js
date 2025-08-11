document.addEventListener("DOMContentLoaded", function () {
    // Start Analyzing button
    const startButton = document.querySelector(".start-button");
    if (startButton) {
        startButton.classList.add("scale-animation");
        setTimeout(() => {
            startButton.classList.remove("scale-animation");
        }, 500);
    }

    // Emotion Analysis Logic
    const analyzeButton = document.getElementById("analyzeButton");
    const textInput = document.getElementById("textInput");
    const emotionOutput = document.getElementById("emotionOutput");
    const copyMsg = document.getElementById("copyMsg");
    let emotionChart; // For storing chart instance

    if (analyzeButton && textInput && emotionOutput && copyMsg) {
        analyzeButton.addEventListener("click", async function () {
            const inputText = textInput.value.trim();

            if (inputText === "") {
                showMessage(copyMsg, "Please enter some text!", "red");
                return;
            }

            showMessage(copyMsg, "Analyzing...", "#454545");

            try {
                const response = await fetch("http://127.0.0.1:5000/predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: inputText }),
                });

                if (!response.ok) throw new Error("Error analyzing text");

                const data = await response.json();

                if (data.predicted_emotion) {
                    emotionOutput.textContent = data.predicted_emotion;
                    showMessage(copyMsg, "Emotion analyzed successfully!", "#9ccbb8");

                    // Update chart with new emotion scores
                    if (data.emotion_scores) {
                        updateBarChart(data.emotion_scores);
                    }
                } else {
                    throw new Error("No emotion detected");
                }
            } catch (error) {
                showMessage(copyMsg, "Analysis failed. Please try again.", "red");
                console.error("Error:", error);
            }
        });
    }

    // Redirect to Contact Page
    const toggleButton = document.getElementById("toggleFeedback");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            window.location.href = "contact.html";
        });
    }

    // Contact Form Validation
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const message = document.getElementById("message");

            if (!validateForm(name, email, message)) return;

            alert("Thank you for contacting us! We will get back to you shortly.");
            event.target.submit();
        });
    }

    // Chart.js: Bar chart of 7 emotions
    const ctx = document.getElementById("emotionChart")?.getContext("2d");
    if (ctx) {
        emotionChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["neutral", "anger", "disgust", "fear", "joy", "sadness", "surprise"],
                datasets: [{
                    label: "",
                    data: Array(7).fill(0),
                    backgroundColor: [
                        "#808080", // neutral
                        "#FF4500", // anger
                        "#3CB371", // disgust
                        "#708090", // fear
                        "#FFD700", // joy
                        "#1E90FF", // sadness
                        "#9370DB"  // surprise
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                legend: {
                    display: false 
                }
            },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }

    // Update bar chart with emotion scores
    function updateBarChart(scores) {
       
        const emotions = ["neutral", "anger", "disgust", "fear", "joy", "sadness", "surprise"];
        const values = emotions.map(e => (scores[e] || 0));
        emotionChart.data.datasets[0].data = values;
        emotionChart.update();
    }
});

function showMessage(element, message, color) {
    element.textContent = message;
    element.style.color = color;
    setTimeout(() => { element.textContent = ""; }, 2000);
}

function validateForm(name, email, message) {
    if (!name.value.trim()) {
        alert("Please enter your name.");
        name.focus();
        return false;
    }

    if (!email.value.trim()) {
        alert("Please enter your email.");
        email.focus();
        return false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    if (!emailPattern.test(email.value)) {
        alert("Please enter a valid email address.");
        email.focus();
        return false;
    }

    if (!message.value.trim()) {
        alert("Please enter your message.");
        message.focus();
        return false;
    }

    return true;
}