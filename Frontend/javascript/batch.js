const token = localStorage.getItem("token");
const batchList = document.getElementById("batchList");
const batchForm = document.getElementById("batchForm");

let editBatchId = null; // Track edit mode

document.addEventListener("DOMContentLoaded", () => {
  const trainerSelect = document.getElementById("trainerId");
  const courseSelect = document.getElementById("courseId");

  // ✅ Load Trainers dynamically
  fetch("https://trainer-manager-backend.onrender.com/api/trainer", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(trainers => {
      trainers.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t._id;
        opt.textContent = t.name;
        trainerSelect.appendChild(opt);
      });
    })
    .catch(err => console.error("Error loading trainers:", err));

  // ✅ Load Courses dynamically
  fetch("https://trainer-manager-backend.onrender.com/api/course", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(courses => {
      courses.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c._id;
        opt.textContent = c.name;
        courseSelect.appendChild(opt);
      });
    })
    .catch(err => console.error("Error loading courses:", err));

  // Load existing batches
  loadBatches();

  // ✅ Handle Create/Update Batch
  batchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      intime: document.getElementById("intime").value,
      outtime: document.getElementById("outtime").value,
      trainerId: trainerSelect.value,
      courseId: courseSelect.value
    };

    try {
      let url = "https://trainer-manager-backend.onrender.com/api/batch";
      let method = "POST";

      if (editBatchId) {
        url = `https://trainer-manager-backend.onrender.com/api/batch/${editBatchId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.msg || "Batch saved successfully");
        batchForm.reset();
        trainerSelect.selectedIndex = 0;
        courseSelect.selectedIndex = 0;
        editBatchId = null;
        loadBatches();
      } else {
        alert(result.msg || "Failed to save batch");
      }
    } catch (err) {
      console.error("Error saving batch:", err);
    }
  });
});

// ✅ Load all batches
async function loadBatches() {
  try {
    const res = await fetch("https://trainer-manager-backend.onrender.com/api/batch", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load batches");
    const batches = await res.json();

    batchList.innerHTML = "";
    batches.forEach(b => {
      const card = document.createElement("div");
      card.classList.add("batch-card");
      card.innerHTML = `
        <h3>${b.name}</h3>
        <p><strong>Trainer:</strong> ${b.trainerName}</p>
        <p><strong>Course:</strong> ${b.courseName}</p>
        <p><strong>Time:</strong> ${b.intime} - ${b.outtime}</p>
        <div class="batch-actions">
          <button onclick="editBatch('${b._id}')">Edit</button>
          <button onclick="deleteBatch('${b._id}')">Delete</button>
        </div>`;
      batchList.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading batches:", err);
  }
}

// ✅ Edit Batch
async function editBatch(id) {
  try {
    const res = await fetch(`https://trainer-manager-backend.onrender.com/api/batch/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch batch");

    const b = await res.json();
    document.getElementById("name").value = b.name;
    document.getElementById("intime").value = b.intime;
    document.getElementById("outtime").value = b.outtime;
    document.getElementById("trainerId").value = b.trainerId;
    document.getElementById("courseId").value = b.courseId;

    editBatchId = b._id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Error editing batch:", err);
  }
}

// ✅ Delete Batch
async function deleteBatch(id) {
  if (!confirm("Delete this batch?")) return;
  try {
    const res = await fetch(`https://trainer-manager-backend.onrender.com/api/batch/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    alert(result.msg || "Batch deleted");
    loadBatches();
  } catch (err) {
    console.error("Error deleting batch:", err);
  }
}
