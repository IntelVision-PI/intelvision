let chartBandwidth = null;
let chartStability = null;

document.addEventListener("DOMContentLoaded", async () => {
    
    const inputDate = document.getElementById("dateFilter");
    if(inputDate) {
        const hoje = new Date().toISOString().split("T")[0];
        inputDate.value = hoje;
    }

    const selectServidor = document.getElementById("selectServidor");
    try {
        const response = await fetch("/trafego/servidores"); 
        if(response.ok && response.status !== 204) {
            const lista = await response.json();
            selectServidor.innerHTML = '<option value="">Selecione o Servidor</option>';
            lista.forEach(srv => {
                let opt = document.createElement("option");
                const nomeServidor = srv.hostname || srv.nome || srv.apelido;
                opt.value = nomeServidor;
                opt.textContent = nomeServidor;
                selectServidor.appendChild(opt);
            });
            
            const hoje = inputDate.value.split("-");
            atualizarTabelaGlobal(hoje[0], hoje[1], hoje[2]);

        } else {
            throw new Error("Sem servidores");
        }
    } catch (e) {
        console.warn("Modo fallback");
        const listaTeste = ["servidor19.LETSS05HWDF", "servidor01.TESTE", "VINIC3323GV"];
        selectServidor.innerHTML = '<option value="">Selecione (Teste)</option>';
        listaTeste.forEach(srv => {
            let opt = document.createElement("option");
            opt.value = srv;
            opt.textContent = srv;
            selectServidor.appendChild(opt);
        });
    }

    const btn = document.getElementById("btnConsultar");
    if(btn) btn.addEventListener("click", buscarDados);

    inicializarGraficosVazios();
});

