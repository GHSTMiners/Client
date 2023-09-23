
   export const linePlotOptions =  {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 1800,
        ticks: {
          stepSize: 180,
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
        labels: {
          filter: function(item:any, _chart:any) {
            if (item.text !== 'deathEventDataset' ) return true
            return !item.text.includes('deathEventDataset') 
          },
        }
      },
    }
  };