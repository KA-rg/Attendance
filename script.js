const correctPassword = '1234'; // Predefined password for login
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
const subjectList = document.getElementById('subject-list');

// Event Listener for Login Button
loginBtn.addEventListener('click', () => {
  const enteredPassword = passwordInput.value;
  
  // Check if the entered password matches the correct one
  if (enteredPassword === correctPassword) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'User');  // Username can be customized
    loginContainer.style.display = 'none';
    attendanceContainer.style.display = 'block';
    userNameElement.textContent = 'User';
    errorMessage.style.display = 'none';
    loadAttendanceData();
  } else {
    errorMessage.style.display = 'block';
  }
});

// Event Listener for Logout Button
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  loginContainer.style.display = 'block';
  attendanceContainer.style.display = 'none';
});

// Event Listener for Add Subject Button
addSubjectBtn.addEventListener('click', () => {
  const subjectName = subjectNameInput.value.trim();
  
  if (subjectName !== '') {
    let subjects = JSON.parse(localStorage.getItem('subjects')) || ["Geotech", "Structural", "Environmental", "Transportation", "MA-203"];
    subjects.push(subjectName);
    localStorage.setItem('subjects', JSON.stringify(subjects));
    
    // Add subject to dropdown and subject list
    addSubjectToDropdown(subjectName);
    addSubjectToList(subjectName);
    subjectNameInput.value = ''; // Clear input
    loadAttendanceData(); // Refresh attendance summary
  }
});

// Function to add subject to dropdown
function addSubjectToDropdown(subjectName) {
  const option = document.createElement('option');
  option.textContent = subjectName;
  option.value = subjectName;
  subjectSelect.appendChild(option);
}

// Function to add subject to the list with a delete button
function addSubjectToList(subjectName) {
  const li = document.createElement('li');
  li.textContent = subjectName;
  
  // Create a delete button for each subject
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.marginLeft = '10px';
  deleteBtn.addEventListener('click', () => deleteSubject(subjectName));
  
  li.appendChild(deleteBtn);
  subjectList.appendChild(li);
}

// Function to delete a subject
function deleteSubject(subjectName) {
  let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
  
  // Remove the subject from the list
  subjects = subjects.filter(subject => subject !== subjectName);
  localStorage.setItem('subjects', JSON.stringify(subjects));
  
  // Remove subject from dropdown
  const options = subjectSelect.querySelectorAll('option');
  options.forEach(option => {
    if (option.value === subjectName) {
      option.remove();
    }
  });
  
  // Remove subject from the list in the UI
  const subjectItems = subjectList.querySelectorAll('li');
  subjectItems.forEach(item => {
    if (item.textContent === subjectName) {
      item.remove();
    }
  });
  
  // Reload attendance data
  loadAttendanceData();
}

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

    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
    if (!attendanceData[selectedSubject]) {
      attendanceData[selectedSubject] = { present: 0, absent: 0 };
    }
    attendanceData[selectedSubject][status.toLowerCase()] += 1;
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    
    alert(`${status} attendance marked for ${selectedSubject}`);
    loadAttendanceData();
  } else {
    alert('Please select a subject');
  }
}

// Function to reduce the attendance count
function reduceAttendance(subject, status) {
  let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
  if (attendanceData[subject] && attendanceData[subject][status] > 0) {
    attendanceData[subject][status] -= 1;
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    loadAttendanceData(); // Reload the data after reducing
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
    
    // Add reduce buttons for each status
    const reducePresentBtn = document.createElement('button');
    reducePresentBtn.textContent = 'Reduce Present';
    reducePresentBtn.addEventListener('click', () => reduceAttendance(subject, 'present'));
    
    const reduceAbsentBtn = document.createElement('button');
    reduceAbsentBtn.textContent = 'Reduce Absent';
    reduceAbsentBtn.addEventListener('click', () => reduceAttendance(subject, 'absent'));
    
    listItem.appendChild(reducePresentBtn);
    listItem.appendChild(reduceAbsentBtn);
    attendanceSummary.appendChild(listItem);
  });

  // Reload subject list (with delete buttons)
  subjectList.innerHTML = '';
  subjects.forEach(subject => {
    addSubjectToList(subject);
  });
}

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
