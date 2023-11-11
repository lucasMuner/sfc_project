const temperaturaData = [];
const ctx = document.getElementById('chartTemp');
const chartTemp = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["1","2","3","4","5","6","7","8","9","10"], // Inicialmente, nenhum rótulo
    datasets: [{
      label: 'Temperatura',
      data: temperaturaData, // Usará os dados de temperatura
      borderWidth: 1,
      borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha (R, G, B, A)
      pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Cor do ponto (R, G, B, A)

    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
const umidadeData = [];
const cty = document.getElementById('chartUmidade');
const chartUmidade = new Chart(cty, {
  type: 'line',
  data: {
    labels: ["1","2","3","4","5","6","7","8","9","10"], // Inicialmente, nenhum rótulo
    datasets: [{
      label: 'Umidade',
      data: umidadeData, // Usará os dados de temperatura
      borderWidth: 1,

    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const lumiData = [];
const ctz = document.getElementById('chartLuminosidade');
const chartLumi = new Chart(ctz, {
  type: 'line',
  data: {
    labels: ["1","2","3","4","5","6","7","8","9","10"], // Inicialmente, nenhum rótulo
    datasets: [{
      label: 'Luminosidade',
      data: lumiData, // Usará os dados de temperatura
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 0, 1)', // Cor da linha para luminosidade (R, G, B, A)
      pointBackgroundColor: 'rgba(255, 255, 0, 1)', // Cor do ponto para luminosidade (R, G, B, A)
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function updateChart(newData, graph, dadosArr) {
  // Adicione o novo valor ao array de dados de temperatura
  dadosArr.push(newData);

  // Limita o número de pontos no gráfico para, por exemplo, mostrar apenas os últimos 10 valores
  if (dadosArr.length > 10) {
    dadosArr.shift();
  }
  // Atualize o gráfico
  graph.update();
}

function fetchDataDataBase(){
  fetch('https://api-sfc.vercel.app/dados')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Os dados da rota /dados serão exibidos no console
    document.querySelector("#umidade").textContent = `Umidade: ${data.umidade} %`;
    document.querySelector("#temperatura").textContent = `Temperatura: ${data.temperatura} °C`;
    document.querySelector("#luminosidade").textContent = `Luminosidade: ${data.luminosidade} Lux`;
    document.querySelector("#setPointTemp").textContent = `SP Temperatura: ${data.setPointTemperatura} °C`;

    updateChart(data.temperatura, chartTemp, temperaturaData);
    updateChart(data.umidade, chartUmidade, umidadeData);
    updateChart(data.luminosidade, chartLumi, lumiData);
   
    const form = document.querySelector("form");

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Obtenha os novos valores dos campos de input
    const setPointTempInput = document.getElementById("setPointTempInput");

    const resetCheckbox = document.getElementById('cb3-8');
    const lampCheckbox = document.getElementById('cb3-7');


    const isResetChecked = resetCheckbox.checked;
    const isLampChecked = lampCheckbox.checked;

    const newSetPoints = {
      setPointTemperatura: setPointTempInput.value,
      lampadaLigada: isLampChecked,
      resetarEsp: isResetChecked
    };
    
    // Faça a solicitação fetch para atualizar o banco de dados com os novos valores
    fetch(`https://api-sfc.vercel.app/atualizar-set`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSetPoints),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Falha na atualização');
      }
    })
    .then(data => {
      console.log(data.mensagem); // Deve imprimir "Set-Point alterado com sucesso" se a atualização for bem-sucedida
      setPointTempInput.value = '';
    })
    .catch(error => {
      console.error(error); // Trate erros aqui, se necessário
    });
  });


    

      
    
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
  });

}

fetchDataDataBase();

setInterval(fetchDataDataBase, 10000);

/*const resetCheckbox = document.getElementById('cb3-8');

// Obter o valor da checkbox
const isResetChecked = resetCheckbox.checked;

// Exemplo de uso
if (isResetChecked) {
  console.log('A checkbox "Resetar Sistema" está marcada.');
} else {
  console.log('A checkbox "Resetar Sistema" não está marcada.');
}

const lampCheckbox = document.getElementById('cb3-7');

// Obter o valor da checkbox
const isLampChecked = lampCheckbox.checked;

// Exemplo de uso
if (isLampChecked) {
  console.log('A checkbox "Lampada" está acesa.');
} else {
  console.log('A checkbox "Lampada" não está acesa.');
}
*/

