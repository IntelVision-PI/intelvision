export async function pegarDadosS3(ano, mes, dia, servidor) {
    const url = `/dados/${ano}/${mes}/${dia}/${servidor}`;

    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return { dados: [], vazio: true };

        const json = await res.json();

        if (Array.isArray(json)) return json;
        if (Array.isArray(json?.dados)) return json;

        return { dados: [], vazio: true };

    } catch {
        return { dados: [], vazio: true };
    }
}

let chartCPU = null;
let chartRAM = null;
let chartDisco = null;

export function inicializarGraficos() {
    const base = {
        type: "line",
        data: {
            labels: [],
            datasets: [
                { label: "Referência", data: [], borderWidth: 1, borderColor: "#ff5733", tension: 0.2 },
                { label: "Atual", data: [], borderWidth: 1, borderColor: "#3498db", tension: 0.2 }
            ]
        },
        options: {
            animation: false,
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    };

    chartCPU = new Chart(document.getElementById("chartCPU"), JSON.parse(JSON.stringify(base)));
    chartRAM = new Chart(document.getElementById("chartRAM"), JSON.parse(JSON.stringify(base)));
    chartDisco = new Chart(document.getElementById("chartDisco"), JSON.parse(JSON.stringify(base)));
}

export function atualizarGraficosIncremental(linha, isReferencia) {
    const label = linha.timestamp.split(" ")[1];
    const idx = isReferencia ? 0 : 1;

    chartCPU.data.labels.push(label);
    chartCPU.data.datasets[idx].data.push(parseFloat(linha.cpu || 0));

    chartRAM.data.labels.push(label);
    chartRAM.data.datasets[idx].data.push(parseFloat(linha.ram || 0));

    chartDisco.data.labels.push(label);
    chartDisco.data.datasets[idx].data.push(parseFloat(linha.disco || 0));
}

export function atualizarGraficosFinal() {
    chartCPU.update();
    chartRAM.update();
    chartDisco.update();
}

export function calcularMedia(lista, chave) {
    if (!lista || lista.length === 0) return 0;
    return lista.reduce((acc, item) => acc + (parseFloat(item[chave]) || 0), 0) / lista.length;
}
