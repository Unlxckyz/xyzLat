// Configurações de missões com base no nível do jogador
const jogador = {
    level: 1,
    xp: 0,
    xpMax: 100,
    hp: 100,
    maxHP: 100,
    maxEnergia: 100,
    energia: 100,
    forca: 10,
    constituicao: 10,
    agilidade: 10,
    inteligencia: 10,
    regeneracao: 10,
    precisao: 10,
    tecnologia: 10,
    percepcao: 10,
    pontosDisponiveis: 10,
    dracmas: "0,00", // Inicialmente 0
    items: {} // Armazena os itens do jogador
};
atualizarStatus();
const missionConfig = {
    minLevel: 1,
    maxLevel: 30,
    resource: {
        baseDuration: 1 * 60 * 1000, // 1 minuto em milissegundos
        baseXp: 50, // XP base
        baseMoney: 100, // Dinheiro base
        durationIncrement: 1000, // Incremento de duração por nível
        xpIncrement: 5, // Incremento de XP por nível
        moneyIncrement: 10, // Incremento de dinheiro por nível
        descriptions: [
            "Coletar minerais em um depósito pequeno.",
            "Extrair recursos vitais de um planeta pouco explorado.",
            "Recuperar componentes de uma nave espacial antiga.",
            "Buscar suprimentos em um depósito abandonado.",
            "Recolher amostras de minerais raros em uma estação espacial."


        ]
    },
    assassination: {
        baseDuration: 2 * 60 * 1000, // 2 minutos em milissegundos
        baseXp: 75, // XP base
        baseMoney: 200, // Dinheiro base
        durationIncrement: 2000, // Incremento de duração por nível
        xpIncrement: 10, // Incremento de XP por nível
        moneyIncrement: 20, // Incremento de dinheiro por nível
        descriptions: [
            "Eliminar um informante em uma base de dados.",
            "Eliminar um alvo importante em uma instalação secreta.",
            "Acabar com um traidor em uma estação orbital.",
            "Destruir um perigoso líder de gangue em um planeta remoto.",
            "Executar um contrato de eliminação em uma cidade futurista."
        ]
    },
    combat: {
        baseDuration: 3 * 60 * 1000, // 3 minutos em milissegundos
        baseXp: 100, // XP base
        baseMoney: 300, // Dinheiro base
        durationIncrement: 3000, // Incremento de duração por nível
        xpIncrement: 15, // Incremento de XP por nível
        moneyIncrement: 30, // Incremento de dinheiro por nível
        descriptions: [
            "Defender um posto avançado contra invasores alienígenas.",
            "Combater rebeldes em uma colônia subaquática.",
            "Proteger uma instalação de pesquisa em um planeta hostil.",
            "Enfrentar bandidos em uma cidade futurista.",
            "Confrontar um exército mercenário em um campo de batalha."
        ]
    },
    main: {
        baseDuration: 5 * 60 * 1000, // 5 minutos em milissegundos
        baseXp: 150, // XP base
        baseMoney: 500, // Dinheiro base
        durationIncrement: 5000, // Incremento de duração por nível
        xpIncrement: 20, // Incremento de XP por nível
        moneyIncrement: 50, // Incremento de dinheiro por nível
        descriptions: [
            "Recuperar um artefato alienígena perdido em uma expedição.",
            "Desvendar um mistério de uma antiga civilização intergaláctica.",
            "Impeder um plano de invasão em uma estação espacial central.",
            "Investigar uma série de sabotagens em uma estação de pesquisa avançada.",
            "Explorar e conquistar um novo território desconhecido."
        ]
    }
};

