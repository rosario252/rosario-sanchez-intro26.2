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
