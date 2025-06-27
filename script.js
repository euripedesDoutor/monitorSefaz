// Configuração e dados dos estados brasileiros
const BRAZILIAN_STATES = {
    'AC': { name: 'Acre', region: 'Norte' },
    'AL': { name: 'Alagoas', region: 'Nordeste' },
    'AP': { name: 'Amapá', region: 'Norte' },
    'AM': { name: 'Amazonas', region: 'Norte' },
    'BA': { name: 'Bahia', region: 'Nordeste' },
    'CE': { name: 'Ceará', region: 'Nordeste' },
    'DF': { name: 'Distrito Federal', region: 'Centro-Oeste' },
    'ES': { name: 'Espírito Santo', region: 'Sudeste' },
    'GO': { name: 'Goiás', region: 'Centro-Oeste' },
    'MA': { name: 'Maranhão', region: 'Nordeste' },
    'MT': { name: 'Mato Grosso', region: 'Centro-Oeste' },
    'MS': { name: 'Mato Grosso do Sul', region: 'Centro-Oeste' },
    'MG': { name: 'Minas Gerais', region: 'Sudeste' },
    'PA': { name: 'Pará', region: 'Norte' },
    'PB': { name: 'Paraíba', region: 'Nordeste' },
    'PR': { name: 'Paraná', region: 'Sul' },
    'PE': { name: 'Pernambuco', region: 'Nordeste' },
    'PI': { name: 'Piauí', region: 'Nordeste' },
    'RJ': { name: 'Rio de Janeiro', region: 'Sudeste' },
    'RN': { name: 'Rio Grande do Norte', region: 'Nordeste' },
    'RS': { name: 'Rio Grande do Sul', region: 'Sul' },
    'RO': { name: 'Rondônia', region: 'Norte' },
    'RR': { name: 'Roraima', region: 'Norte' },
    'SC': { name: 'Santa Catarina', region: 'Sul' },
    'SP': { name: 'São Paulo', region: 'Sudeste' },
    'SE': { name: 'Sergipe', region: 'Nordeste' },
    'TO': { name: 'Tocantins', region: 'Norte' }
};

// Serviços SEFAZ para monitoramento
const SEFAZ_SERVICES = [
    'Autorização NFe',
    'Retorno Autorização NFe',
    'Inutilização NFe',
    'Consulta Protocolo NFe',
    'Status Serviço NFe',
    'Consulta Cadastro',
    'Recepção Evento NFe',
    'NFCe Autorização',
    'NFCe Consulta'
];

// Estados em contingência (será atualizado dinamicamente ou via simulação)
let CONTINGENCY_STATES = [];

// Simula a atualização da lista de estados em contingência
function updateContingencyStates() {
    // Em um cenário real, esta função faria uma requisição para o backend
    // que por sua vez faria o scraping do site da SEFAZ/RS.
    // Por enquanto, vamos simular que a lista pode mudar.
    const currentHour = new Date().getHours();
    if (currentHour % 2 === 0) { // A cada 2 horas, simula uma mudança
        CONTINGENCY_STATES = ["AM", "BA", "GO", "MA", "MS", "MT", "PE", "PR"];
    } else {
        CONTINGENCY_STATES = [];
    }
}


// Variáveis globais
let statesData = {};
let updateInterval;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startAutoUpdate();
});

function initializeApp() {
    showLoading(true);
    updateContingencyStates(); // Atualiza a lista de contingência na inicialização
    initializeStatesData();
    createBrazilMap();
    updateDashboard();
    showLoading(false);
}

function initializeStatesData() {
    // Simula dados dos serviços SEFAZ para cada estado
    Object.keys(BRAZILIAN_STATES).forEach(uf => {
        statesData[uf] = {
            name: BRAZILIAN_STATES[uf].name,
            region: BRAZILIAN_STATES[uf].region,
            isContingency: CONTINGENCY_STATES.includes(uf),
            services: {}
        };

        // Simula status dos serviços
        SEFAZ_SERVICES.forEach(service => {
            // Simula status aleatório com maior probabilidade de estar online
            const random = Math.random();
            let status = 'online';
            
            if (statesData[uf].isContingency) {
                status = 'contingency';
            } else if (random < 0.1) {
                status = 'offline';
            }

            statesData[uf].services[service] = {
                status: status,
                responseTime: Math.floor(Math.random() * 1000) + 100,
                lastCheck: new Date()
            };
        });
    });
}

