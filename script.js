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

// URLs base dos webservices SEFAZ por UF (exceções ao padrão geral)
const SEFAZ_BASE_URLS = {
    AC: 'https://nfe.sefaz.ac.gov.br/ws',
    AL: 'https://nfe.sefaz.al.gov.br/ws',
    AP: 'https://nfe.sefaz.ap.gov.br/ws',
    AM: 'https://nfe.sefaz.am.gov.br/ws',
    BA: 'https://nfe.sefaz.ba.gov.br/ws',
    CE: 'https://nfe.sefaz.ce.gov.br/ws',
    DF: 'https://nfe.fazenda.df.gov.br/ws',
    ES: 'https://nfe.sefaz.es.gov.br/ws',
    GO: 'https://nfe.sefaz.go.gov.br/ws',
    MA: 'https://sistemas.sefaz.ma.gov.br/ws/nfe',
    MT: 'https://nfe.sefaz.mt.gov.br/ws',
    MS: 'https://nfe.sefaz.ms.gov.br/ws',
    MG: 'https://nfe.fazenda.mg.gov.br/ws',
    PA: 'https://nfe.sefaz.pa.gov.br/ws',
    PB: 'https://nfe.sefaz.pb.gov.br/ws',
    PR: 'https://nfe.sefa.pr.gov.br/ws',
    PE: 'https://nfe.sefaz.pe.gov.br/ws',
    PI: 'https://nfe.sefaz.pi.gov.br/ws',
    RJ: 'https://nfe.fazenda.rj.gov.br/ws',
    RN: 'https://nfe.set.rn.gov.br/ws',
    RS: 'https://nfe.sefaz.rs.gov.br/ws',
    RO: 'https://nfe.sefin.ro.gov.br/ws',
    RR: 'https://nfe.sefaz.rr.gov.br/ws',
    SC: 'https://nfe.sef.sc.gov.br/ws',
    SP: 'https://nfe.fazenda.sp.gov.br/ws',
    SE: 'https://nfe.sefaz.se.gov.br/ws',
    TO: 'https://nfe.sefaz.to.gov.br/ws'
};

// Geração de URL base para cada UF (padrão comum aos web services NFe)
function getBaseServiceUrl(uf) {
    return SEFAZ_BASE_URLS[uf] || `https://nfe.sefaz.${uf.toLowerCase()}.gov.br/ws`;
}

// Retorna o endpoint do serviço específico
function getServiceUrl(uf, serviceName) {
    const base = getBaseServiceUrl(uf);
    switch (serviceName) {
        case 'Autorização NFe':
            return `${base}/NFeAutorizacao4`;
        case 'Retorno Autorização NFe':
            return `${base}/NFeRetAutorizacao4`;
        case 'Inutilização NFe':
            return `${base}/NFeInutilizacao4`;
        case 'Consulta Protocolo NFe':
            return `${base}/NFeConsultaProtocolo4`;
        case 'Status Serviço NFe':
            return `${base}/NFeStatusServico4`;
        case 'Consulta Cadastro':
            return `${base}/CadConsultaCadastro4`;
        case 'Recepção Evento NFe':
            return `${base}/RecepcaoEvento4`;
        case 'NFCe Autorização':
            return `${base}/NFCeAutorizacao4`;
        case 'NFCe Consulta':
            return `${base}/NFCeConsulta4`;
        default:
            return null;
    }
}

// Estados em contingência
let CONTINGENCY_STATES = [];

// Obtém a lista de estados em contingência diretamente do site oficial
async function updateContingencyStates() {
    try {
        const target = 'https://www.sefaz.rs.gov.br/NFE/NFE-SVC.aspx';
        const response = await fetch(target);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('table tr');

        const active = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const uf = cells[0].textContent.trim();
                const statusText = cells[1].textContent.trim();
                if (uf.length === 2) {
                    const isDeactivated = /Desativad[ao]/i.test(statusText);
                    if (!isDeactivated) {
                        active.push(uf);
                    }
                }
            }
        });

        CONTINGENCY_STATES = active;
    } catch (error) {
        console.error('Erro ao atualizar estados em contingência:', error);
        // Em caso de erro, considera que não há estados em contingência
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

async function initializeApp() {
    showLoading(true);
    await updateContingencyStates(); // Atualiza a lista de contingência na inicialização
    await initializeStatesData();
    createBrazilMap();
    updateDashboard();
    showLoading(false);
}

async function initializeStatesData() {
    statesData = {};
    await Promise.all(Object.keys(BRAZILIAN_STATES).map(async uf => {
        statesData[uf] = {
            name: BRAZILIAN_STATES[uf].name,
            region: BRAZILIAN_STATES[uf].region,
            isContingency: CONTINGENCY_STATES.includes(uf),
            services: {}
        };

        await Promise.all(SEFAZ_SERVICES.map(async service => {
            const { status, responseTime } = await checkServiceStatus(uf, service);
            statesData[uf].services[service] = {
                status: statesData[uf].isContingency ? 'contingency' : status,
                responseTime: responseTime,
                lastCheck: new Date()
            };
        }));
    }));
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

        const totalServicesUF = Object.keys(state.services).length;
        const authService = state.services['Autorização NFe'];
        const authOffline = authService && authService.status === 'offline';

        // Define o status geral do estado
        if (state.isContingency) {
            state.overallStatus = 'contingency';
        } else if (authOffline || stateOfflineServices === totalServicesUF) {
            state.overallStatus = 'offline';
        } else if (stateOfflineServices > 0) {
            state.overallStatus = 'warning';
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
        case 'offline': return 'Autorização offline ou todos os serviços offline';
        case 'warning': return 'Algum outro serviço offline';
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
    updateInterval = setInterval(async () => {
        await checkSefazServices();
        updateDashboard();
    }, 30000);
}

async function simulateStatusChanges() {
    await updateContingencyStates(); // Atualiza a lista de contingência antes de simular mudanças
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

// Consulta a URL de status e retorna se o serviço está online
async function checkServiceStatus(uf, serviceName) {
    const url = getServiceUrl(uf, serviceName);
    const start = performance.now();
    try {
        await fetch(url, { method: 'GET', mode: 'no-cors' });
        const end = performance.now();
        return { status: 'online', responseTime: Math.round(end - start) };
    } catch (e) {
        const end = performance.now();
        return { status: 'offline', responseTime: Math.round(end - start) };
    }
}

// Função para simular consulta real aos serviços SEFAZ (para implementação futura)
async function checkSefazServices() {
    try {
        await updateContingencyStates();
        await Promise.all(Object.keys(statesData).map(async uf => {
            const state = statesData[uf];
            state.isContingency = CONTINGENCY_STATES.includes(uf);

            await Promise.all(Object.keys(state.services).map(async serviceName => {
                const { status, responseTime } = await checkServiceStatus(uf, serviceName);
                state.services[serviceName].status = state.isContingency ? 'contingency' : status;
                state.services[serviceName].responseTime = responseTime;
                state.services[serviceName].lastCheck = new Date();
            }));
        }));
    } catch (error) {
        console.error('Erro ao consultar serviços SEFAZ:', error);
    }
}

