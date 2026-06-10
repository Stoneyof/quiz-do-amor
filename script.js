// DEFINE SUA DATA DE NAMORO (Ano, Mês-1, Dia, Hora...)
const dataInicio = new Date("2022-06-12T00:00:00"); 

const musica = document.getElementById("musica-tema");
const btnMusica = document.getElementById("btn-musica");

// Elementos do Mecanismo da Câmera
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const fotoCapturadaElement = document.getElementById('foto-capturada');
const btnIniciarCamera = document.getElementById('btn-iniciar-camera');
const cameraInterface = document.getElementById('camera-interface');
const fotoFinalContainer = document.getElementById('foto-final-container');

function alternarMusica() {
    if (musica.paused) {
        musica.play().catch(e => console.log("Áudio aguardando interação."));
        btnMusica.innerText = "⏸️ Pausar Música";
    } else {
        musica.pause();
        btnMusica.innerText = "🎵 Ouvir Música";
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

function abrirCarta() {
    const wrapper = document.querySelector(".envelope-wrapper");
    const cartaSecao = document.getElementById("carta-surpresa");
    
    wrapper.classList.add("aberto");
    
    setTimeout(() => {
        cartaSecao.classList.remove("escondido");
        cartaSecao.scrollIntoView({ behavior: 'smooth' });
        for(let i=0; i<15; i++) { acionarCoraçoesExtras(); }
    }, 800);
}

// --- CONTROLE DA CÂMERA EM TEMPO REAL ---

function ativarCameraEmTempoReal() {
    btnIniciarCamera.classList.add('escondido');
    cameraInterface.classList.remove('escondido');

    // Liga o visor da câmera (Usa a frontal se for no celular)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then(function(stream) {
            webcamElement.srcObject = stream;
        })
        .catch(function(err) {
            console.log("Erro de câmera: " + err);
            alert("Amor, ativa a permissão da câmera no navegador para tirarmos nossa foto! ❤️");
            btnIniciarCamera.classList.remove('escondido');
            cameraInterface.classList.add('escondido');
        });
}

function capturarNossaFoto() {
    const context = canvasElement.getContext('2d');
    
    canvasElement.width = webcamElement.videoWidth;
    canvasElement.height = webcamElement.videoHeight;
    
    // Bate o "print" do visor da webcam
    context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
    
    const fotoBase64 = canvasElement.toDataURL('image/jpeg');
    fotoCapturadaElement.src = fotoBase64;
    
    // Desliga a webcam para poupar recursos
    const stream = webcamElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    webcamElement.srcObject = null;
    
    // Esconde a câmera e exibe a foto tratada na cartinha
    cameraInterface.classList.add('escondido');
    fotoFinalContainer.classList.remove('escondido');
    
    // Permite dar zoom também na foto que acabaram de tirar!
    fotoCapturadaElement.addEventListener("click", () => abrirZoomImagem(fotoBase64));
    
    for(let i=0; i<20; i++) { acionarCoraçoesExtras(); }
}

function criarChuvaDeCoracoes() {
    const container = document.querySelector(".coracoes");
    setInterval(() => {
        const li = document.createElement("li");
        li.innerText = "❤️";
        li.style.left = Math.random() * 95 + "%";
        li.style.fontSize = Math.random() * 1.5 + 1 + "rem";
        li.style.animationDuration = Math.random() * 4 + 6 + "s";
        container.appendChild(li);
        setTimeout(() => { li.remove(); }, 10000);
    }, 1800);
}
criarChuvaDeCoracoes();

function acionarCoraçoesExtras() {
    const container = document.querySelector(".coracoes");
    const li = document.createElement("li");
    li.innerText = "❤️";
    li.style.left = Math.random() * 95 + "%";
    li.style.animationDuration = Math.random() * 3 + 3 + "s";
    container.appendChild(li);
    setTimeout(() => { li.remove(); }, 6000);
}

// --- MÓDULO DE ZOOM INTERATIVO (FOTOS E TEXTOS) ---

function abrirZoomImagem(src) {
    const modal = document.getElementById("zoom-modal");
    const imgModal = document.getElementById("zoom-imagem");
    const txtModal = document.getElementById("zoom-texto");

    txtModal.classList.add("escondido");
    imgModal.src = src;
    imgModal.classList.remove("escondido");
    modal.classList.remove("escondido");
}

function abrirZoomTexto(elementohtml) {
    const modal = document.getElementById("zoom-modal");
    const imgModal = document.getElementById("zoom-imagem");
    const txtModal = document.getElementById("zoom-texto");

    imgModal.classList.add("escondido");
    txtModal.innerHTML = elementohtml.innerHTML;
    txtModal.classList.remove("escondido");
    modal.classList.remove("escondido");
}

function fecharZoom() {
    document.getElementById("zoom-modal").classList.add("escondido");
}

document.addEventListener("DOMContentLoaded", () => {
    // Configura o zoom para as imagens da linha do tempo
    document.querySelectorAll(".timeline-foto img").forEach(img => {
        img.addEventListener("click", () => abrirZoomImagem(img.src));
    });

    // Configura o zoom para os textos/blocos da linha do tempo
    document.querySelectorAll(".timeline-conteudo").forEach(conteudo => {
        conteudo.addEventListener("click", () => abrirZoomTexto(conteudo));
    });

    // SISTEMA DE SEGURANÇA PARA O BLUR (Caso o celular não suporte o CSS novo)
    if (!CSS.supports('animation-timeline', 'view()')) {
        document.querySelectorAll(".timeline-item").forEach(item => {
            item.style.transition = "all 0.6s ease-out";
            item.style.filter = "blur(8px) grayscale(80%)";
            item.style.opacity = "0.2";
            item.style.transform = "scale(0.92)";
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.filter = "blur(0px) grayscale(0%)";
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "scale(1)";
                } else {
                    entry.target.style.filter = "blur(8px) grayscale(80%)";
                    entry.target.style.opacity = "0.2";
                    entry.target.style.transform = "scale(0.92)";
                }
            });
        }, {
            rootMargin: "-15% 0px -15% 0px"
        });

        document.querySelectorAll(".timeline-item").forEach(item => {
            observer.observe(item);
        });
    }
});