// Função para gerar missões aleatórias com base no nível do jogador
function generateRandomMission(level) {
    if (level < missionConfig.minLevel || level > missionConfig.maxLevel) {
        console.error("Nível fora do intervalo permitido.");
        return null;
    }

    const categories = ['resource', 'assassination', 'combat', 'main'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const config = missionConfig[category];

    // Cálculo escalado baseado no nível do jogador
    const duration = config.baseDuration + (level - 1) * config.durationIncrement;
    const xp = config.baseXp + (level - 1) * config.xpIncrement;
    const money = config.baseMoney + (level - 1) * config.moneyIncrement;
    const description = getRandomElement(config.descriptions);

    const mission = {
        id: Date.now(), // ID único para a missão
        name: `Missão Aleatória ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: description,
        xp: xp,
        reward: {
            money: money,
            resource: category === 'resource' ? { mineral: getRandomAmount(10, 50) } : null
        },
        duration: duration
    };

    return mission;
}

// Função auxiliar para obter um elemento aleatório de uma lista
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Função auxiliar para gerar um valor aleatório entre min e max
function getRandomAmount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Atualização da UI com missões geradas
function updateMissionUI() {
    const missionsContainer = document.getElementById('missionsContainer');
    missionsContainer.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const mission = generateRandomMission(10); // Nível de exemplo
        if (mission) {
            const missionElement = document.createElement('div');
            missionElement.className = 'mission-item';
            missionElement.id = `mission-${mission.id}`;
            missionElement.innerHTML = `
                <div class="mission-info">
                    <span class="mission-id">Missão: ${mission.id}</span>
                    <span class="mission-desc">Descrição: ${mission.description}</span>
                </div>
                <div class="mission-rewards">
                    <span class="reward xp"><strong>XP:</strong> ${mission.xp}</span>
                    <span class="reward dracmas"><strong>Dracmas:</strong> ${mission.reward.money.toFixed(2)}@</span>
                    ${mission.reward.resource ? `<span class="reward minerals"><strong>Minerais:</strong> Igurus x ${mission.reward.resource.mineral}</span>` : ''}
                </div>
                <div class="mission-actions">
                    <span class="mission-timer">${formatDuration(mission.duration)}</span>
                    <button class="btn-accept-mission" onclick="acceptMission(${mission.id})">Aceitar Missão</button>
                </div>
            `;
            missionsContainer.appendChild(missionElement);
        }
    }
}

// Função para aceitar uma missão
function acceptMission(missionId) {
    const mission = document.getElementById('missionsContainer').value;
    const missionElement = document.getElementById(`mission-${missionId}`);
    if (missionElement) {
        const missionName = missionElement.querySelector('.mission-id').innerText;
        const xp = missionElement.querySelector('.reward.xp').innerText.split(': ')[1];
        const money = missionElement.querySelector('.reward.dracmas').innerText.split(': ')[1];

        // Atualiza o log com a missão aceita
        updateLog(`Missão Aceita: ${missionName} - XP: ${xp}, Recompensa: ${money}`);

        // Remove a missão da lista
        missionElement.remove();
        m

        // Adiciona código para iniciar a missão, se necessário
        // startMission(missionId);
    }
    if (mission.length <= 0) {
        alert('oi');
    }


}



// Função auxiliar para formatar a duração em minutos e segundos
function formatDuration(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}min${seconds}s`;
}

// Mostrar/Fechar Menu
function showMenu() {
    document.getElementById('menu-content').style.display = 'block';
}

function closeMenu() {
    document.getElementById('menu-content').style.display = 'none';
}

// Função para atualizar o log de missões
function updateLog(message) {
    const log = document.getElementById('log');
    log.value += message + '\n';
    log.scrollTop = log.scrollHeight; // Scroll automático
}

// Inicializar a interface
document.addEventListener('DOMContentLoaded', () => {
    updateMissionUI();
});




function incrementaStatus(atributo) {
    if (jogador.hasOwnProperty(atributo)) {
        if (jogador.pontosDisponiveis > 0) {
            jogador[atributo]++;
            jogador.pontosDisponiveis--;
            let attributeElement = document.getElementById(`text${atributo}`);
            let pontosElement = document.getElementById('textPontos');

            if (attributeElement) {
                attributeElement.innerText = `${atributo}: ${jogador[atributo]}`;
            }

            if (pontosElement) {
                pontosElement.innerText = `Pontos Disponíveis: ${jogador.pontosDisponiveis}`;
            }
        } else {
            console.log("Nenhum ponto disponível.");
        }
        atualizarStatus();
    } else {
        console.error(`Atributo '${atributo}' não encontrado no objeto jogador.`);
    }
}



function atualizarStatus() {
    let textLevel = document.getElementById('textLevel');
    let textXP = document.getElementById('textXP');
    let textHP = document.getElementById('textHP');
    let textEnergia = document.getElementById('textEnergia');
    let textForça = document.getElementById('textForça');
    let textConstituicao = document.getElementById('textConstituicao');
    let textAgilidade = document.getElementById('textAgilidade');
    let textInteligencia = document.getElementById('textInteligencia');
    let textPrecisao = document.getElementById('textPrecisao');
    let textTecnologia = document.getElementById('textTecnologia');
    let textRegeneracao = document.getElementById('textRegeneracao');
    let textPercepcao = document.getElementById('textPercepcao');
    let textDracmas = document.getElementById('textDracmas');
    let textPontos = document.getElementById('textPontos');
    let textHPHUD = document.getElementById('textHP-HUD');
    let textEnergiaHUD = document.getElementById('textEnergia-HUD');
    let textLevelHUD = document.getElementById('textLevel-HUD');

    if (textLevelHUD) textLevelHUD.innerText = 'Nivel: ' + jogador.level;
    if (textLevel) textLevel.innerText = 'Nivel: ' + jogador.level;
    if (textXP) textXP.innerText = 'XP: ' + `${jogador.xp}/${jogador.xpMax}`;
    if (textHP) textHP.innerText = 'HP: ' + `${jogador.hp}/${jogador.maxHP}`;
    if (textEnergia) textEnergia.innerText = 'Energia: ' + `${jogador.energia}/${jogador.maxEnergia}`;
    if (textForça) textForça.innerText = 'Força: ' + jogador.forca;
    if (textConstituicao) textConstituicao.innerText = 'Constituição: ' + jogador.constituicao;
    if (textAgilidade) textAgilidade.innerText = 'Agilidade: ' + jogador.agilidade;
    if (textInteligencia) textInteligencia.innerText = 'Inteligência: ' + jogador.inteligencia;
    if (textPrecisao) textPrecisao.innerText = 'Precisão: ' + jogador.precisao;
    if (textTecnologia) textTecnologia.innerText = 'Tecnologia: ' + jogador.tecnologia;
    if (textRegeneracao) textRegeneracao.innerText = 'Regeneração: ' + jogador.regeneracao;
    if (textPercepcao) textPercepcao.innerText = 'Percepção: ' + jogador.percepcao;
    if (textDracmas) textDracmas.innerText = 'Dracmas: ' + jogador.dracmas;
    if (textPontos) textPontos.innerText = 'Pontos Disponiveis: ' + jogador.pontosDisponiveis;
    if (textHPHUD) textHPHUD.innerText = 'HP: ' + `${jogador.hp}/${jogador.maxHP}`;
    if (textEnergiaHUD) textEnergiaHUD.innerText = 'Energia: ' + `${jogador.energia}/${jogador.maxEnergia}`;
}

function updateHp() {
    let container = document.getElementById('hpBar');
    let hpText = document.getElementById('textHP');
    if (container && hpText) {
        let hpPercentage = (jogador.hp / jogador.maxHP) * 100;
        container.style.width = hpPercentage + "%";
        hpText.innerHTML = `HP: ${jogador.hp}/${jogador.maxHP}`;
    }
}

function updateEnergy() {
    let containerEnergy = document.getElementById('energyBar');
    let textEnergy = document.getElementById('textEnergy');
    if (containerEnergy && textEnergy) {
        let energyPercentage = (jogador.energia / jogador.maxEnergia) * 100;
        containerEnergy.style.width = energyPercentage + '%';
        textEnergy.innerHTML = `Energia: ${jogador.energia}/${jogador.maxEnergia}`;
    }
}
function updateTerminal(mensagem) {
    const log = document.getElementById('log')
    if (log) {
        log.value += mensagem + "\n";
        log.scrollTop = log.scrollHeight;
    }
}
function atualizaTerminal() {
    let input = document.getElementById('terminal-input');
    let log = document.getElementById("log");

    if (input && log) {
        input.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                let textoDigitado = input.value.trim();
                if (textoDigitado.length > 0) {
                    log.value += textoDigitado + "\n";
                    input.value = '';
                    log.scrollTop = log.scrollHeight;
                }
            }
        });
    }
}


