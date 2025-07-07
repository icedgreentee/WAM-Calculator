const subjectsContainer = document.getElementById('subjectsContainer');
const addSubjectBtn = document.getElementById('addSubjectBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Create component input row inside a subject
function createComponentRow(subjectDiv, componentName = '', score = '', weight = '') {
  const div = document.createElement('div');
  div.classList.add('component-row');

  div.innerHTML = `
    <input type="text" placeholder="Component Name" class="component-name" value="${componentName}" required />
    <input type="number" placeholder="Score (%)" class="component-score" min="0" max="100" value="${score}" required />
    <input type="number" placeholder="Weight (%)" class="component-weight" min="0" max="100" value="${weight}" required />
    <button type="button" class="remove-componentBtn removeBtn" title="Remove Component">✖</button>
  `;

  div.querySelector('.remove-componentBtn').addEventListener('click', () => {
    div.remove();
  });

  subjectDiv.querySelector('.components').appendChild(div);
}

// Create a new subject block
function addSubject(subjectName = '', creditPoints = '', components = []) {
  const subjectDiv = document.createElement('div');
  subjectDiv.classList.add('subject');

  subjectDiv.innerHTML = `
    <div class="subject-header">
      <input type="text" placeholder="Subject Name" class="subject-name" value="${subjectName}" required />
      <input type="number" placeholder="Credit Points" class="subject-credit" min="1" value="${creditPoints}" required />
      <button type="button" class="addComponentBtn">+ Add Component</button>
      <button type="button" class="removeSubjectBtn removeBtn" title="Remove Subject">✖</button>
    </div>
    <div class="components"></div>
    <div class="final-score" style="margin-top:8px; font-weight:bold; color:#007BFF;"></div>
  `;

  subjectsContainer.appendChild(subjectDiv);

  subjectDiv.querySelector('.addComponentBtn').addEventListener('click', () => {
    createComponentRow(subjectDiv);
  });

  subjectDiv.querySelector('.removeSubjectBtn').addEventListener('click', () => {
    subjectDiv.remove();
  });

  if (components.length > 0) {
    components.forEach(c => {
      createComponentRow(subjectDiv, c.name, c.score, c.weight);
    });
  } else {
    createComponentRow(subjectDiv);
  }
}

// Add initial subject block on page load
addSubject();

// Add new subject on button click
addSubjectBtn.addEventListener('click', () => {
  addSubject();
});

// Calculate WAM and show subject final scores
calculateBtn.addEventListener('click', () => {
  const subjects = document.querySelectorAll('.subject');
  let totalWeightedMarks = 0;
  let totalCredits = 0;

  // Clear previous overall result and each subject's final score display
  resultDiv.textContent = '';
  subjects.forEach(subj => {
    subj.querySelector('.final-score').textContent = '';
  });

  for (let i = 0; i < subjects.length; i++) {
    const subjectDiv = subjects[i];
    const subjectName = subjectDiv.querySelector('.subject-name').value.trim();
    const creditPoints = parseFloat(subjectDiv.querySelector('.subject-credit').value);

    if (subjectName === '') {
      resultDiv.textContent = `Enter subject name for subject ${i + 1}`;
      return;
    }
    if (isNaN(creditPoints) || creditPoints <= 0) {
      resultDiv.textContent = `Enter valid credit points (> 0) for subject ${subjectName}`;
      return;
    }

    const components = subjectDiv.querySelectorAll('.component-row');

    let sumWeightedScores = 0;
    let sumWeights = 0;

    for (let j = 0; j < components.length; j++) {
      const compRow = components[j];
      const compName = compRow.querySelector('.component-name').value.trim();
      const compScore = parseFloat(compRow.querySelector('.component-score').value);
      const compWeight = parseFloat(compRow.querySelector('.component-weight').value);

      if (compName === '') {
        resultDiv.textContent = `Enter component name in subject ${subjectName}`;
        return;
      }
      if (isNaN(compScore) || compScore < 0 || compScore > 100) {
        resultDiv.textContent = `Enter valid score (0-100) in component ${compName} of subject ${subjectName}`;
        return;
      }
      if (isNaN(compWeight) || compWeight < 0 || compWeight > 100) {
        resultDiv.textContent = `Enter valid weight (0-100) in component ${compName} of subject ${subjectName}`;
        return;
      }

      sumWeightedScores += compScore * compWeight;
      sumWeights += compWeight;
    }

    if (sumWeights === 0) {
      resultDiv.textContent = `Total weight cannot be zero in subject ${subjectName}`;
      return;
    }

    const finalSubjectScore = sumWeightedScores / sumWeights;

    // Display final score for the subject
    subjectDiv.querySelector('.final-score').textContent = `Final Score: ${finalSubjectScore.toFixed(2)}%`;

    totalWeightedMarks += finalSubjectScore * creditPoints;
    totalCredits += creditPoints;
  }

  if (totalCredits === 0) {
    resultDiv.textContent = 'Total credits cannot be zero.';
    return;
  }

  const wam = totalWeightedMarks / totalCredits;
  resultDiv.textContent = `Your WAM is: ${wam.toFixed(2)}`;
});
