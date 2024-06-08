<script>
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { csv } from 'd3-fetch';
  import { timeParse, timeFormat } from 'd3-time-format';
  Chart.register(...registerables);

  export let dataUrls = [];
  export let graphType;
  export let startDate;
  export let endDate;
  export let graphLabel;


  let canvas;
  let chart;
  const parseDate = timeParse("%Y-%m-%d");
  const formatDate = timeFormat("%Y-%m-%d");

  onMount(() => {
    csv(dataUrls[0]).then(data => {
      const filteredData = data.filter(d => {
        const date = parseDate(d.date);
        return date >= parseDate(startDate) && date <= parseDate(endDate);
      });

      const dates = filteredData.map(d => d.date);
      const accumulatedCases = filteredData.map(d => d.cases);
      const cases = filteredData.map(d => d.cases_diff);
      const accumulatedDeaths = filteredData.map(d => d.deaths);

      let dataset = [];
      let label = graphLabel || '';

      if (graphType === 'accumulated') {
        dataset = accumulatedCases;
        label = graphLabel || 'Accumulated Cases';
      } else if (graphType === 'cases') {
        dataset = cases;
        label = graphLabel || 'Monthly Cases Increasement';
      } else if (graphType === 'accumulatedDeaths') {
        dataset = accumulatedDeaths;
        label = graphLabel || 'Accumulated Deaths';
      }

      chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: label,
            data: dataset,
            borderColor: graphType === 'accumulated' ? 'rgba(75, 192, 192, 1)' :
                        graphType === 'cases' ? 'rgba(192, 75, 75, 1)' :
                        'rgba(75, 75, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 2000,
            easing: 'easeInOutQuad'
          },
          plugins: {
            legend: {
              labels: {
                boxHeight: 8,
                font: {
                  size: 10
                },
                padding: 8
              }
            }
          }
        }
      });
    });

    return () => {
      if (chart) chart.destroy();
    };
  });
</script>

<canvas bind:this={canvas} style="width: 100%; height: 200px;"></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>