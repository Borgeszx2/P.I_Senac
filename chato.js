// Dados de exemplo (simulando um banco de dados)
const users = [
    { id: 1, username: "admin", password: "admin123", name: "Administrador", sector: "Administrativo", role: "admin" },
    { id: 2, username: "rh", password: "rh123", name: "Gerente RH", sector: "RH", role: "manager" },
    { id: 3, username: "financeiro", password: "fin123", name: "Caixa", sector: "Caixa", role: "user" },
    { id: 4, username: "tecnica", password: "tec123", name: "Técnico", sector: "Assistência Técnica", role: "manager" },
    { id: 5, username: "almoxarife", password: "alm123", name: "Almoxarife", sector: "Almoxarifado", role: "user" }
];

// Carrega documentos do localStorage ou usa os padrões
let documents = JSON.parse(localStorage.getItem('documents')) || [
    { id: 1, title: "Regulamento Interno", sector: "RH", date: "2023-05-15", tags: ["regulamento", "normas"], file: "regulamento.pdf", createdBy: 2 },
    { id: 2, title: "Folha de Pagamento Maio", sector: "Departamento Pessoal", date: "2023-05-30", tags: ["folha", "pagamento"], file: "folha_maio.pdf", createdBy: 2 },
    { id: 3, title: "Relatório Financeiro", sector: "Administrativo", date: "2023-05-28", tags: ["financeiro", "relatório"], file: "relatorio_financeiro.pdf", createdBy: 1 },
    { id: 4, title: "Controle de Caixa", sector: "Caixa", date: "2023-05-31", tags: ["caixa", "fechamento"], file: "caixa_maio.pdf", createdBy: 3 },
    { id: 5, title: "Laudo Técnico #452", sector: "Assistência Técnica", date: "2023-05-29", tags: ["reparo", "eletrônico"], file: "laudo_452.pdf", createdBy: 4 },
    { id: 6, title: "Inventário Almoxarifado", sector: "Almoxarifado", date: "2023-05-25", tags: ["estoque", "inventário"], file: "inventario.pdf", createdBy: 5 }
];

// Variáveis globais
let currentUser = null;
let currentFilter = null;
const sectors = ["RH", "Departamento Pessoal", "Administrativo", "Caixa", "Recebimento", "Expedição", "Depósitos", "Assistência Técnica", "Almoxarifado"];

// Elementos DOM
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const currentSectorSpan = document.getElementById('current-sector');
const closeModalBtns = document.querySelectorAll('.close');
const addDocBtn = document.getElementById('add-doc-btn');
const docModal = document.getElementById('doc-modal');
const documentForm = document.getElementById('document-form');
const docSectorSelect = document.getElementById('doc-sector');
const documentsContainer = document.getElementById('documents-container');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const logoutBtn = document.createElement('button');

// Função para salvar documentos no localStorage
function saveDocuments() {
    localStorage.setItem('documents', JSON.stringify(documents));
}

// Função para atualizar a UI com base no estado do usuário
function updateUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.textContent = 'Logout';
        logoutBtn.id = 'logout-btn';
        logoutBtn.style.padding = '0.5rem 1rem';
        logoutBtn.style.backgroundColor = '#e74c3c';
        logoutBtn.style.color = 'white';
        logoutBtn.style.border = 'none';
        logoutBtn.style.borderRadius = '4px';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.fontWeight = 'bold';
        
        const userInfo = document.querySelector('.user-info');
        if (!document.getElementById('logout-btn')) {
            userInfo.appendChild(logoutBtn);
        }
        
        currentSectorSpan.textContent = `${currentUser.name} (${currentUser.sector})`;
        currentSectorSpan.style.fontWeight = '600';
        addDocBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        if (document.getElementById('logout-btn')) {
            document.getElementById('logout-btn').remove();
        }
        currentSectorSpan.textContent = 'Não logado';
        currentSectorSpan.style.fontWeight = 'normal';
        addDocBtn.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Preencher select de setores no formulário de documento
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = sector;
        docSectorSelect.appendChild(option);
    });
    
    // Carregar documentos
    loadDocuments();
    updateUI();
});

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    currentFilter = null;
    updateUI();
    loadDocuments();
    
    // Resetar filtros ativos
    navLinks.forEach(l => l.classList.remove('active'));
    
    alert('Você foi desconectado com sucesso!');
});

addDocBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('Por favor, faça login primeiro');
        loginModal.style.display = 'block';
        return;
    }
    docModal.style.display = 'block';
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const sector = document.getElementById('sector').value;
    
    // Validação básica
    if (!username || !password || !sector) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    // Simular autenticação
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Verificar se o setor selecionado corresponde ao usuário
        if (user.sector !== sector && user.role !== 'admin') {
            alert('Você não tem acesso a este setor');
            return;
        }
        
        currentUser = {
            id: user.id,
            name: user.name,
            sector: user.sector,
            role: user.role
        };
        
        updateUI();
        loginModal.style.display = 'none';
        loadDocuments();
        
        // Resetar formulário
        loginForm.reset();
        
        alert(`Bem-vindo(a), ${user.name}!`);
    } else {
        alert('Usuário ou senha incorretos');
    }
});

documentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('doc-title').value;
    const sector = document.getElementById('doc-sector').value;
    const fileInput = document.getElementById('doc-file');
    const tags = document.getElementById('doc-tags').value.split(',').map(tag => tag.trim());
    
    // Validação
    if (!title || !sector || !fileInput.files[0]) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }
    
    // Criar novo documento
    const newDoc = {
        id: Date.now(), // ID único baseado no timestamp
        title: title,
        sector: sector,
        date: new Date().toISOString().split('T')[0],
        tags: tags.filter(tag => tag !== ''), // Remove tags vazias
        file: fileInput.files[0].name,
        createdBy: currentUser.id
    };
    
    documents.push(newDoc);
    saveDocuments(); // Salva no localStorage
    loadDocuments(currentFilter);
    docModal.style.display = 'none';
    documentForm.reset();
    
    alert('Documento adicionado com sucesso!');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sector = link.dataset.section;
        currentFilter = sector === 'all' ? null : sector;
        
        // Ativar link selecionado
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        loadDocuments(currentFilter);
    });
});

searchBtn.addEventListener('click', () => {
    performSearch();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Função auxiliar para busca
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        const filtered = documents.filterdoc =
            doc.title.toLowerCase().includes(searchTerm) ||
            (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        renderDocuments(filtered);
    } else {
        loadDocuments(currentFilter);
    }
}

// Funções principais
function loadDocuments(sector = null) {
    let docsToShow = documents;
    
    // Filtro por setor
    if (sector) {
        docsToShow = documents.filter(doc => doc.sector === sector);
    }
    
    // Se usuário está logado e não é admin, filtrar apenas documentos do seu setor
    if (currentUser && currentUser.role !== 'admin' && !sector) {
        docsToShow = documents.filter(doc => doc.sector === currentUser.sector);
    }
    
    renderDocuments(docsToShow);
}

function renderDocuments(docs) {
    documentsContainer.innerHTML = '';
    
    if (docs.length === 0) {
        documentsContainer.innerHTML = '<p class="no-docs">Nenhum documento encontrado</p>';
        return;
    }
    
    // Ordenar documentos por data (mais recentes primeiro)
    docs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    docs.forEach(doc => {
        const docCard = document.createElement('div');
        docCard.className = 'document-card';
        
        // Verificar se o usuário pode excluir (admin ou criador do documento)
        const canDelete = currentUser && 
                        (currentUser.role === 'admin' || currentUser.id === doc.createdBy);
        
        docCard.innerHTML = `
            <h3>${doc.title}</h3>
            <span class="sector">${doc.sector}</span>
            <p class="date">${formatDate(doc.date)}</p>
            ${doc.tags && doc.tags.length > 0 ? `
                <div class="tags">
                    ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="actions">
                <button class="view-btn">Visualizar</button>
                <button class="download-btn">Download</button>
                ${canDelete ? '<button class="delete-btn">Excluir</button>' : ''}
            </div>
        `;
        
        // Adicionar event listeners aos botões
        docCard.querySelector('.view-btn').addEventListener('click', () => viewDocument(doc.id));
        docCard.querySelector('.download-btn').addEventListener('click', () => downloadDocument(doc.id));
        
        const deleteBtn = docCard.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteDocument(doc.id));
        }
        
        documentsContainer.appendChild(docCard);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

function viewDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    // Criar modal de visualização
    const viewModal = document.createElement('div');
    viewModal.className = 'modal';
    viewModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${doc.title}</h2>
            <div class="doc-details">
                <p><strong>Setor:</strong> ${doc.sector}</p>
                <p><strong>Data de Criação:</strong> ${formatDate(doc.date)}</p>
                ${doc.tags && doc.tags.length > 0 ? `
                    <p><strong>Tags:</strong> ${doc.tags.join(', ')}</p>
                ` : ''}
                <p><strong>Arquivo:</strong> ${doc.file}</p>
            </div>
            <div class="doc-actions">
                <button id="real-download-btn" class="download-btn">Baixar Arquivo</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewModal);
    viewModal.style.display = 'block';
    
    // Fechar modal
    viewModal.querySelector('.close').addEventListener('click', () => {
        viewModal.remove();
    });
    
    // Download pelo modal
    viewModal.querySelector('#real-download-btn').addEventListener('click', () => {
        downloadDocument(id);
        viewModal.remove();
    });
    
    // Fechar ao clicar fora
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) {
            viewModal.remove();
        }
    });
}

function downloadDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    // Simular download (em produção, seria um link real para o arquivo)
    alert(`Iniciando download do arquivo: ${doc.file}`);
    console.log(`Download simulado: ${doc.file}`);
    
    // Criar link de download simulado
    const downloadLink = document.createElement('a');
    downloadLink.href = '#'; // Em produção seria a URL real do arquivo
    downloadLink.download = doc.file;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function deleteDocument(id) {
    if (!confirm('Tem certeza que deseja excluir este documento permanentemente?')) {
        return;
    }
    
    const docIndex = documents.findIndex(d => d.id === id);
    if (docIndex === -1) return;
    
    documents.splice(docIndex, 1);
    saveDocuments();
    loadDocuments(currentFilter);
    
    alert('Documento excluído com sucesso!');
}