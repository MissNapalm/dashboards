// Declare Chart.js as global (loaded from CDN)
declare const Chart: any;

interface DataRow {
  timestamp: string;
  field: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  status: string;
}

function getCtx(id: string): CanvasRenderingContext2D {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  if (!canvas) throw new Error(`Canvas with id "${id}" not found.`);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(`2D context for "${id}" not found.`);
  return ctx;
}

function populateDataTable(): void {
  const tableBody = document.getElementById('dataTableBody');
  if (!tableBody) return;

  const sampleData: DataRow[] = [
    { timestamp: new Date().toLocaleString(), field: 'Fleet A', temperature: 32.1, humidity: 55, soilMoisture: 0, status: 'Operational' },
    { timestamp: new Date(Date.now() - 300000).toLocaleString(), field: 'Fleet B', temperature: 30.8, humidity: 60, soilMoisture: 0, status: 'Charging' },
    { timestamp: new Date(Date.now() - 600000).toLocaleString(), field: 'Urban Test Loop', temperature: 33.4, humidity: 50, soilMoisture: 0, status: 'Operational' },
    { timestamp: new Date(Date.now() - 900000).toLocaleString(), field: 'Highway Fleet', temperature: 34.2, humidity: 45, soilMoisture: 0, status: 'Maintenance' },
    { timestamp: new Date(Date.now() - 1200000).toLocaleString(), field: 'Fleet A', temperature: 31.7, humidity: 58, soilMoisture: 0, status: 'Operational' }
  ];

  tableBody.innerHTML = '';

  sampleData.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-700';

    const statusClass = row.status === 'Operational' ? 'text-green-400' :
                        row.status === 'Charging' ? 'text-yellow-400' :
                        row.status === 'Maintenance' ? 'text-orange-400' : 'text-red-400';

    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${row.timestamp}</td>
      <td class="px-6 py-4 whitespace-nowrap">${row.field}</td>
      <td class="px-6 py-4 whitespace-nowrap">${row.temperature}°C</td>
      <td class="px-6 py-4 whitespace-nowrap">${row.humidity}%</td>
      <td class="px-6 py-4 whitespace-nowrap">N/A</td>
      <td class="px-6 py-4 whitespace-nowrap font-medium ${statusClass}">${row.status}</td>
    `;
    tableBody.appendChild(tr);
  });

  console.log('✓ Driverless vehicle data populated');
}

function initializeCharts(): void {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded.');
    return;
  }

  try {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#9CA3AF'
          },
          grid: {
            color: '#374151'
          }
        },
        x: {
          ticks: {
            color: '#9CA3AF'
          },
          grid: {
            color: '#374151'
          }
        }
      }
    };

    // Vehicle Performance Over Time
    new Chart(getCtx('twelveMonthChart'), {
      type: 'line',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Miles Driven (thousands)',
            data: [45, 52, 58, 62, 68, 72, 75, 78, 82, 85, 88, 92],
            borderColor: '#e11d48',
            backgroundColor: 'rgba(225, 29, 72, 0.2)',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Fuel Efficiency (MPG)',
            data: [28, 29, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: chartOptions
    });

    // Sensor Accuracy
    new Chart(getCtx('waterChart'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Camera Accuracy (%)',
            data: [96, 97, 96, 98, 99, 97, 98],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.3)',
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            fill: false,
            tension: 0.4
          },
          {
            label: 'LIDAR Accuracy (%)',
            data: [95, 94, 96, 96, 97, 95, 96],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.3)',
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: chartOptions
    });

    // Initialize Data Table
    populateDataTable();

    console.log('✓ All driverless car charts initialized');

  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeCharts, 200);
});
