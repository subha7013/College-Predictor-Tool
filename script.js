let collegeData = {};

// Load JSON data
async function loadCollegeData() {
  try {
    const response = await fetch("./data.json");
    collegeData = await response.json();
  } catch (error) {
    console.error("Error loading college data:", error);
  }
}

// Main prediction function
function predictColleges(exam, rank, preference, category) {
  const resultContainer = document.getElementById("prediction-results");
  resultContainer.innerHTML = "";

  // Check if data is loaded
  if (!collegeData || !collegeData[exam]) {
    resultContainer.innerHTML = "<p>Data not loaded yet. Try again.</p>";
    return;
  }

  // Validate inputs
  if (!exam || !rank || !preference || !category) {
    resultContainer.innerHTML = "<p>Please fill all the fields correctly.</p>";
    return;
  }

  const data = collegeData[exam][category];

  if (!data) {
    resultContainer.innerHTML = "<p>No data available for the selected exam and category.</p>";
    return;
  }

  // Filter colleges by rank and branch preference
  const predictedColleges = data.filter(college => rank <= college.rank && college.branch === preference);

  if (predictedColleges.length > 0) {
    const heading = document.createElement("h3");
    heading.textContent = "Predicted Colleges and Branches:";
    resultContainer.appendChild(heading);

    predictedColleges.forEach(college => {
      const div = document.createElement("div");
      div.classList.add("result-item");
      div.textContent = `${college.name} - ${college.branch} (Closing Rank: ${college.rank})`;
      resultContainer.appendChild(div);
    });
  } else {
    resultContainer.innerHTML = "<p>No colleges predicted for your rank and preference.</p>";
  }
}

// Form submit listener
document.getElementById("rank-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Load data if not loaded yet
  if (!Object.keys(collegeData).length) {
    await loadCollegeData();
  }

  const exam = document.getElementById("exam").value;
  const rank = parseInt(document.getElementById("rank").value);
  const preference = document.getElementById("preference").value;
  const category = document.getElementById("category").value;

  predictColleges(exam, rank, preference, category);
});
