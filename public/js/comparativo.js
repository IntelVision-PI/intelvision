export async function pegarDadosS3(ano, mes, dia, servidor) {
    const url = `/dados/${ano}/${mes}/${dia}/${servidor}`;

    const res = await fetch(url);
    if (!res.ok) {  
        console.warn(`Arquivo não encontrado: ${url}`);
        return { vazio: true };  
    }

    return await res.json();
}

let chartCPU, chartRAM, chartDisco;

export function inicializarGraficos() {
    const ctxCPU = document.getElementById("chartCPU").getContext("2d");
    const ctxRAM = document.getElementById("chartRAM").getContext("2d");
    const ctxDisco = document.getElementById("chartDisco").getContext("2d");

    chartCPU = new Chart(ctxCPU, {
        type: "line",
        data: { labels: [], datasets: [
            { label: "Atual", data: [], borderColor: "#00C885", borderWidth: 2 },
            { label: "Referência", data: [], borderColor: "#888", borderDash: [5,5], borderWidth: 2 }
        ]}
    });

    chartRAM = new Chart(ctxRAM, {
        type: "line",
        data: { labels: [], datasets: [
            { label: "Atual", data: [], borderWidth: 2 },
            { label: "Referência", data: [], borderWidth: 2 }
        ]}
    });

    chartDisco = new Chart(ctxDisco, {
        type: "line",
        data: { labels: [], datasets: [
            { label: "Atual", data: [], borderWidth: 2 },
            { label: "Referência", data: [], borderWidth: 2 }
        ]}
    });
}

export function atualizarGraficos(dadosRef, dadosAtual) {
    if (!dadosRef || !dadosAtual) return;

    const labels = dadosAtual.map((_, i) => i + 1);

    chartCPU.data.labels = labels;
    chartCPU.data.datasets[0].data = dadosAtual.map(d => d.cpu);
    chartCPU.data.datasets[1].data = dadosRef.map(d => d.cpu);
    chartCPU.update();

    chartRAM.data.labels = labels;
    chartRAM.data.datasets[0].data = dadosAtual.map(d => d.ram);
    chartRAM.data.datasets[1].data = dadosRef.map(d => d.ram);
    chartRAM.update();

    chartDisco.data.labels = labels;
    chartDisco.data.datasets[0].data = dadosAtual.map(d => d.disco);
    chartDisco.data.datasets[1].data = dadosRef.map(d => d.disco);
    chartDisco.update();
}