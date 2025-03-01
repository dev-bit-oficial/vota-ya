// Verificar en qué página estamos
const currentPage = window.location.pathname.split('/').pop();

// Resultados iniciales simulados
const resultadosIniciales = {
    opcion1: 42,
    opcion2: 28,
    opcion3: 35
};

// Función para verificar si el usuario ha iniciado sesión
function checkLogin() {
    const userData = localStorage.getItem('user');
    if (!userData && currentPage === 'votar.html') {
        window.location.href = 'login.html';
    }
    return userData ? JSON.parse(userData) : null;
}

// Función para actualizar la interfaz de usuario con la información del usuario
function updateUserInfo(user) {
    if (!user) return;
    
    const usernameElement = document.getElementById('username');
    const profilePicElement = document.getElementById('profile-pic');
    
    if (usernameElement) usernameElement.textContent = user.username;
    if (profilePicElement) profilePicElement.src = user.profilePic;
}

// Función para manejar el inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validación básica
    if (!username || !password) {
        errorMessage.textContent = 'Por favor ingresa tu nombre de usuario y contraseña';
        errorMessage.classList.remove('hidden');
        return;
    }
    
    // Simular carga
    loginButton.textContent = 'Iniciando sesión...';
    loginButton.disabled = true;
    
    // Simular proceso de inicio de sesión
    setTimeout(() => {
        // Guardar información de sesión
        const user = {
            username: username,
            profilePic: 'https://via.placeholder.com/32'
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirigir a la página de votación
        window.location.href = 'votar.html';
    }, 1500);
}

// Función para manejar el cierre de sesión
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('voto');
    window.location.href = 'index.html';
}

// Función para habilitar/deshabilitar el botón de voto
function updateVoteButton() {
    const voteButton = document.getElementById('vote-button');
    const selectedOption = document.querySelector('input[name="voto"]:checked');
    
    if (voteButton) {
        voteButton.disabled = !selectedOption;
    }
}

// Función para manejar el voto
function handleVote() {
    const selectedOption = document.querySelector('input[name="voto"]:checked');
    if (!selectedOption) return;
    
    const voteValue = selectedOption.value;
    
    // Guardar voto
    localStorage.setItem('voto', voteValue);
    
    // Actualizar resultados (en un caso real, esto se haría en el servidor)
    const resultados = JSON.parse(localStorage.getItem('resultados')) || resultadosIniciales;
    resultados[voteValue]++;
    localStorage.setItem('resultados', JSON.stringify(resultados));
    
    // Mostrar resultados
    showResults(voteValue, resultados);
}

// Función para mostrar los resultados
function showResults(votedOption, resultados) {
    const votingOptions = document.getElementById('voting-options');
    const votingResults = document.getElementById('voting-results');
    const votingFooter = document.getElementById('voting-footer');
    const votedOptionElement = document.getElementById('voted-option');
    
    // Ocultar opciones y mostrar resultados
    if (votingOptions) votingOptions.classList.add('hidden');
    if (votingResults) votingResults.classList.remove('hidden');
    if (votingFooter) votingFooter.classList.add('hidden');
    
    // Mostrar opción votada
    const optionTexts = {
        opcion1: 'Opción 1: Renovar el parque central',
        opcion2: 'Opción 2: Construir una nueva biblioteca',
        opcion3: 'Opción 3: Mejorar el transporte público'
    };
    
    if (votedOptionElement) votedOptionElement.textContent = optionTexts[votedOption];
    
    // Calcular total de votos
    const totalVotos = Object.values(resultados).reduce((sum, current) => sum + current, 0);
    
    // Actualizar porcentajes y barras de progreso
    for (const opcion in resultados) {
        const porcentaje = Math.round((resultados[opcion] / totalVotos) * 100);
        const progressElement = document.getElementById(`progress-${opcion}`);
        const percentElement = document.getElementById(`result-${opcion}-percent`);
        
        if (progressElement) progressElement.style.width = `${porcentaje}%`;
        if (percentElement) percentElement.textContent = `${porcentaje}% (${resultados[opcion]} votos)`;
    }
    
    // Actualizar total de votos
    const totalVotesElement = document.getElementById('total-votes');
    if (totalVotesElement) totalVotesElement.textContent = totalVotos;
}

// Verificar si el usuario ya ha votado
function checkPreviousVote() {
    const votoAnterior = localStorage.getItem('voto');
    if (votoAnterior) {
        const resultados = JSON.parse(localStorage.getItem('resultados')) || resultadosIniciales;
        showResults(votoAnterior, resultados);
        
        // Marcar la opción votada
        const radioOption = document.getElementById(votoAnterior);
        if (radioOption) radioOption.checked = true;
    }
}

// Inicializar la página según su tipo
function initPage() {
    // Verificar login en páginas protegidas
    const user = checkLogin();
    
    // Página de login
    if (currentPage === 'login.html') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        // Si ya está logueado, redirigir a votar
        if (user) {
            window.location.href = 'votar.html';
        }
    }
    
    // Página de votación
    if (currentPage === 'votar.html') {
        // Actualizar información del usuario
        updateUserInfo(user);
        
        // Configurar botón de logout
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }
        
        // Configurar opciones de voto
        const radioOptions = document.querySelectorAll('input[name="voto"]');
        if (radioOptions) {
            radioOptions.forEach(option => {
                option.addEventListener('change', updateVoteButton);
            });
        }
        
        // Configurar botón de voto
        const voteButton = document.getElementById('vote-button');
        if (voteButton) {
            voteButton.addEventListener('click', handleVote);
        }
        
        // Verificar si ya ha votado
        checkPreviousVote();
        
        // Inicializar resultados si no existen
        if (!localStorage.getItem('resultados')) {
            localStorage.setItem('resultados', JSON.stringify(resultadosIniciales));
        }
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initPage);
