async function pegarDadosS3(ano, mes, dia, servidor) {
    const servidorFormatado = servidor.toLowerCase();
    const url = `/dados/${ano}/${mes}/${dia}/${servidorFormatado}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return { vazio: true };
        return await res.json();
    } catch (error) {
        console.error("Erro requisição:", error);
        return { vazio: true };
    }
}

window.buscarServidor = buscarServidor;
window.graficoRequisicao = graficoRequisicao;

let graficoTop5 = null;
let graficoRequisicoesHora = null;

// ----------------- Utilitários -----------------
function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function calcularStatusGeral(item) {
    // item pode ter status_cpu, status_ram, status_disco
    const sCpu = (item.status_cpu || "").toUpperCase();
    const sRam = (item.status_ram || "").toUpperCase();
    const sDisco = (item.status_disco || "").toUpperCase();

    if (sCpu === "CRITICO" || sRam === "CRITICO" || sDisco === "CRITICO") return "CRITICO";
    if (sCpu === "ALERTA" || sRam === "ALERTA" || sDisco === "ALERTA") return "ALERTA";
    if (sCpu === "OK" && sRam === "OK" && sDisco === "OK") return "OK";
    return "SEM_PARAMETRO";
}

function normalizeServerList(rawList) {
    return rawList.map(item => {
        const servidor = item.servidor || item.user || item.nome || item.host || item.server || "";
        const tipo = item.tipo_servidor || item.tipo || item.kind || "Todos";
        return {
            original: item,
            servidor,
            tipo_servidor: tipo,
            cpu_por: 0,
            ram_por: 0,
            disco_por: 0,
            status_cpu: item.status_cpu || "",
            status_ram: item.status_ram || "",
            status_disco: item.status_disco || ""
        };
    });
}

async function calcularMedia7Dias(listaServidores, ano, mes, dia) {
    const dias = [];

    // gerar lista dos últimos 7 dias
    for (let i = 1; i <= 7; i++) {
        const d = new Date(`${ano}-${mes}-${dia}T00:00:00`);
        d.setDate(d.getDate() - i);

        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");

        dias.push({ ano: y, mes: m, dia: dd });
    }

    // agregação por hora como: {"00:00": soma, "01:00": soma ...}
    const agregacao7 = {};

    for (const diaInfo of dias) {
        for (const s of listaServidores) {
            const servidor = s.servidor;

            try {
                const dados = await pegarDadosS3(diaInfo.ano, diaInfo.mes, diaInfo.dia, servidor);
                if (!dados || dados.vazio) continue;

                for (const r of dados) {
                    const ts = r.timestamp || r.hora;
                    if (!ts) continue;

                    const hora = ts.slice(11, 13) + ":00";
                    const pacote = safeNum(r.package_recv || 0);

                    if (!agregacao7[hora]) agregacao7[hora] = [];
                    agregacao7[hora].push(pacote);
                }
            } catch (e) {
                console.error("Erro média 7 dias:", servidor, e);
            }
        }
    }

    // média por hora
    const horas = Object.keys(agregacao7).sort();
    const medias = horas.map(h => {
        const arr = agregacao7[h];
        if (!arr || arr.length === 0) return 0;
        const soma = arr.reduce((a, b) => a + b, 0);
        return soma / arr.length;
    });

    return { horas, medias };
}


// ----------------- KPI -----------------
async function calcularKPIs(listaNormalizada) {
    let totalCritico = 0;
    let totalAlerta = 0;

    const [ano, mes, dia] = new Date().toISOString().split("T")[0].split("-");

    for (let servidor of listaNormalizada) {
        if (!servidor) continue;

        const nomeServidor = servidor.servidor;

        try {
            const dados = await pegarDadosS3(2025, 11, 27, nomeServidor);

            if (!dados || dados.vazio || !Array.isArray(dados) || dados.length === 0)
                continue;

            const ultimo = dados[dados.length - 1];

            const cpu = (ultimo.status_cpu || "").toUpperCase();
            const ram = (ultimo.status_ram || "").toUpperCase();
            const disco = (ultimo.status_disco || "").toUpperCase();

            const temCritico =
                cpu === "CRITICO" || ram === "CRITICO" || disco === "CRITICO";

            const temAlerta =
                cpu === "ALERTA" || ram === "ALERTA" || disco === "ALERTA";

            if (temCritico) totalCritico++;
            else if (temAlerta) totalAlerta++;
        } catch (e) {
            console.error("Erro ao calcular KPI do servidor:", nomeServidor, e);
        }
    }

    document.getElementById("kpiCritico").innerText = totalCritico;
    document.getElementById("kpiAlerta").innerText = totalAlerta;
}

// ----------------- Top 5 -----------------
function calcularMediaCampoPorServidor(datasetServidor, campo) {
    // datasetServidor: array de registros do S3 (cada registro tem cpu, ram, disco, etc)
    if (!Array.isArray(datasetServidor) || datasetServidor.length === 0) return 0;
    const soma = datasetServidor.reduce((acc, r) => acc + safeNum(r[campo]), 0);
    return soma / datasetServidor.length;
}

async function gerarTop5(listaServidores, componente = "1", tipoFiltro = "Todos") {
    // componente: "1" = RAM, "2" = Disco, "3" = CPU
    const campoMap = { "1": "ram", "2": "disco", "3": "cpu" };
    const campo = campoMap[componente] || "ram";

    const [ano, mes, dia] = new Date().toISOString().split("T")[0].split("-");

    const resultados = [];

    for (const s of listaServidores) {
        if (tipoFiltro !== "Todos" && (s.tipo_servidor || "").toLowerCase() !== tipoFiltro.toLowerCase()) {
            continue;
        }

        const nomeServidor = s.servidor;

        try {
            const dados = await pegarDadosS3(2025, 11, 27, nomeServidor);

            if (!dados || dados.vazio || !Array.isArray(dados) || dados.length === 0) {
                resultados.push({ servidor: nomeServidor, valor: 0 });
                continue;
            }

            // pega o último registro
            const ultimo = dados[dados.length - 1];

            const valor = Number(ultimo[campo]) || 0;

            resultados.push({ servidor: nomeServidor, valor });
        } catch (err) {
            console.error("Erro Top5 - buscar s3", nomeServidor, err);
            resultados.push({ servidor: nomeServidor, valor: 0 });
        }
    }

    const top5 = resultados.sort((a, b) => b.valor - a.valor).slice(0, 5);
    plotarTop5(top5, campo);
}


function plotarTop5(lista, campo) {
    const ctx = document.getElementById("SerivdorMaiorUso").getContext("2d");

    if (graficoTop5) graficoTop5.destroy();

    graficoTop5 = new Chart(ctx, {
        type: "bar",
        data: {
            labels: lista.map(i => i.servidor),
            datasets: [{
                label: `Média ${campo.toUpperCase()}`,
                data: lista.map(i => Number(i.valor.toFixed(2))),
                backgroundColor: "#2D6A54"
            }]
        },
        options: {
            indexAxis: "y",
            plugins: { legend: { display: false } },
            responsive: true,
            scales: {
                x: { beginAtZero: true, max: 100 }
            }
        }
    });
}

async function preencherMapaCalor(listaNormalizada) {
    const container = document.getElementById("mapa_situacaoServidores");
    container.innerHTML = "";

    const [ano, mes, dia] = new Date().toISOString().split("T")[0].split("-");

    for (let index = 0; index < listaNormalizada.length; index++) {
        const servidor = listaNormalizada[index];
        console.log(servidor)

        const bloco = document.createElement("div");
        bloco.classList.add("server01");
        bloco.id = `server-box-${index}`;

        // Caso não exista servidor nessa posição
        if (!servidor) {
            bloco.style.backgroundColor = "#eee";
            bloco.title = "Vazio";
            bloco.innerHTML = "<div class='dadosServidor'>Sem dados</div>"
            container.appendChild(bloco);
            continue;
        }

        const nomeServidor = servidor.servidor;
        const tipoServidor = servidor.tipo_servidor;
        let cpu = "Sem dados";
        let ram = "Sem dados";
        let disco = "Sem dados";
        let cpuPor = "Sem dados";
        let ramPor = "Sem dados";
        let discoPor = "Sem dados";

        try {
            const dadosS3 = await pegarDadosS3(2025, 11, 27, nomeServidor);

            if (dadosS3 && !dadosS3.vazio && Array.isArray(dadosS3) && dadosS3.length > 0) {
                // usar o último registro
                const ultimo = dadosS3[dadosS3.length - 1];

                cpu = (ultimo.status_cpu || "").toUpperCase();
                ram = (ultimo.status_ram || "").toUpperCase();
                disco = (ultimo.status_disco || "").toUpperCase();
                cpuPor = ultimo.cpu ?? 0;
                ramPor = ultimo.ram ?? 0;
                discoPor = ultimo.disco ?? 0;

            }
        } catch (e) {
            console.error(`Erro ao consultar S3 para ${nomeServidor}`, e);
        }

        // prioridade de cor
        let cor = "#95A5A6";

        if (cpu === "CRITICO" || ram === "CRITICO" || disco === "CRITICO") {
            cor = "#EF4444";
        }
        else if (cpu === "ALERTA" || ram === "ALERTA" || disco === "ALERTA") {
            cor = "#EAB308";
        }
        else if (cpu === "OK" && ram === "OK" && disco === "OK") {
            cor = "#22C55E";
        }

        bloco.style.backgroundColor = cor;
        bloco.title = `${nomeServidor} — CPU: ${cpu}, RAM: ${ram}, Disco: ${disco}`;
        bloco.innerHTML = `
            <div class="dadosServidor">
              <div class="nomeServidor"><p>${nomeServidor}</p></div>
              <div class="info-server">
                <div class="tipo-server"><p>${tipoServidor}</p></div>
                <div class="info-ram"><p>RAM: ${ramPor}</p></div>
                <div class="info-cpu"><p>CPU: ${cpuPor}</p></div>
                <div class="info-disco"><p>Disco: ${discoPor}</p></div>
              </div>
            </div>
        `;

        container.appendChild(bloco);
    }
}


// ----------------- Requisições por hora (time series) -----------------
async function gerarGraficoRequisicoes(ano, mes, dia, listaServidores) {
    const agregacao = {};

    // linha principal do dia atual
    for (const s of listaServidores) {
        const servidor = s.servidor;
        try {
            const dados = await pegarDadosS3(ano, mes, dia, servidor);
            if (!dados || dados.vazio) continue;

            for (const registro of dados) {
                const ts = registro.timestamp || registro.hora;
                if (!ts) continue;

                const hora = ts.slice(11, 13) + ":00";
                const pacote = safeNum(registro.package_recv || 0);

                agregacao[hora] = (agregacao[hora] || 0) + pacote;
            }

        } catch (err) {
            console.error("Erro ao agregar requisições", servidor, err);
        }
    }

    const labels = Object.keys(agregacao).sort();
    const valoresHoje = labels.map(h => agregacao[h]);

    const { horas: horas7, medias: medias7 } = await calcularMedia7Dias(listaServidores, ano, mes, dia);

    // garantir alinhamento do eixo X
    const todasHoras = Array.from(new Set([...labels, ...horas7])).sort();

    const valoresHojeAlinhados = todasHoras.map(h => agregacao[h] || 0);
    const medias7Alinhadas = todasHoras.map(h => {
        const idx = horas7.indexOf(h);
        return idx >= 0 ? medias7[idx] : 0;
    });

    // plotar
    plotarGraficoRequisicoes(todasHoras, valoresHojeAlinhados, medias7Alinhadas);
}

function plotarGraficoRequisicoes(labels, dataHoje, dataMedia7) {
    const container = document.getElementById("graficoRequisicaoHora");
    container.innerHTML = `<canvas id="requisicoesHora"></canvas>`;
    const ctx = document.getElementById("requisicoesHora").getContext("2d");

    if (graficoRequisicoesHora) graficoRequisicoesHora.destroy();

    graficoRequisicoesHora = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Requisições Hoje",
                    data: dataHoje,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: "Média últimos 7 dias",
                    data: dataMedia7,
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { maxRotation: 45, minRotation: 0 },
                }
            }
        }
    });
}


// ----------------- Fluxo principal -----------------
function mostrarServidores(lista) {
    // normaliza a lista
    let listaNormalizada = normalizeServerList(lista);


    const tipoSelect = document.getElementById("select_tipoServidor");
    const componenteSelect = document.getElementById("select_tipoComponente");
    const tipoAtual = tipoSelect ? tipoSelect.value : "Todos";
    const compAtual = componenteSelect ? componenteSelect.value : "1";
    const [ano, mes, dia] = new Date().toISOString().split("T")[0].split("-");

    const nomesUnicos = new Set();
    listaNormalizada = listaNormalizada.filter(s => {
        if (nomesUnicos.has(s.servidor)) return false;
        nomesUnicos.add(s.servidor);
        return true;
    });
    
    console.log(listaNormalizada)
    gerarGraficoRequisicoes(2025, 11, 27, listaNormalizada);
    calcularKPIs(listaNormalizada);
    preencherMapaCalor(listaNormalizada);
    gerarTop5(listaNormalizada, compAtual, tipoAtual);
    console.log(listaNormalizada)


    if (tipoSelect) {
        tipoSelect.onchange = () => gerarTop5(
            listaNormalizada,
            componenteSelect ? componenteSelect.value : "1",
            tipoSelect.value
        );
    }
    if (componenteSelect) {
        componenteSelect.onchange = () => gerarTop5(
            listaNormalizada,
            componenteSelect.value,
            tipoSelect ? tipoSelect.value : "Todos"
        );
    }
}

// ----------------- Fetch lista de servidores (API) -----------------
function buscarServidor() {
    fetch(`/situacao/buscarTodos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Erro na resposta da API");
            }
            return res.json();
        })
        .then((data) => {
            console.log("Lista servidores (API):", data);
            mostrarServidores(data);
        })
        .catch(err => {
            console.error("Erro ao buscar servidores:", err);
        });
}

// ----------------- Exposed helpers -----------------
function graficoRequisicao() {
    document.getElementById("graficoRequisicaoHora").innerHTML = `<canvas id="requisicoesHora"></canvas>`;
    buscarServidor();
}

// inicializa automático quando o arquivo é carregado (se desejar)
document.addEventListener("DOMContentLoaded", () => {
    // tentar buscar a lista assim que a página carregar
    try { buscarServidor(); } catch (e) { console.warn(e); }
});


