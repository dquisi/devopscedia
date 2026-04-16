import { fetchUser } from './src/api.js';
import { validateUser } from './src/validator.js';

const loadButton = document.getElementById('loadButton');
const userCard = document.getElementById('userCard');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userCity = document.getElementById('userCity');

function clearUI() {
    userCard.classList.remove('visible');
    errorDiv.classList.remove('visible');
}

function showError(message) {
    clearUI();
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
}

function showUser(user) {
    clearUI();
    userName.textContent = user.name;
    userEmail.textContent = user.email;
    userCity.textContent = user.city;
    userCard.classList.add('visible');
}

function setLoading(isLoading) {
    loadButton.disabled = isLoading;
    if (isLoading) {
        loadingDiv.classList.add('visible');
    } else {
        loadingDiv.classList.remove('visible');
    }
}

async function handleLoadClick() {
    setLoading(true);

    try {
        const user = await fetchUser(1);
        
        const validation = validateUser(user);
        if (!validation.isValid) {
            showError(`Datos inválidos: ${validation.errors.join(', ')}`);
            return;
        }

        showUser(user);
    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

loadButton.addEventListener('click', handleLoadClick);
