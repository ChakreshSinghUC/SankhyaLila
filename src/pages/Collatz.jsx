const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => `Step: ${ctx.dataIndex}, Value: ${ctx.formattedValue}`
      }
    },
    legend: {
      display: true
    },
    title: {
      display: true,
      text: 'Collatz Conjecture',
      font: { size: 16 }
    },
    zoom: {
      pan: { enabled: true, mode: 'xy' },
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'xy'
      }
    }
  },
  scales: {
    x: {
      min: 0,
      ticks: { precision: 0 },
      title: {
        display: true,
        text: 'Step',
        font: { size: 12 }
      },
      grid: { color: '#eee' }
    },
    y: {
      type: logScale ? 'logarithmic' : 'linear',
      min: 1,
      title: {
        display: true,
        text: logScale ? 'Value (log)' : 'Value',
        font: { size: 12 }
      },
      grid: { color: '#eee' }
    }
  }
};