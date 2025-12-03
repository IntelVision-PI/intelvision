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
    // Garante que cada item terá: servidor, tipo_servidor, status_cpu/status_ram/status_disco
    return rawList.map(item => {
        const servidor = item.servidor || item.user || item.nome || item.host || item.server || "";
        const tipo = item.tipo_servidor || item.tipo || item.kind || "Todos";
        return {
            original: item,
            servidor,
            tipo_servidor: tipo,
            status_cpu: item.status_cpu || item.statusCpu || item.status?.cpu || item.original?.status_cpu || "",
            status_ram: item.status_ram || item.statusRam || item.status?.ram || "",
            status_disco: item.status_disco || item.statusDisco || item.status?.disco || ""
        };
    });
}

// ----------------- KPI -----------------
    // function calcularKPIs(listaNormalizada) {
    //     const kpis = { Armazenamento: 0, Web: 0, Processamento: 0 };

    //     listaNormalizada.forEach(s => {
    //         const statusGeral = calcularStatusGeral(s.original);
    //         const tipo = (s.tipo_servidor || "Todos");

    //         if (statusGeral === "ALERTA" || statusGeral === "CRITICO") {
    //             if (tipo.toLowerCase() === "armazenamento") kpis.Armazenamento++;
    //             else if (tipo.toLowerCase() === "web") kpis.Web++;
    //             else if (tipo.toLowerCase() === "processamento") kpis.Processamento++;
    //             else {
    //                 // se tipo não bater, não contamos em buckets específicos
    //             }
    //         }
    //     });

    //     atualizarKPIsTela(kpis);
    // }

// function atualizarKPIsTela(kpis) {
//     const elemArm = document.getElementById("kpiArmazenamento");
//     const elemWeb = document.getElementById("kpiWeb");
//     const elemProc = document.getElementById("kpiProcessamento");

//     if (elemArm) elemArm.innerText = kpis.Armazenamento;
//     if (elemWeb) elemWeb.innerText = kpis.Web;
//     if (elemProc) elemProc.innerText = kpis.Processamento;
// }

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

    // Para cada servidor na listaServidores precisamos buscar os dados do S3 (do dia atual)
    const [ano, mes, dia] = new Date().toISOString().split("T")[0].split("-");
    const resultados = [];

    for (const s of listaServidores) {
        if (tipoFiltro !== "Todos" && (s.tipo_servidor || "").toLowerCase() !== tipoFiltro.toLowerCase()) {
            continue;
        }
        const nomeServidor = s.servidor;
        try {
            const dados = await pegarDadosS3(2025, 11, 27, nomeServidor);
            if (!dados || dados.vazio) {
                resultados.push({ servidor: nomeServidor, valor: 0 });
                continue;
            }
            // S3 no seu exemplo tem strings, convert
            const media = calcularMediaCampoPorServidor(dados, campo);
            resultados.push({ servidor: nomeServidor, valor: media });
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

// ----------------- Heatmap -----------------
function preencherMapaCalor(listaNormalizada) {
    const container = document.getElementById("mapa_situacaoServidores");

    // limpar blocos antigos
    container.innerHTML = "";

    // criar um bloco para cada servidor
    listaNormalizada.forEach((servidor, index) => {
        const bloco = document.createElement("div");
        bloco.classList.add("server01");
        bloco.id = `server-box-${index}`;

        // se não existir servidor nessa posição
        if (!servidor) {
            bloco.style.backgroundColor = "#eee";
            bloco.title = "Vazio";
            container.appendChild(bloco);
            return;
        }

        const statusGeral = calcularStatusGeral(servidor.original);

        let cor = "#ccc";
        if (statusGeral === "OK") cor = "#2ECC71";
        if (statusGeral === "ALERTA") cor = "#F1C40F";
        if (statusGeral === "CRITICO") cor = "#E74C3C";
        if (statusGeral === "SEM_PARAMETRO") cor = "#95A5A6";

        bloco.style.backgroundColor = cor;
        bloco.title = `${servidor.servidor} — ${statusGeral}`;

        container.appendChild(bloco);
    });
}

// ----------------- Requisições por hora (time series) -----------------
async function gerarGraficoRequisicoes(ano, mes, dia, listaServidores) {
    // vamos criar uma série temporal agregada por timestamp (usando package_recv)
    const agregacao = {}; // chave: timestamp (ex: "2025-11-28 13:38:24") -> soma packages

    for (const s of listaServidores) {
        const servidor = s.servidor;
        try {
            const dados = await pegarDadosS3(ano, mes, dia, servidor);
            if (!dados || dados.vazio) continue;

            for (const registro of dados) {
                const ts = registro.timestamp || registro.hora || registro.time || null;
                if (!ts) continue;

                // Só a hora (HH) para o eixo X
                const chave = ts.slice(11, 13) + ":00";

                const pacote = safeNum(registro.package_recv || registro.package || registro.req || 0);
                agregacao[chave] = (agregacao[chave] || 0) + pacote;
            }

        } catch (err) {
            console.error("Erro ao agregar requisições", servidor, err);
        }
    }

    // ordenar por chave cronológica
    const keys = Object.keys(agregacao).sort();
    const values = keys.map(k => agregacao[k]);

    plotarGraficoRequisicoes(keys, values);
}

function plotarGraficoRequisicoes(labels, data) {
    // cria canvas se necessário
    const container = document.getElementById("graficoRequisicaoHora");
    container.innerHTML = `<canvas id="requisicoesHora"></canvas>`;
    const ctx = document.getElementById("requisicoesHora").getContext("2d");

    if (graficoRequisicoesHora) graficoRequisicoesHora.destroy();

    graficoRequisicoesHora = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Requisições (package_recv)",
                data,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            plugins: { legend: { display: false } },
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
    console.log(listaNormalizada)


    // Remove duplicados pelo nome do servidor
    const nomesUnicos = new Set();
    listaNormalizada = listaNormalizada.filter(s => {
        if (nomesUnicos.has(s.servidor)) return false;
        nomesUnicos.add(s.servidor);
        return true;
    });

    // KPIs
    // calcularKPIs(listaNormalizada);

    // Heatmap: usa a ordem da lista retornada
    preencherMapaCalor(listaNormalizada);

    // Top5 default: RAM (1) e Todos os tipos
    const tipoSelect = document.getElementById("select_tipoServidor");
    const componenteSelect = document.getElementById("select_tipoComponente");

    // pega selects atuais
    const tipoAtual = tipoSelect ? tipoSelect.value : "Todos";
    const compAtual = componenteSelect ? componenteSelect.value : "1";

    // pega data atual dinamicamente
    const [ano, mes, dia] = new Date().toISOString().split("T")[0].split("-");

    // gera Top5 e gráfico de requisições usando lista sem duplicados
    gerarTop5(listaNormalizada, compAtual, tipoAtual);
    gerarGraficoRequisicoes(2025, 11, 27, listaNormalizada);
    console.log(listaNormalizada)
    // liga eventos de mudança nos selects
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


