const API_BASE = "http://localhost:5500/api/trainer";
const COURSE_API = "http://localhost:5500/api/course";
const token = localStorage.getItem("token");

if (!token) {
  alert("Please log in first!");
  window.location.href = "login.html";
}

const trainerForm = document.getElementById("trainerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const courseSelect = document.getElementById("course");
const notesInput = document.getElementById("notes");
const trainerListContainer = document.getElementById("trainer-list");

let editTrainerId = null;

async function loadCourses() {
  try {
    const res = await fetch(COURSE_API, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load courses");

    const courses = await res.json();

    courseSelect.innerHTML = `<option value="" disabled selected>Select Course</option>`; // reset first

    courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.name;
      courseSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading courses:", err);
    alert("Could not load courses");
  }
}

trainerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const trainerData = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    courseId: courseSelect.value,
    notes: notesInput.value,
  };

  try {
    const url = editTrainerId ? `${API_BASE}/${editTrainerId}` : API_BASE;
    const method = editTrainerId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(trainerData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Operation failed");

    alert(data.msg || (editTrainerId ? "Trainer updated" : "Trainer added"));
    trainerForm.reset();
    editTrainerId = null;
    loadTrainers();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

async function loadTrainers() {
  try {
    const res = await fetch(API_BASE, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const trainers = await res.json();

    trainerListContainer.innerHTML = "";

    if (trainers.length === 0) {
      trainerListContainer.innerHTML = "<p>No trainers found.</p>";
      return;
    }

    trainers.forEach(trainer => {
      const div = document.createElement("div");
      div.classList.add("trainer-card");
      div.innerHTML = `
        <h3>${trainer.name}</h3>
        <p><strong>Email:</strong> ${trainer.email}</p>
        <p><strong>Phone:</strong> ${trainer.phone}</p>
        <p><strong>Course:</strong> ${trainer.course?.name || "Unknown"}</p>
        <p><strong>Notes:</strong> ${trainer.notes}</p>
        <div class="trainer-actions">
          <button onclick="editTrainer('${trainer._id}')">Edit</button>
          <button onclick="deleteTrainer('${trainer._id}')">Delete</button>
        </div>
      `;
      trainerListContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading trainers:", err);
    alert("Failed to load trainers");
  }
}

window.editTrainer = async function (id) {
  try {
    const res = await fetch(API_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const trainers = await res.json();
    const trainer = trainers.find(t => t._id === id);
    if (!trainer) return alert("Trainer not found");

    nameInput.value = trainer.name;
    emailInput.value = trainer.email;
    phoneInput.value = trainer.phone;
    courseSelect.value = trainer.course?._id || "";
    notesInput.value = trainer.notes;

    editTrainerId = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    alert("Error fetching trainer data");
  }
};

window.deleteTrainer = async function (id) {
  if (!confirm("Are you sure you want to delete this trainer?")) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Delete failed");

    alert(data.message || "Trainer deleted");
    loadTrainers();
  } catch (err) {
    alert("Error: " + err.message);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  loadCourses();
  loadTrainers();
});
