export const displayOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#cecece",
        boxWidth: 15,
        padding: 13,
        font: {
          size: 16,
        },
      },
    },
  },
  scales: {
    r: {
      display: true,
      max: 100,
      min: 0,
      ticks: {
        display: true,
        showLabelBackdrop: false,
      },
    },
  },
};

/*
  plugins:{
    legend: {
      display: false,
    },
  },
*/