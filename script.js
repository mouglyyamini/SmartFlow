const startBtn = document.getElementById("startBtn");
const status = document.getElementById("status");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const countdownDisplay = document.getElementById("countdown");

let smartFlowTimer = null;

// Start simulation
startBtn.addEventListener("click", function () {
    status.textContent = "Traffic simulation started!";
    startBtn.textContent = "Simulation Running";
});

// Analyze traffic
analyzeBtn.addEventListener("click", function () {
    const roads = {
        "North Road": Number(document.getElementById("north").value),
        "South Road": Number(document.getElementById("south").value),
        "East Road": Number(document.getElementById("east").value),
        "West Road": Number(document.getElementById("west").value)
    };

    // Validate inputs
    for (const [road, count] of Object.entries(roads)) {
        const id = road.split(" ")[0].toLowerCase();
        const input = document.getElementById(id);

        if (
            input.value.trim() === "" ||
            !Number.isInteger(count) ||
            count < 0
        ) {
            result.textContent =
                "Enter valid, non-negative whole numbers for all roads.";
            return;
        }
    }

    // Find busiest road
    const busiestRoad = Object.keys(roads).reduce((a, b) =>
        roads[a] > roads[b] ? a : b
    );

    const vehicles = roads[busiestRoad];
    const greenTime = Math.min(60, Math.max(15, 15 + vehicles));

    result.innerHTML = `
        <h3>Traffic Analysis Result</h3>
        <p>Busiest Road: <strong>${busiestRoad}</strong></p>
        <p>Waiting Vehicles: <strong>${vehicles}</strong></p>
        <p>Suggested Green Time: <strong>${greenTime} seconds</strong></p>
    `;

    // Update traffic lights
    const directions = {
        "North Road": "north",
        "South Road": "south",
        "East Road": "east",
        "West Road": "west"
    };

    for (const [road, id] of Object.entries(directions)) {
        const light = document.getElementById("light-" + id);
        const statusText = document.getElementById("status-" + id);

        light.querySelectorAll("span").forEach(span => {
            span.classList.remove("active");
        });

        if (road === busiestRoad) {
            light.querySelector(".green").classList.add("active");
            statusText.textContent = "GREEN — Go";
        } else {
            light.querySelector(".red").classList.add("active");
            statusText.textContent = "RED — Stop";
        }
    }

    // Restart countdown
    if (smartFlowTimer !== null) {
        clearInterval(smartFlowTimer);
    }

    let remainingTime = greenTime;
    countdownDisplay.textContent =
        `Green light for ${busiestRoad}: ${remainingTime} seconds remaining`;

    smartFlowTimer = setInterval(function () {
        remainingTime--;

        if (remainingTime > 0) {
            countdownDisplay.textContent =
                `Green light for ${busiestRoad}: ${remainingTime} seconds remaining`;
        } else {
            clearInterval(smartFlowTimer);
            smartFlowTimer = null;
            countdownDisplay.textContent =
                "Timer ended. Analyze traffic again to recalculate.";
        }
    }, 1000);
});