let chartCPU, chartRAM, chartDISCO;

const dados = {
  "2025-11-20": { cpu: 40, ram: 68, disco: 55 },
  "2025-11-19": { cpu: 55, ram: 75, disco: 60 },
  "2025-11-18": { cpu: 32, ram: 59, disco: 48 }
};

window.onload = () => {
  carregarDatas();
};

function carregarDatas() {
  const select1 = document.getElementById("data1");
  const select2 = document.getElementById("data2");

  Object.keys(dados).forEach(data => {
    select1.innerHTML += `<option value="${data}">${data}</option>`;
    select2.innerHTML += `<option value="${data}">${data}</option>`;
  });
}

function atualizarGraficos() {
  const d1 = document.getElementById("data1").value;
  const d2 = document.getElementById("data2").value;

  if (!d1 || !d2) return;

  const v1 = dados[d1];
  const v2 = dados[d2];

  montarGraficos(v1, v2, d1, d2);
}

function montarGraficos(v1, v2, d1, d2) {

  if (chartCPU) chartCPU.destroy();
  if (chartRAM) chartRAM.destroy();
  if (chartDISCO) chartDISCO.destroy();

  chartCPU = new Chart(document.getElementById("chartCPU"), {
    type: "bar",
    data: {
      labels: ["CPU (%)"],
      datasets: [
        { label: d1, data: [v1.cpu], backgroundColor: "#28a745" },
        { label: d2, data: [v2.cpu], backgroundColor: "#e63946" }
      ]
    }
  });

  chartRAM = new Chart(document.getElementById("chartRAM"), {
    type: "bar",
    data: {
      labels: ["RAM (%)"],
      datasets: [
        { label: d1, data: [v1.ram], backgroundColor: "#28a745" },
        { label: d2, data: [v2.ram], backgroundColor: "#e63946" }
      ]
    }
  });

  chartDISCO = new Chart(document.getElementById("chartDISCO"), {
    type: "bar",
    data: {
      labels: ["Disco (%)"],
      datasets: [
        { label: d1, data: [v1.disco], backgroundColor: "#28a745" },
        { label: d2, data: [v2.disco], backgroundColor: "#e63946" }
      ]
    }
  });
}
