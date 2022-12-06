
   export const linePlotOptions =  {
    responsive: true,
    maintainAspectRatio: false,
    radius: 0,
    scales: {
      x: {
        min: 0,
        max: 1800,
        ticks: {
          count: 11,
          callback: function(timestamp:any){
            return (timestamp-(timestamp%=60))/60+(9<timestamp?':':':0')+Math.round(timestamp) 
          }
        }
      },
      y: {
        reverse: true
      }
    },
    plugins: {
      legend: {
        position: "right" as const,
      },
    }
  };