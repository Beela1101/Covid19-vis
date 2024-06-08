<!-- <script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Map from "./Map.svelte";
  import Graph from "./Graph.svelte";
  import { geoMercator } from "d3-geo";
  import { fade } from "svelte/transition";

  let count, index, offset, progress;
  let width, height;
  let showPlots = [false, false, false, false, false]; 
  let data2020 = [];
  // fetch('public/data/average_cases_per_day_2020.json')
  //   .then(response => response.json())
  //   .then(data => {
  //     data2020 = data;
  // }); 
  let geoJsonToFit = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [1, 0],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 1],
        },
      },
    ],
  };
  
  $: projection = geoMercator().fitSize([width, height], geoJsonToFit);

  const sections = [
    { text: "First case of Covid 19 happens on 2020-01-21", showGraphs: false, showButton: false },
    { text: "Year 2020", startDate: "2020-01-01", endDate: "2020-12-31", showGraphs: true, showButton: true },
    { text: "Year 2021", startDate: "2021-01-01", endDate: "2021-12-31", showGraphs: true, showButton: true },
    { text: "Year 2022", startDate: "2022-01-01", endDate: "2022-12-31", showGraphs: true, showButton: true },
    { text: "Things become better after 2023", showGraphs: false, showButton: false }
  ];

  const dataUrls = ['./src/data/us.csv'];

  function togglePlots(i) {
    showPlots[i] = !showPlots[i];
  }
</script>



<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .container {
    display: flex;
    width: 100%;
    height: 100vh; 
  }

  .map-container {
    width: 70%;
    height: 100vh;
    position: relative;
  }

  .sections-container {
    width: 30%;
    height: 100vh;
    overflow-y: auto;
    position: relative;
    scroll-snap-type: y mandatory;
  }

  section {
    height: 100vh;
    text-align: center;
    max-width: 750px;
    color: black;
    padding: 1em;
    margin: 0;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .graph-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .graph-container {
    width: 100%;
    height: 180px;
    margin-top: 0.8em;
  }

  .graph-title {
    text-align: center;
    font-weight: bold;
    margin-top: 0.5em;
  }

  .button-container {
    text-align: center;
    margin-top: 1em;
  }

  .show-plots-button,
  .hide-plots-button {
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
    z-index: 2;
  }

  .title {
    position: absolute;
    font-size: 1.5em;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.7);
    padding: 0.2em;
    border-radius: 0.2em;
    z-index: 1;
  }

  .mainland-title {
    top: 15px;
    left: 20px;
  }

  .hawaii-title {
    bottom: 160px;
    left: 180px;
  }

  .alaska-title {
    bottom: 160px;
    left: 20px;
  }
</style>

<div class="container">
  <div class="map-container" bind:clientWidth={width} bind:clientHeight={height}>
    <Map bind:geoJsonToFit {index} {data2020}/>
    <div class="title mainland-title">US Mainland</div>
    <div class="title hawaii-title">Hawaii</div>
    <div class="title alaska-title">Alaska</div>
  </div>

  <div class="sections-container">
    <Scroller
      top={0.0}
      bottom={1}
      threshold={0.5}
      bind:count
      bind:index
      bind:offset
      bind:progress
    >
      <div class="foreground" slot="foreground">
        {#each sections as section, i}
          <section>
            {#if section.showButton && !showPlots[i]}
              <div>
                <div>{section.text}</div>
                <div class="button-container">
                  <button class="show-plots-button" on:click={() => togglePlots(i)}>
                    Show Plots
                  </button>
                </div>
              </div>
            {/if}
            {#if section.showGraphs && showPlots[i]}
              <div class="graph-section" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
                <div class="button-container">
                  <button class="hide-plots-button" on:click={() => togglePlots(i)}>
                    Hide Plots
                  </button>
                </div>
                <div class="graph-title">Accumulated Monthly Cases</div>
                <div class="graph-container">
                  <Graph {dataUrls} graphType="accumulated" startDate={section.startDate} endDate={section.endDate} graphLabel="Accumulated Cases" />
                </div>
                
                <div class="graph-title">Monthly Cases Increasement</div>
                <div class="graph-container">
                  <Graph {dataUrls} graphType="cases" startDate={section.startDate} endDate={section.endDate} graphLabel="Monthly Cases Increasement" />
                </div>
                
                <div class="graph-title">Accumulated Monthly Deaths</div>
                <div class="graph-container">
                  <Graph {dataUrls} graphType="accumulatedDeaths" startDate={section.startDate} endDate={section.endDate} graphLabel="Accumulated Deaths" />
                </div>
              </div>
            {:else if !section.showButton}
              <div class="text-section" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
                {section.text}
              </div>
            {/if}
          </section>
        {/each}
      </div>
    </Scroller>
  </div>
</div> -->