function createBrazilMap() {
    // Coordenadas aproximadas dos estados no mapa (em porcentagem)
    const statePositions = {
    'SE': { x: 84.29, y: 39.78 },
    'PA': { x: 58.88, y: 16.14 },
    'MG': { x: 69.03, y: 62.3 },
    'RR': { x: 31.84, y: 5.45 },
    'DF': { x: 60.16, y: 51.95 },
    'MS': { x: 45.23, y: 63.61 },
    'MT': { x: 42.01, y: 51.49 },
    'PR': { x: 57.17, y: 76.07 },
    'SC': { x: 58.78, y: 81.49 },
    'CE': { x: 81.02, y: 21.79 },
    'GO': { x: 57.21, y: 54.2 },
    'PB': { x: 89.19, y: 30.29 },
    'AP': { x: 53.19, y: 12.4 },
    'AL': { x: 87.25, y: 36.66 },
    'AM': { x: 33.28, y: 20.25 },
    'RN': { x: 88.42, y: 26.99 },
    'TO': { x: 59.2, y: 38.03 },
    'RS': { x: 52.82, y: 87.58 },
    'RO': { x: 24.66, y: 34.4 },
    'PE': { x: 89.15, y: 32.63 },
    'AC': { x: 15.98, y: 37.44 },
    'RJ': { x: 70.65, y: 69.76 },
    'BA': { x: 81.09, y: 44.93 },
    'MA': { x: 68.22, y: 18.82 },
    'SP': { x: 63.03, y: 71.37 },
    'PI': { x: 71.55, y: 25.22 },
    'ES': { x: 77.03, y: 63.3 },
    };

    const markersContainer = document.getElementById('stateMarkers');
    markersContainer.innerHTML = '';

    Object.keys(statePositions).forEach(uf => {
        const marker = document.createElement('div');
        marker.className = 'state-marker';
        marker.setAttribute('data-state', uf);
        marker.title = `${BRAZILIAN_STATES[uf].name} (${uf})`;
        
        const position = statePositions[uf];
        marker.style.left = `${position.x}%`;
        marker.style.top = `${position.y}%`;
        marker.style.transform = 'translate(-50%, -50%)';
        
        marker.addEventListener('click', () => showStateDetails(uf));
        markersContainer.appendChild(marker);
    });
}

function updateDashboard() {
    updateIndicators();
    updateStatesGrid();
    updateMapColors();
    updateLastUpdateTime();
}

function updateIndicators() {
    let onlineCount = 0;
    let offlineCount = 0;
    let contingencyCount = 0;
    let totalCount = 0;

    Object.keys(statesData).forEach(uf => {
        const state = statesData[uf];
        let stateOnlineServices = 0;
        let stateOfflineServices = 0;
        let stateContingencyServices = 0;

        Object.values(state.services).forEach(service => {
            totalCount++;
            switch(service.status) {
                case 'online':
                    onlineCount++;
                    stateOnlineServices++;
                    break;
                case 'offline':
                    offlineCount++;
                    stateOfflineServices++;
                    break;
                case 'contingency':
                    contingencyCount++;
                    stateContingencyServices++;
                    break;
            }
        });

        // Define o status geral do estado
        if (state.isContingency) {
            state.overallStatus = 'contingency';
        } else if (stateOfflineServices > 0) {
            state.overallStatus = 'offline';
        } else {
            state.overallStatus = 'online';
        }
    });

    document.getElementById('onlineCount').textContent = onlineCount;
    document.getElementById('offlineCount').textContent = offlineCount;
    document.getElementById('contingencyCount').textContent = contingencyCount;
    document.getElementById('totalCount').textContent = totalCount;
}

