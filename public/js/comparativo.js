export async function pegarDadosS3(ano, mes, dia, servidor) {
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

let chartCPU, chartRAM, chartDisco;

function criarConfiguracao(ctx, rotulo1, rotulo2) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], 
            datasets: [
                {
                    label: rotulo1, 
                    data: [],
                    borderColor: '#00C885', 
                    backgroundColor: '#00C885',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    fill: false,
                    spanGaps: true
                },
                {
                    label: rotulo2, 
                    data: [],
                    borderColor: '#9CA3AF', 
                    backgroundColor: '#9CA3AF',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.3,
                    pointRadius: 0, 
                    pointHoverRadius: 5,
                    fill: false,
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            animation: false, 
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { maxTicksLimit: 8, color: '#8b979f', autoSkip: true }
                },
                y: {
                    min: 0,
                    max: 100,
                    beginAtZero: true,
                    grid: { borderDash: [4, 4], color: '#f0f0f0' },
                    ticks: { stepSize: 20, callback: (val) => val + '%' }
                }
            }
        }
    });
}

export function inicializarGraficos() {
    chartCPU = criarConfiguracao(document.getElementById("chartCPU").getContext("2d"), "Atual", "Referência");
    chartRAM = criarConfiguracao(document.getElementById("chartRAM").getContext("2d"), "Atual", "Referência");
    chartDisco = criarConfiguracao(document.getElementById("chartDisco").getContext("2d"), "Atual", "Referência");
}


function normalizarHora(dataString) {
    if (!dataString) return null;
    
    const dataSegura = dataString.replace(" ", "T");
    
    const date = new Date(dataSegura);
    
    if (isNaN(date.getTime())) return null;

    const horas = date.getHours();
    const minutos = date.getMinutes();

    const minutosBucket = minutos < 30 ? "00" : "30";
    const horaBucket = horas.toString().padStart(2, '0');

    return `${horaBucket}:${minutosBucket}`;
}

function processarDadosAgrupados(dados) {
    if (!Array.isArray(dados)) return {};

    const grupos = {};

    dados.forEach(d => {
        const rawTime = d.timestamp; 
        
        const chaveTempo = normalizarHora(rawTime);

        if (!chaveTempo) return;

        if (!grupos[chaveTempo]) {
            grupos[chaveTempo] = { somaCPU: 0, somaRAM: 0, somaDisco: 0, count: 0 };
        }

        grupos[chaveTempo].somaCPU += Number(d.cpu || 0);
        grupos[chaveTempo].somaRAM += Number(d.ram || 0);
        grupos[chaveTempo].somaDisco += Number(d.disco || 0);
        grupos[chaveTempo].count++;
    });

    const resultado = {};
    for (const [hora, val] of Object.entries(grupos)) {
        resultado[hora] = {
            cpu: (val.somaCPU / val.count),
            ram: (val.somaRAM / val.count),
            disco: (val.somaDisco / val.count)
        };
    }
    return resultado;
}

export function atualizarGraficos(dadosRef, dadosAtual) {
    if (!dadosRef || !dadosAtual) return;

    const mapaRef = processarDadosAgrupados(dadosRef.vazio ? [] : dadosRef);
    const mapaAtual = processarDadosAgrupados(dadosAtual.vazio ? [] : dadosAtual);

    const todosHorarios = new Set([...Object.keys(mapaRef), ...Object.keys(mapaAtual)]);
    const labelsOrdenadas = Array.from(todosHorarios).sort();

    if (labelsOrdenadas.length === 0) {
        [chartCPU, chartRAM, chartDisco].forEach(chart => {
            chart.data.labels = []; 
            chart.data.datasets.forEach(d => d.data = []); 
            chart.update();
        });
        return;
    }

    const mapData = (mapa, key) => labelsOrdenadas.map(h => mapa[h] ? mapa[h][key] : null);

    chartCPU.data.labels = labelsOrdenadas;
    chartCPU.data.datasets[0].data = mapData(mapaAtual, 'cpu');
    chartCPU.data.datasets[1].data = mapData(mapaRef, 'cpu');
    chartCPU.update('none');

    chartRAM.data.labels = labelsOrdenadas;
    chartRAM.data.datasets[0].data = mapData(mapaAtual, 'ram');
    chartRAM.data.datasets[1].data = mapData(mapaRef, 'ram');
    chartRAM.update('none');

    chartDisco.data.labels = labelsOrdenadas;
    chartDisco.data.datasets[0].data = mapData(mapaAtual, 'disco');
    chartDisco.data.datasets[1].data = mapData(mapaRef, 'disco');
    chartDisco.update('none');
}