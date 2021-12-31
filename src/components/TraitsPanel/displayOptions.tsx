export const displayOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "left" as const,
      labels: {
        color: "#cecece",
        boxWidth: 10,
        padding: 10,
        font: {
          size: 14,
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
