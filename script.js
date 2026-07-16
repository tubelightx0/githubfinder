function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

async function getuserinfo(username){
    try {
       const [userdata, userToprepos] = await Promise.all([
       fetch(`https://api.github.com/users/${username}`),
       fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`)
    ]);
        const dataAll = await userdata.json();
        const topRepos = await userToprepos.json();
        return { ...dataAll, topRepos };
    } catch (err) {
        console.error("Network error:", err);
        return { message: "Not Found" }; // reuse existing error path
    }
}

const searchInput = document.querySelector('.searchInput');
const searchButton = document.querySelector('.searchBtn');
const buttonLabel = document.querySelector('.buttonLabel');

const userLogo = document.querySelector('.userLogo');
const userName = document.querySelector('.userName');
const userLocation = document.querySelector('.userLocation');
const userBio = document.querySelector('.userBio');
const userRepos = document.querySelector('.repoCount');
const userFollowers = document.querySelector('.userFollowers');
const userFollowing = document.querySelector('.userFollowing');
const errorMsg = document.querySelector('.errorMsg');
const resultsPanel = document.querySelector('.results');
const topReposContainer = document.querySelector('.topRepos');

const resultSections = [
    resultsPanel,
    document.querySelector('.user'),
    document.querySelector('.followup'),
    document.querySelector('.bio'),
    document.querySelector('.repoCount'),
];

function setResultsVisible(isVisible) {
    resultSections.forEach(section => {
        section.classList.toggle('hidden', !isVisible);
    });
}

function clearResults() {
    userLogo.removeAttribute('src');
    userLogo.alt = '';
    userName.textContent = '';
    userLocation.textContent = '';
    userBio.textContent = '';
    userRepos.textContent = '';
    userFollowers.textContent = '';
    userFollowing.textContent = '';
}

function showError(text) {
    errorMsg.textContent = text;
    errorMsg.classList.remove('hidden');
}

function hideError() {
    errorMsg.classList.add('hidden');
}

setResultsVisible(false);
hideError();

async function findUser(username){
    if (!username) {
        clearResults();
        setResultsVisible(false);
        hideError(); // clear error when input is emptied
        return;
    }

    setResultsVisible(false);
    hideError(); // clear any previous error before a new attempt

    // Loading state
    buttonLabel.textContent = "Searching...";
    searchButton.disabled = true;
    searchButton.classList.add('loading');

    const AllDataofUser = await getuserinfo(username);

    // Reset button after fetch completes
    buttonLabel.textContent = "Search";
    searchButton.disabled = false;
    searchButton.classList.remove('loading');

    if(AllDataofUser.message === "Not Found"){
        clearResults();
        setResultsVisible(false);
        showError("User not found");
        return;
    } else {
        hideError();
        userLogo.src = AllDataofUser.avatar_url;
        userLogo.alt = `${AllDataofUser.login} avatar`;
        userName.textContent = AllDataofUser.name || username;       // fallback if name is null
        userLocation.textContent = AllDataofUser.location || "Location not set";
        userBio.textContent = AllDataofUser.bio || "No bio";
        userRepos.textContent = AllDataofUser.public_repos;          // CSS ::before already adds "Repos" label
        userFollowers.textContent = `Followers: ${AllDataofUser.followers}`;
        userFollowing.textContent = `Following: ${AllDataofUser.following}`;
        topReposContainer.innerHTML = '';
        AllDataofUser.topRepos.slice(0, 6).forEach((repo, index) => {
            const repoElement = document.createElement('div');
            repoElement.classList.add('repo');
            repoElement.innerHTML = `
                <h3>${index + 1}. ${repo.name}</h3>
                <p>${repo.description || 'No description'}</p>
                <p>Stars: ${repo.stargazers_count}</p>
                <a href="${repo.html_url}" target="_blank">View on GitHub</a>
            `;
            topReposContainer.appendChild(repoElement);
        });
        setResultsVisible(true);
    }
}

const debouncedFindUser = debounce(findUser, 300);

searchButton.addEventListener('click', function(){
    debouncedFindUser(searchInput.value.trim());
});

searchInput.addEventListener('input', function(){
    debouncedFindUser(searchInput.value.trim());
});

searchInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
        debouncedFindUser(searchInput.value.trim());
    }
});