function updateStatesGrid() {
    const grid = document.getElementById('statesGrid');
    grid.innerHTML = '';

    Object.keys(statesData).sort().forEach(uf => {
        const state = statesData[uf];
        const card = document.createElement('div');
        card.className = `state-card ${state.overallStatus}`;
        card.onclick = () => showStateDetails(uf);

        const onlineServices = Object.values(state.services).filter(s => s.status === 'online').length;
        const totalServices = Object.keys(state.services).length;

        card.innerHTML = `
            <div class="state-name">${state.name} (${uf})</div>
            <div class="state-status">
                ${getStatusText(state.overallStatus)}
            </div>
            <div class="services-summary">
                ${onlineServices}/${totalServices} serviços online
            </div>
        `;

        grid.appendChild(card);
    });
}

function updateMapColors() {
    Object.keys(statesData).forEach(uf => {
        const marker = document.querySelector(`[data-state="${uf}"]`);
        if (marker && marker.classList.contains('state-marker')) {
            marker.className = `state-marker ${statesData[uf].overallStatus}`;
        }
    });
}

function getStatusText(status) {
    switch(status) {
        case 'online': return 'Todos os serviços online';
        case 'offline': return 'Algum serviço offline';
        case 'contingency': return 'Em contingência';
        default: return 'Status desconhecido';
    }
}

function showStateDetails(uf) {
    const state = statesData[uf];
    const modal = document.getElementById('stateModal');
    const title = document.getElementById('modalTitle');
    const status = document.getElementById('modalStateStatus');
    const servicesList = document.getElementById('modalServicesList');

    title.textContent = `${state.name} (${uf})`;
    status.innerHTML = `
        <div class="state-status ${state.overallStatus}">
            <strong>Status:</strong> ${getStatusText(state.overallStatus)}
        </div>
    `;

    servicesList.innerHTML = '';
    Object.entries(state.services).forEach(([serviceName, service]) => {
        const serviceItem = document.createElement('div');
        serviceItem.className = `service-item ${service.status}`;
        serviceItem.innerHTML = `
            <div class="service-name">${serviceName}</div>
            <div class="service-status ${service.status}">
                ${service.status === 'online' ? 'Online' : 
                  service.status === 'offline' ? 'Offline' : 'Contingência'}
            </div>
        `;
        servicesList.appendChild(serviceItem);
    });

    modal.style.display = 'block';
}

function setupEventListeners() {
    // Fechar modal
    document.getElementById('closeModal').onclick = function() {
        document.getElementById('stateModal').style.display = 'none';
    };

    // Fechar modal clicando fora
    window.onclick = function(event) {
        const modal = document.getElementById('stateModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function startAutoUpdate() {
    // Atualiza a cada 30 segundos
    updateInterval = setInterval(() => {
        simulateStatusChanges();
        updateDashboard();
    }, 30000);
}

function simulateStatusChanges() {
    updateContingencyStates(); // Atualiza a lista de contingência antes de simular mudanças
    // Simula mudanças aleatórias no status dos serviços
    Object.keys(statesData).forEach(uf => {
        const state = statesData[uf];
        
        Object.keys(state.services).forEach(serviceName => {
            // 5% de chance de mudança de status
            if (Math.random() < 0.05) {
                const service = state.services[serviceName];
                
                if (state.isContingency) {
                    service.status = 'contingency';
                } else {
                    // Alterna entre online e offline
                    service.status = service.status === 'online' ? 'offline' : 'online';
                }
                
                service.lastCheck = new Date();
                service.responseTime = Math.floor(Math.random() * 1000) + 100;
            }
        });
    });
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('pt-BR');
    document.getElementById('lastUpdate').textContent = timeString;
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// Função para simular consulta real aos serviços SEFAZ (para implementação futura)
async function checkSefazServices() {
    // Esta função pode ser expandida para fazer consultas reais aos webservices
    // Por enquanto, usa dados simulados
    
    try {
        // Aqui seria feita a consulta real aos serviços
        // const response = await fetch('/api/sefaz-status');
        // const data = await response.json();
        
        // Por enquanto, simula a resposta
        simulateStatusChanges();
        updateDashboard();
        
    } catch (error) {
        console.error('Erro ao consultar serviços SEFAZ:', error);
    }
}