function showQuest(){
    let menu_content = document.getElementById('menu-content');
    menu_content.className = 'menu-content';
    menu_content.innerHTML = ` <div class="missions-menu">
                    <div class="missions-menu-head"><h1>Missões</h1> <span  id="close-menu" onclick = "closeMenu()">x</span>
                    </div>
                    <div class="missions-lista" id="missionsContainer">
                        <!-- Cada missão terá uma div separada com uma classe específica -->
                        <div class="mission-item" id="mission-1">
                            <div class="mission-info">
                                <span class="mission-id">Missão: 881</span>
                                <span class="mission-desc">Descrição: Você precisa coletar novos minérios de um asteroide ali perto.</span>
                            </div>
                            <div class="mission-rewards">
                                <span class="reward xp"><strong>XP:</strong> 888</span>
                                <span class="reward dracmas"><strong>Dracmas:</strong> 88,95@</span>
                                <span class="reward minerals"><strong>Minerais:</strong> Igurus x 10</span>
                            </div>
                            <div class="mission-actions">
                                <span class="mission-timer">2min57s</span>
                                <button class="btn-accept-mission">Aceitar Missão</button>
                            </div>
                        </div>
                        <!-- Exemplo de outra missão -->
                        <div class="mission-item" id="mission-2">
                            <div class="mission-info">
                                <span class="mission-id">Missão: 882</span>
                                <span class="mission-desc">Descrição: Explorar uma caverna desconhecida.</span>
                            </div>
                            <div class="mission-rewards">
                                <span class="reward xp"><strong>XP:</strong> 920</span>
                                <span class="reward dracmas"><strong>Dracmas:</strong> 120,00@</span>
                                <span class="reward minerals"><strong>Minerais:</strong> Elirium x 5</span>
                            </div>
                            <div class="mission-actions">
                                <span class="mission-timer">3min20s</span>
                                <button class="btn-accept-mission">Aceitar Missão</button>
                            </div>
                        </div>
                        <div class="mission-item" id="mission-2">
                            <div class="mission-info">
                                <span class="mission-id">Missão: 882</span>
                                <span class="mission-desc">Descrição: Explorar uma caverna desconhecida.</span>
                            </div>
                            <div class="mission-rewards">
                                <span class="reward xp"><strong>XP:</strong> 920</span>
                                <span class="reward dracmas"><strong>Dracmas:</strong> 120,00@</span>
                                <span class="reward minerals"><strong>Minerais:</strong> Elirium x 5</span>
                            </div>
                            <div class="mission-actions">
                                <span class="mission-timer">3min20s</span>
                                <button class="btn-accept-mission">Aceitar Missão</button>
                            </div>
                        </div>
                        <div class="mission-item" id="mission-2">
                            <div class="mission-info">
                                <span class="mission-id">Missão: 882</span>
                                <span class="mission-desc">Descrição: Explorar uma caverna desconhecida.</span>
                            </div>
                            <div class="mission-rewards">
                                <span class="reward xp"><strong>XP:</strong> 920</span>
                                <span class="reward dracmas"><strong>Dracmas:</strong> 120,00@</span>
                                <span class="reward minerals"><strong>Minerais:</strong> Elirium x 5</span>
                            </div>
                            <div class="mission-actions">
                                <span class="mission-timer">3min20s</span>
                                <button class="btn-accept-mission">Aceitar Missão</button>
                            </div>
                        </div>
                    </div>
                    

                    
                    
    
                
                   

                        
                    
                </div>`
}

function showMap(){
    let menu_content = document.getElementById('menu-content');
    menu_content.innerHTML = `
     <div class="container-map">
    <span id="close-menu" class ="close-map" onclick="closeMenu()">x</span>
    <img src="./assets/map/map-full.jpeg" id="mapa" alt="" srcset="">
    </div>`;
    menu_content.className = '.menu-content-hidden';
    

}

function closeMenu() {
    
    let menu_content = document.getElementById('menu-content');
    menu_content.className = 'menu-content';
    menu_content.innerHTML = ``;
    menu_content.style.padding = '0rem'
    
}



updateHp();
updateEnergy();
