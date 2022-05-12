//div where profile information will appear
const overview = document.querySelector(".overview");
const username = "heathersvanidze";
//unordered list to display repos
const repoListElement = document.querySelector(".repo-list");
//section with class of repos where all repo information appears
const repoSection = document.querySelector(".repos");
//section with class of repo-data where individual repo info appears
const repoData = document.querySelector(".repo-data");
//back to repo gallery button
const backButton = document.querySelector(".view-repos");
//search bar
const filterInput = document.querySelector(".filter-repos");


//fetches user data
const getData = async function () {
    const res = await fetch 
    (`https://api.github.com/users/${username}`);
    const data = await res.json();
    console.log(data);
    displayUserInfo(data);
};
getData();

const displayUserInfo = function (data){
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");
    userInfo.innerHTML = `<figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>`;
  overview.append(userInfo);
  getRepoData();

};

const getRepoData = async function () {
  const response = await fetch (
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  const repos = await response.json();
  displayRepoInfo(repos);
};

const displayRepoInfo = function (repos){
  filterInput.classList.remove("hide");
  for (var repo of repos){
    const li = document.createElement("li");
    li.classList.add("repo");
    li.innerHTML = `<h3>${repo.name}</h3>`
    repoListElement.append(li);
  }
};

repoListElement.addEventListener("click", function(e){
  if (e.target.matches("h3")){
    const repoName = e.target.innerText;
    getSpecificRepo(repoName);
  }
});

const getSpecificRepo = async function (repoName) {
  const repoRes = await fetch (
    `https://api.github.com/repos/${username}/${repoName}`
  );
  const repoInfo = await repoRes.json();
  //console.log(repoInfo);
  //get languages
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    const languages = [];
    for (const language in languageData) {
    languages.push(language);
};
    //console.log(languageData);
    displayRepo(repoInfo, languages);
}; 

const displayRepo = function (repoInfo, languages){
  repoData.innerHTML = "";
  const repoDiv = document.createElement("div");
  repoDiv.innerHTML = 
  `<h3>Name: ${repoInfo.name}</h3>
  <p>Description: ${repoInfo.description}</p>
  <p>Default Branch: ${repoInfo.default_branch}</p>
  <p>Languages: ${languages.join(", ")}</p>
  <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
  repoData.append(repoDiv);
  repoData.classList.remove("hide");
  repoSection.classList.add("hide");
  backButton.classList.remove("hide");
};

backButton.addEventListener("click", function(){
  repoSection.classList.remove("hide");
  repoData.classList.add("hide");
  backButton.classList.add("hide");
});


//search bar function
filterInput.addEventListener("input", function(e){
  let searchTerm = e.target.value;
  console.log(searchTerm);
  const repos = document.querySelectorAll(".repo");
  const lowercaseSearch = searchTerm.toLowerCase();

  for (const repo of repos) {
    const lowerRepo = repo.innerText.toLowerCase();
    if (lowerRepo.includes(lowercaseSearch)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});
