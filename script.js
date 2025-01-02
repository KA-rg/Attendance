// Predefined 4-digit password (for simplicity)
const correctPassword = '1234';  // This is the password for login

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const presentBtn = document.getElementById('present-btn');
const absentBtn = document.getElementById('absent-btn');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const loginContainer = document.getElementById('login-container');
const attendanceContainer = document.getElementById('attendance-container');
const userNameElement = document.getElementById('user-name');
const subjectSelect = document.getElementById('subject-select');
const subjectNameInput = document.getElementById('subject-name');
const addSubjectBtn = document.getElementById('add-subject-btn');
const attendanceSummary = document.getElementById('attendance-summary');

// Event Listener for Login Button
loginBtn.addEventListener('click', () => {
  const enteredPassword = passwordInput.value;
  
  // Check if the entered password matches the correct one
  if (enteredPassword === correctPassword) {
    // Store the login status in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'User');  // You can customize the username
    loginContainer.style.display = 'none';
    attendanceContainer.style.display = 'block';
    userNameElement.textContent = 'User';
    errorMessage.style.display = 'none';  // Hide error message
    loadAttendanceData();
  } else {
    // Show error message if the password is incorrect
    errorMessage.style.display = 'block';
  }
});

// Event Listener for Logout Button
logoutBtn.addEventListener('click', () => {
  // Clear login status from localStorage
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  
  loginContainer.style.display = 'block';
  attendanceContainer.style.display = 'none';
});

// Event Listener for Add Subject Button
addSubjectBtn.addEventListener('click', () => {
  const subjectName = subjectNameInput.value.trim();
  
  if (subjectName !== '') {
    // Add the subject to the list and update the localStorage
    let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    subjects.push(subjectName);
    localStorage.setItem('subjects', JSON.stringify(subjects));
    
    // Add the subject to the dropdown
    const option = document.createElement('option');
    option.textContent = subjectName;
    option.value = subjectName;
    subjectSelect.appendChild(option);

    subjectNameInput.value = ''; // Clear input field
    loadAttendanceData(); // Reload the attendance summary
  }
});

// Event Listener for Present Button
presentBtn.addEventListener('click', () => {
  markAttendance('Present');
});

// Event Listener for Absent Button
absentBtn.addEventListener('click', () => {
  markAttendance('Absent');
});

// Function to mark attendance and save to localStorage
function markAttendance(status) {
  const selectedSubject = subjectSelect.value;
  
  if (selectedSubject) {
    const userName = localStorage.getItem('userName');
    const attendance = {
      subject: selectedSubject,
      name: userName,
      status: status,
      timestamp: new Date().toISOString(),
    };

    // Store attendance data in localStorage
    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
    if (!attendanceData[selectedSubject]) {
      attendanceData[selectedSubject] = { present: 0, absent: 0 };
    }
    attendanceData[selectedSubject][status.toLowerCase()] += 1;
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    
    alert(`${status} attendance marked for ${selectedSubject}`);
    loadAttendanceData(); // Reload the attendance summary
  } else {
    alert('Please select a subject');
  }
}

// Function to load attendance data and display the count
function loadAttendanceData() {
  const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
  const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

  // Clear previous summary
  attendanceSummary.innerHTML = '';

  subjects.forEach(subject => {
    const presentCount = attendanceData[subject]?.present || 0;
    const absentCount = attendanceData[subject]?.absent || 0;
    
    const listItem = document.createElement('li');
    listItem.textContent = `${subject}: Present - ${presentCount}, Absent - ${absentCount}`;
    attendanceSummary.appendChild(listItem);
  });
}

// Event listener to delete subjects data from localStorage
const deleteSubjectsBtn = document.getElementById('delete-subjects-btn');
deleteSubjectsBtn.addEventListener('click', () => {
  // Remove subjects data from localStorage
  localStorage.removeItem('subjects');
  subjectSelect.innerHTML = '<option value="">Select Subject</option>'; // Clear dropdown
  loadAttendanceData(); // Refresh the attendance summary
  alert('All subjects have been deleted');
});

// Event listener to delete attendance data from localStorage
const deleteAttendanceBtn = document.getElementById('delete-attendance-btn');
deleteAttendanceBtn.addEventListener('click', () => {
  // Remove attendance data from localStorage
  localStorage.removeItem('attendanceData');
  loadAttendanceData(); // Refresh the attendance summary
  alert('Attendance data has been deleted');
});

// Event listener to clear all data from localStorage
const clearAllDataBtn = document.getElementById('clear-all-btn');
clearAllDataBtn.addEventListener('click', () => {
  // Clear all data in localStorage
  localStorage.clear();
  loadAttendanceData(); // Refresh the attendance summary
  alert('All data has been cleared');
});

// Check login status on page load
window.onload = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    loginContainer.style.display = 'none';
    attendanceContainer.style.display = 'block';
    userNameElement.textContent = localStorage.getItem('userName');
    loadAttendanceData();
  } else {
    loginContainer.style.display = 'block';
    attendanceContainer.style.display = 'none';
  }
};
