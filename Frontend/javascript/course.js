const API_URI = "http://localhost:5500/api/course";
const token = localStorage.getItem("token");

if (!token) {
  alert("Please log in first!");
  window.location.href = "login.html";
  }

const courseForm = document.getElementById("courseForm");
const courseList = document.getElementById("courseList");
const codeInput = document.getElementById("code");
const nameInput = document.getElementById("name");
const updateBtn = document.getElementById("updateBtn");

let editCourseId = null; 
async function loadCourses() {
  try {
    const res = await fetch(API_URI, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch courses");

    const courses = await res.json();
    courseList.innerHTML = "";

    courses.forEach(course => {
      const div = document.createElement("div");
      div.classList.add("course-card");
      div.innerHTML = `
        <h3>${course.name}</h3>
        <p><strong>Code:</strong> ${course.code}</p> 
        <button onclick="editCourse('${course._id}', '${course.code}', '${course.name}')">Edit</button>
        <button onclick="deleteCourse('${course._id}')"> Delete</button>
      `;
      courseList.appendChild(div);
    });
  } catch (err) {
    alert("Failed to load courses");
    console.error(err);
  }
}

courseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const courseData = {
    code: codeInput.value.trim(),
    name: nameInput.value.trim()
  };

  try {
    let url = API_URI;
    let method = "POST";

    if (editCourseId) {
      url = `${API_URI}/${editCourseId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });

    const data = await res.json();

    if (res.status === 409) {
      alert("Course with this code already exists!");
      return;
    }

    if (!res.ok) throw new Error(data.msg || "Error saving course");

    alert(editCourseId ? " Course Updated Successfully" : " Course Added Successfully");

    // Reset form
    courseForm.reset();
    editCourseId = null;
    updateBtn.style.display = "none";
    loadCourses();
  } catch (err) {
    alert("Error: " + err.message);
  }
});


window.editCourse = function (id, code, name) {
  codeInput.value = code;
  nameInput.value = name;
  editCourseId = id;

  updateBtn.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
};


window.deleteCourse = async function (id) {
  if (!confirm("Are you sure you want to delete this course?")) return;

  try {
    const res = await fetch(`${API_URI}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error deleting course");

    alert("🗑 Course Deleted");
    loadCourses();
  } catch (err) {
    alert("Error: " + err.message);
  }
};

document.addEventListener("DOMContentLoaded", loadCourses);