async function buscarDados() {
    const servidor = document.getElementById("selectServidor").value;
    const data = document.getElementById("dateFilter").value;
    const btn = document.getElementById("btnConsultar");
    const msgErro = document.getElementById("msgErro");

    const [ano, mes, dia] = data.split("-");

    atualizarTabelaGlobal(ano, mes, dia);

    if (!servidor || !data) {
        alert("Selecione um servidor para ver os gráficos.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = "Carregando...";
    if(msgErro) msgErro.style.display = "none";

    try {
        const url = `/trafego/${ano}/${mes}/${dia}/${servidor}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Erro na API");

        const dadosRaw = await response.json();

        if (!dadosRaw || dadosRaw.length === 0) {
            if(msgErro) {
                msgErro.style.display = "block";
                msgErro.innerText = "Nenhum dado encontrado para este servidor específico.";
            }
            limparDashboard();
        } else {
            atualizarDashboard(dadosRaw, servidor);
        }

    } catch (error) {
        console.error("Erro:", error);
        limparDashboard();
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Buscar';
    }
}

async function atualizarTabelaGlobal(ano, mes, dia) {
    const select = document.getElementById("selectServidor");
    if(select.options.length <= 1) {
        setTimeout(() => atualizarTabelaGlobal(ano, mes, dia), 500);
        return;
    }

    const options = Array.from(select.options);
    const servidores = options.map(opt => opt.value).filter(val => val !== "");
    
    const tbody = document.getElementById("alerts-table-body");
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Buscando alertas em todos os servidores...</td></tr>';

    const promessas = servidores.map(async (srv) => {
        try {
            const url = `/trafego/${ano}/${mes}/${dia}/${srv}`;
            const res = await fetch(url);
            if(res.ok) {
                const dados = await res.json();
                if(dados.length > 0) return { servidor: srv, dados: dados };
            }
        } catch(err) { return null; }
        return null;
    });

    const resultados = await Promise.all(promessas);
    const todosAlertas = [];

    resultados.forEach(item => {
        if(item) {
            item.dados.forEach(reg => {
                const lat = parseFloat(reg.rede_latencia || 0);
                const perda = parseFloat(reg.rede_perda || 0);
                const sat = parseFloat(reg.rede_saturacao || 0);

                let severidade = "";
                let mensagem = "";

                if (perda > 0) {
                    severidade = "Crítico";
                    mensagem = `Perda de pacotes (${perda}%)`;
                } else if (lat > 100) {
                    severidade = "Crítico";
                    mensagem = `Latência muito alta (${lat.toFixed(0)}ms)`;
                } else if (lat > 50) {
                    severidade = "Aviso";
                    mensagem = `Latência alta (${lat.toFixed(0)}ms)`;
                } else if (sat > 90) {
                    severidade = "Crítico";
                    mensagem = `Saturação de rede (${sat.toFixed(1)}%)`;
                } else if (sat > 70) {
                    severidade = "Aviso";
                    mensagem = `Uso de banda elevado (${sat.toFixed(1)}%)`;
                }

                if (severidade !== "") {
                    let horaFormatada = reg.timestamp;
                    if(reg.timestamp.includes(" ")) {
                        horaFormatada = reg.timestamp.split(" ")[1].substring(0, 5);
                    }

                    todosAlertas.push({
                        horario: horaFormatada,
                        severidade: severidade,
                        servidor: item.servidor,
                        mensagem: mensagem,
                        timestampOriginal: reg.timestamp 
                    });
                }
            });
        }
    });

    todosAlertas.sort((a, b) => {
        if (a.timestampOriginal > b.timestampOriginal) return -1;
        if (a.timestampOriginal < b.timestampOriginal) return 1;
        return 0;
    });

    tbody.innerHTML = "";
    
    if (todosAlertas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#999;">Nenhuma anomalia detectada na rede hoje.</td></tr>';
        return;
    }

    todosAlertas.slice(0, 5).forEach(alerta => {
        let badgeClass = "badge-info";
        if (alerta.severidade === "Crítico") badgeClass = "badge-critico";
        if (alerta.severidade === "Aviso") badgeClass = "badge-aviso";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight: bold;">${alerta.horario}</td>
            <td><span class="badge-alerta ${badgeClass}">${alerta.severidade}</span></td>
            <td style="text-transform: uppercase; font-weight: 600;">${alerta.servidor.split(".")[0]}</td>
            <td>${alerta.mensagem}</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarDashboard(dados, nomeServidor) {
    const lbl = document.getElementById("labelServidorGrafico");
    if(lbl) lbl.textContent = "Servidor: " + nomeServidor;

    let totalBytesRecv = 0;
    let totalBytesSent = 0;
    let maxBanda = 0;
    let somaLatenciaTotal = 0;
    let somaJitterTotal = 0;
    let maxPerda = 0;
    let maxSaturacao = 0;

    const labelsHora = [];
    const dataDownload = [];
    const dataUpload = [];
    const dataLatencia = [];
    const dataJitter = [];
    
    const ultimoRegistro = dados[dados.length - 1];
    const buckets = {};

    dados.forEach(reg => {
        const down = parseFloat(reg.rede_download_mbps || 0);
        const up = parseFloat(reg.rede_upload_mbps || 0);
        const lat = parseFloat(reg.rede_latencia || 0);
        const jit = parseFloat(reg.rede_jitter || 0);
        const perda = parseFloat(reg.rede_perda || 0);
        const sat = parseFloat(reg.rede_saturacao || 0);
        const bytesR = parseFloat(reg.bytes_recv || 0);
        const bytesS = parseFloat(reg.bytes_sent || 0);

        totalBytesRecv += bytesR;
        totalBytesSent += bytesS;

        if ((down + up) > maxBanda) maxBanda = (down + up);
        if (perda > maxPerda) maxPerda = perda;
        if (sat > maxSaturacao) maxSaturacao = sat;

        somaLatenciaTotal += lat;
        somaJitterTotal += jit;

        let timePart = reg.timestamp.includes(" ") ? reg.timestamp.split(" ")[1] : reg.timestamp;
        let [horas, minutos] = timePart.split(":").map(Number);
        let minutoBucket = minutos < 30 ? "00" : "30";
        let chaveBucket = `${String(horas).padStart(2, '0')}:${minutoBucket}`;

        if (!buckets[chaveBucket]) {
            buckets[chaveBucket] = {
                count: 0,
                sumDown: 0,
                sumUp: 0,
                sumLat: 0,
                sumJit: 0
            };
        }

        buckets[chaveBucket].count++;
        buckets[chaveBucket].sumDown += down;
        buckets[chaveBucket].sumUp += up;
        buckets[chaveBucket].sumLat += lat;
        buckets[chaveBucket].sumJit += jit;
    });

    const chavesOrdenadas = Object.keys(buckets).sort();

    chavesOrdenadas.forEach(chave => {
        const b = buckets[chave];
        labelsHora.push(chave);
        dataDownload.push(b.sumDown / b.count);
        dataUpload.push(b.sumUp / b.count);
        dataLatencia.push(b.sumLat / b.count);
        dataJitter.push(b.sumJit / b.count);
    });

    const totalGB = (totalBytesRecv + totalBytesSent) / (1024 * 1024 * 1024);
    document.getElementById("kpiTotalTrafego").textContent = totalGB.toFixed(2) + " GB";
    
    const elPico = document.getElementById("kpiPicoBanda");
    const iconPico = document.getElementById("iconPico");
    const cardPico = document.getElementById("cardPico");
    
    elPico.textContent = maxBanda.toFixed(1) + " Mbps";
    
    const velPlaca = 200; 
    
    elPico.classList.remove("texto-perigo", "texto-aviso", "texto-normal");
    cardPico.classList.remove("borda-aviso");
    iconPico.className = "caixa-icone"; 

    if (maxBanda > (velPlaca * 0.9)) { 
        elPico.classList.add("texto-perigo");
        iconPico.classList.add("vermelho");
        cardPico.classList.add("borda-aviso");
    } else if (maxBanda > (velPlaca * 0.7)) {
        elPico.classList.add("texto-aviso");
        iconPico.classList.add("amber");
    } else {
        elPico.classList.add("texto-normal");
        iconPico.classList.add("esmeralda");
    }

    const mediaLatTotal = dados.length > 0 ? (somaLatenciaTotal / dados.length) : 0;
    const mediaJitTotal = dados.length > 0 ? (somaJitterTotal / dados.length) : 0;
    
    const elLat = document.getElementById("kpiLatencia");
    const iconLat = document.getElementById("iconLatencia");
    const cardLat = document.getElementById("cardLatencia");

    elLat.textContent = mediaLatTotal.toFixed(1) + " ms";
    document.getElementById("kpiJitter").textContent = `Jitter médio: ${mediaJitTotal.toFixed(1)} ms`;

    elLat.classList.remove("texto-perigo", "texto-aviso", "texto-normal");
    cardLat.classList.remove("borda-aviso");
    iconLat.className = "caixa-icone";

    if (mediaLatTotal > 100) {
        elLat.classList.add("texto-perigo");
        iconLat.classList.add("vermelho");
        cardLat.classList.add("borda-aviso");
    } else if (mediaLatTotal > 50) {
        elLat.classList.add("texto-aviso");
        iconLat.classList.add("amber");
    } else {
        elLat.classList.add("texto-normal");
        iconLat.classList.add("esmeralda");
    }

    const elPerda = document.getElementById("miniPerda");
    if(elPerda) {
        elPerda.textContent = maxPerda.toFixed(1) + "%";
        elPerda.style.color = maxPerda > 0 ? "var(--red)" : "var(--text-dark)";
    }
    
    const elSat = document.getElementById("miniSaturacao");
    if(elSat) {
        elSat.textContent = maxSaturacao.toFixed(1) + "%";
        elSat.style.color = maxSaturacao > 80 ? "var(--red)" : "var(--text-dark)";
    }

    const alertasDesteServidor = [];
    dados.forEach(reg => {
       const p = parseFloat(reg.rede_perda || 0);
       const s = parseFloat(reg.rede_saturacao || 0);
       const l = parseFloat(reg.rede_latencia || 0);
       let sev = "", msg = "";
       if(p > 0) { sev="Crítico"; msg=`Perda ${p}%`; }
       else if(l > 100) { sev="Crítico"; msg=`Latência ${l.toFixed(0)}ms`; }
       else if(s > 90) { sev="Crítico"; msg=`Saturação ${s.toFixed(1)}%`; }
       else if(l > 50) { sev="Aviso"; msg=`Latência ${l.toFixed(0)}ms`; }
       else if(s > 70) { sev="Aviso"; msg=`Saturação ${s.toFixed(1)}%`; }
       
       if(sev) {
           let h = reg.timestamp.includes(" ") ? reg.timestamp.split(" ")[1].substring(0,5) : reg.timestamp;
           alertasDesteServidor.push({horario: h, severidade: sev, servidor: nomeServidor.split(".")[0], mensagem: msg});
       }
    });

    atualizarTabelaAlertas(alertasDesteServidor);
    atualizarChartJS(labelsHora, dataDownload, dataUpload, dataLatencia, dataJitter);
    atualizarListaProcessos(ultimoRegistro);
}

function atualizarTabelaAlertas(listaAlertas) {
    const tbody = document.getElementById("alerts-table-body");
    if(!tbody) return;
    tbody.innerHTML = "";

    const ultimos = listaAlertas.reverse().slice(0, 5);

    ultimos.forEach(alerta => {
        let badgeClass = "badge-info";
        if (alerta.severidade === "Crítico") badgeClass = "badge-critico";
        if (alerta.severidade === "Aviso") badgeClass = "badge-aviso";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight: bold;">${alerta.horario}</td>
            <td><span class="badge-alerta ${badgeClass}">${alerta.severidade}</span></td>
            <td style="text-transform: uppercase; font-weight: 600;">${alerta.servidor}</td>
            <td>${alerta.mensagem}</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarListaProcessos(reg) {
    const container = document.getElementById("top-processes-list");
    if(!container) return;
    container.innerHTML = ""; 

    if (!reg) return;

    const processos = [
        { nome: reg.proc1_name, uso: reg.proc1_cpu_pct },
        { nome: reg.proc2_name, uso: reg.proc2_cpu_pct },
        { nome: reg.proc3_name, uso: reg.proc3_cpu_pct }
    ];

    processos.forEach(proc => {
        if(proc.nome) {
            const div = document.createElement("div");
            div.className = "item-lista";
            div.innerHTML = `
                <div class="info-lista">
                    <span class="nome-lista">${proc.nome}</span>
                    <span class="valor-lista">${proc.uso}% CPU</span>
                </div>
                <div class="fundo-barra-progresso">
                    <div class="preenchimento-barra-progresso" style="width: ${parseFloat(proc.uso) * 5}%"></div> 
                </div>
            `;
            container.appendChild(div);
        }
    });
}

function inicializarGraficosVazios() {
    const ctxBandwidth = document.getElementById('bandwidthChart');
    const ctxStability = document.getElementById('stabilityChart');

    if(!ctxBandwidth || !ctxStability) return;

    chartBandwidth = new Chart(ctxBandwidth.getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Download (Mbps)',
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    data: [],
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Upload (Mbps)',
                    borderColor: '#3b82f6', 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    data: [],
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
        }
    });

    chartStability = new Chart(ctxStability.getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Latência (ms)',
                    borderColor: '#10b981', 
                    data: [],
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Jitter (ms)',
                    borderColor: '#f59e0b', 
                    borderDash: [5, 5],
                    data: [],
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { type: 'linear', display: true, position: 'left', title: {display: true, text: 'Latência'} },
                y1: { type: 'linear', display: true, position: 'right', title: {display: true, text: 'Jitter'}, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function atualizarChartJS(labels, down, up, lat, jit) {
    if(chartBandwidth) {
        chartBandwidth.data.labels = labels;
        chartBandwidth.data.datasets[0].data = down;
        chartBandwidth.data.datasets[1].data = up;
        chartBandwidth.update();
    }

    if(chartStability) {
        chartStability.data.labels = labels;
        chartStability.data.datasets[0].data = lat;
        chartStability.data.datasets[1].data = jit;
        chartStability.update();
    }
}

function limparDashboard() {
    const kpiTotal = document.getElementById("kpiTotalTrafego");
    if(kpiTotal) kpiTotal.textContent = "-- GB";
    
    document.getElementById("kpiPicoBanda").textContent = "-- Mbps";
    document.getElementById("kpiLatencia").textContent = "-- ms";
    
    const elJitter = document.getElementById("kpiJitter");
    if(elJitter) elJitter.textContent = "Jitter médio: -- ms";
    
    const ids = ["kpiPicoBanda", "kpiLatencia"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.className = "valor-kpi"; 
            el.style.color = "";
        }
    });

    atualizarChartJS([], [], [], [], []);
    
    const listProc = document.getElementById("top-processes-list");
    if(listProc) listProc.innerHTML = "";
    
    const tableAlerts = document.getElementById("alerts-table-body");
    if(tableAlerts) tableAlerts.innerHTML = "";
}