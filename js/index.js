// creating a footer using DOM manipulation
const body = document.body;
const footerElement = document.createElement('footer');
body.appendChild(footerElement);

// getting the current year and adding it to the footer
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector('footer');
const copyright = document.createElement('p');
copyright.innerHTML = `Rosario Sanchez &copy; ${thisYear}`;
footer.appendChild(copyright);

const skills = ['HTML', 'CSS', 'JavaScript'];
const skillsSection = document.getElementById('skills');
const skillsList = skillsSection.querySelector('ul');

for (let i = 0; i < skills.length; i++) {
  const skill = document.createElement('li');
  skill.innerHTML = skills[i];
  skillsList.appendChild(skill);
}

// getting the form and adding an event listener to it
const messageForm = document.forms['leave_message'];

messageForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const usersName = event.target.usersName.value;
  const usersEmail = event.target.usersEmail.value;
  const usersMessage = event.target.usersMessage.value;

  console.log(usersName, usersEmail, usersMessage);

  const messageSection = document.getElementById('messages');
  const messageList = messageSection.querySelector('ul');
  const newMessage = document.createElement('li');
  newMessage.innerHTML = `
    <a href="mailto:${usersEmail}">${usersName}</a>
    <span>${usersMessage}</span>
  `;

  const removeButton = document.createElement('button');
  removeButton.innerText = 'remove';
  removeButton.type = 'button';
  removeButton.addEventListener('click', function (event) {
    const entry = event.target.parentNode;
    entry.remove();
  });
  newMessage.appendChild(removeButton);
  messageList.appendChild(newMessage);

  messageForm.reset();
});

// fetching data from GitHub API
fetch('https://api.github.com/users/rosario252/repos', {
  method: 'GET',
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  })
  .then(data => {
    const repositories = data;
    console.log(repositories);

    const projectSection = document.getElementById('projects');
    const projectList = projectSection.querySelector('ul');

    for (let i = 0; i < repositories.length; i++) {
      const project = document.createElement('li');
      project.innerHTML = repositories[i].name;
      projectList.appendChild(project);
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
