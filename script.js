// 1. Definição das 5 perguntas com declarações e fotos exclusivas
const perguntas = [
    {
        pergunta: "Onde foi o nosso primeiro beijo oficial?",
        opcoes: ["No cinema", "Na pracinha", "No carro", "Na lanchonete"],
        respostaCorreta: "No cinema",
        mensagemAcerto: "Acertou! Lembro de cada segundo, meu coração quase saiu pela boca. Naquele dia eu tive certeza de que começava algo perfeito entre nós. ❤️",
        foto: "assets/foto1.jpg" 
    },
    {
        pergunta: "Qual é a comida que a gente sempre pede quando não sabe o que comer?",
        opcoes: ["Hambúrguer", "Pizza", "Japonesa", "Açaí"],
        respostaCorreta: "Pizza",
        mensagemAcerto: "Claro! Nosso estômago fala a mesma língua. Dividir esses momentos simples com você no sofá é minha parte favorita da semana. 🥰",
        foto: "assets/foto2.jpg"
    },
    {
        pergunta: "Quem disse 'eu te amo' primeiro na nossa relação?",
        opcoes: ["Eu", "Você", "Os dois juntos", "Ninguém disse ainda"],
        respostaCorreta: "Você",
        mensagemAcerto: "Acertou! E desde que ouvi isso pela primeira vez, meu mundo ficou infinitamente mais colorido e seguro. Te amar é incrivelmente fácil. 🌹",
        foto: "assets/foto3.jpg"
    },
    {
        pergunta: "Qual o destino da nossa viagem dos sonhos que sempre planejamos?",
        opcoes: ["Praia", "Campos do Jordão", "Gramado", "Rio de Janeiro"],
        respostaCorreta: "Gramado",
        mensagemAcerto: "Isso mesmo! Mal posso esperar para tirar esse plano do papel do seu lado e colecionar mais memórias pelo mundo. ✈️",
        foto: "assets/foto4.jpg"
    },
    {
        pergunta: "O que eu mais admiro em você acima de tudo?",
        opcoes: ["Seu sorriso", "Sua determinação", "Seu companheirismo", "Todas as alternativas anteriores"],
        respostaCorreta: "Todas as alternativas anteriores",
        mensagemAcerto: "Impossível escolher uma só! Você é perfeita por completo, cheia de luz, me faz querer ser alguém melhor todos os dias. Minha maior sorte! 👑",
        foto: "assets/foto5.jpg"
    }
];

// Ajuste da data de namoro
const dataInicio = new Date("2024-06-12T20:00:00"); 

let indicePerguntaAtual = 0;
const appCard = document.getElementById("app-card");
const telaInicial = document.getElementById("tela-inicial");
const telaQuiz = document.getElementById("tela-quiz");
const telaEnvelope = document.getElementById("tela-envelope");
const telaFinal = document.getElementById("tela-final");
const progressoTexto = document.getElementById("progresso");
const perguntaTexto = document.getElementById("pergunta-texto");
const opcoesContainer = document.getElementById("opcoes-container");
const feedbackContainer = document.getElementById("feedback-container");
const feedbackTexto = document.getElementById("feedback-texto");
const feedbackFoto = document.getElementById("feedback-foto");
const btnProxima = document.getElementById("btn-proxima");
const musica = document.getElementById("musica-tema");
const btnMusica = document.getElementById("btn-musica");
const videoSurpresa = document.getElementById("video-surpresa");

function transicao3D(telaSair, telaEntrar, acaoDoMeio) {
    appCard.classList.add("girar-3d");
    setTimeout(() => {
        telaSair.classList.add("escondido");
        telaEntrar.classList.remove("escondido");
        if (acaoDoMeio) acaoDoMeio();
    }, 400); 
    setTimeout(() => { appCard.classList.remove("girar-3d"); }, 800);
}

function iniciarQuiz() {
    transicao3D(telaInicial, telaQuiz, carregarPergunta);
}

function carregarPergunta() {
    feedbackContainer.classList.add("escondido");
    feedbackFoto.classList.add("escondido");
    opcoesContainer.innerHTML = ""; 

    const dadosPergunta = perguntas[indicePerguntaAtual];
    progressoTexto.innerText = `Pergunta ${indicePerguntaAtual + 1} de ${perguntas.length}`;
    perguntaTexto.innerText = dadosPergunta.pergunta;

    dadosPergunta.opcoes.forEach(opcao => {
        const botao = document.createElement("button");
        botao.innerText = opcao;
        botao.classList.add("btn", "btn-opcao");
        botao.onclick = () => verificarResposta(opcao);
        opcoesContainer.appendChild(botao);
    });
}

function verificarResposta(opcaoSelecionada) {
    const dadosPergunta = perguntas[indicePerguntaAtual];
    feedbackContainer.classList.remove("escondido");

    if (opcaoSelecionada === dadosPergunta.respostaCorreta) {
        feedbackTexto.innerHTML = `<strong>Correto!</strong><br><br>${dadosPergunta.mensagemAcerto}`;
        feedbackFoto.src = dadosPergunta.foto;
        feedbackFoto.classList.remove("escondido");
        btnProxima.innerText = "Avançar ➡️";
        document.querySelectorAll(".btn-opcao").forEach(b => b.disabled = true);
    } else {
        feedbackTexto.innerText = "Ih, resposta errada... Pensa com o coração! ❤️";
        feedbackFoto.classList.add("escondido");
        btnProxima.innerText = "Tentar Novamente 🔄";
    }
}

function proximaPergunta() {
    if (btnProxima.innerText.includes("Tentar")) {
        feedbackContainer.classList.add("escondido");
        return;
    }

    indicePerguntaAtual++;
    if (indicePerguntaAtual < perguntas.length) {
        carregarPergunta();
    } else {
        // Quando acaba o quiz, vai para a interface do envelope interativo
        transicao3D(telaQuiz, telaEnvelope, null);
    }
}

// Controla a abertura física da carta
function abrirCarta() {
    const wrapper = document.querySelector(".envelope-wrapper");
    wrapper.classList.add("aberto");
    
    // Dispara a troca de telas 3D após o envelope terminar de abrir
    setTimeout(() => {
        transicao3D(telaEnvelope, telaFinal, chuvaDeCoracoes);
    }, 1000);
}

function alternarMusica() {
    if (musica.paused) {
        musica.play().catch(e => console.log("Áudio bloqueado"));
        btnMusica.innerText = "⏸️ Pausar";
    } else {
        musica.pause();
        btnMusica.innerText = "🎵 Ouvir";
    }
}

function atualizarContador() {
    const diferenca = new Date() - dataInicio;
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    const el = document.getElementById("contador");
    if (el) el.innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}
setInterval(atualizarContador, 1000);

function chuvaDeCoracoes() {
    const container = document.querySelector(".coracoes");
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const li = document.createElement("li");
            li.innerText = "❤️";
            li.style.left = Math.random() * 90 + "%";
            li.style.animationDuration = Math.random() * 2 + 2 + "s";
            container.appendChild(li);
        }, i * 100);
    }
}

if (videoSurpresa) {
    videoSurpresa.onplay = function() {
        if (!musica.paused) {
            musica.pause();
            btnMusica.innerText = "🎵 Ouvir";
        }
    };
}