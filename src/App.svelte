<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Map from "./components/Map.svelte";
  import Graph from "./components/Graph.svelte";
  import { fade } from "svelte/transition";
  import './app.css';

  let count, index = 0, offset, progress; 
  let width, height;
  let showPlots = [false, false, false, false, false]; 
  let scroller; 

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

  let string1 = `
  <div class="container">
    <div style="text-align: center; max-width: 900px; margin: 0 auto;">
      <h1>COVID-19 Trends in the USA (2020-2022)</h1>
    </div>
    
    <div class="content"； max-width: 1300px>
      <p>From 2020 to 2022, COVID-19 trends in the USA showed significant shifts:</p>
      <p>In 2020, accumulated cases and deaths rose rapidly due to uncontrolled spread and limited interventions.</p>
      <p>In 2021, cyclic patterns in monthly case increases were driven by new variants like Delta and Omicron, leading to notable peaks in July and December. Accumulated deaths continued to climb, albeit at varying rates.</p>
      <p>In 2022, the trend began to stabilize with slower increases in cases and deaths, reflecting the impact of widespread vaccinations, improved treatments, and consistent public health measures.</p>
    </div>
    
    <div class="flex-container">
      <div class="flex-item">
        <h2>COVID-19 Cases and Cases Per Day Statistics 2020</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>cases</th>
              <th>cases_per_day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>count</td>
              <td>3,273</td>
              <td>3,273</td>
            </tr>
            <tr>
              <td>mean</td>
              <td>5,277,388</td>
              <td>1,525.26</td>
            </tr>
            <tr>
              <td>std</td>
              <td>22,589,660</td>
              <td>6,528.80</td>
            </tr>
            <tr>
              <td>25%</td>
              <td>42,083</td>
              <td>121.63</td>
            </tr>
            <tr>
              <td>50%</td>
              <td>112,280</td>
              <td>324.51</td>
            </tr>
            <tr>
              <td>75%</td>
              <td>307,790</td>
              <td>889.57</td>
            </tr>
            <tr>
              <td>max</td>
              <td>66,041,400</td>
              <td>190,871.09</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex-item">
        <h2>COVID-19 Cases and Cases Per Day Statistics 2021</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>cases</th>
              <th>cases_per_day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>count</td>
              <td>3,262</td>
              <td>3,262</td>
            </tr>
            <tr>
              <td>mean</td>
              <td>4,055,527</td>
              <td>11,111.03</td>
            </tr>
            <tr>
              <td>std</td>
              <td>15,082,000</td>
              <td>41,320.55</td>
            </tr>
            <tr>
              <td>25%</td>
              <td>432,723</td>
              <td>1,185.54</td>
            </tr>
            <tr>
              <td>50%</td>
              <td>1,031,272</td>
              <td>2,825.40</td>
            </tr>
            <tr>
              <td>75%</td>
              <td>2,648,135</td>
              <td>7,255.16</td>
            </tr>
            <tr>
              <td>max</td>
              <td>477,580,600</td>
              <td>1,308,440</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex-item">
        <h2>COVID-19 Cases and Cases Per Day Statistics 2022</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>cases</th>
              <th>cases_per_day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>count</td>
              <td>3,269</td>
              <td>3,269</td>
            </tr>
            <tr>
              <td>mean</td>
              <td>9,715,535</td>
              <td>26,617.90</td>
            </tr>
            <tr>
              <td>std</td>
              <td>36,475,750</td>
              <td>99,933.57</td>
            </tr>
            <tr>
              <td>25%</td>
              <td>991,748</td>
              <td>2,717.12</td>
            </tr>
            <tr>
              <td>50%</td>
              <td>2,474,830</td>
              <td>6,780.36</td>
            </tr>
            <tr>
              <td>75%</td>
              <td>6,387,470</td>
              <td>17,499.92</td>
            </tr>
            <tr>
              <td>max</td>
              <td>1,132,082,000</td>
              <td>3,101,594</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

`;

  const sections = [
    { text: "First case of Covid 19 happens on 2020-01-21", showGraphs: false, showButton: true },
    { text: "Year 2020", startDate: "2020-01-01", endDate: "2020-12-31", showGraphs: true, showButton: true },
    { text: "Year 2021", startDate: "2021-01-01", endDate: "2021-12-31", showGraphs: true, showButton: true },
    { text: "Year 2022", startDate: "2022-01-01", endDate: "2022-12-31", showGraphs: true, showButton: true },
    { text: "Things become better after 2023", showGraphs: false, showButton: true }
  ];

  const dataUrls = ['public/data/us.csv'];

  function togglePlots(i) {
    showPlots[i] = !showPlots[i];
  }

  // Function to increment the index and scroll to the next section
  async function incrementIndex() {
    if (index < sections.length - 1) {
      index += 1;
      const nextSection = document.querySelector(`.section-${index}`);
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Function to decrement the index and scroll to the previous section
  async function decrementIndex() {
    if (index > 0) {
      index -= 1;
      const prevSection = document.querySelector(`.section-${index}`);
      prevSection.scrollIntoView({ behavior: 'smooth' });
    }
  }


</script>
<div class="yellow-background">
  {@html string1}
</div>

<!-- <p>{@html string1}</p> -->


<Scroller
  top={0.0}
  bottom={1}
  threshold={0.5}
  bind:count
  bind:index
  bind:offset
  bind:progress
  bind:this={scroller}
>
<div class="container" slot="foreground">
  <div class="map-container" bind:clientWidth={width} bind:clientHeight={height}>
    <div class="title mainland-title">US Mainland</div>
    <div class="title hawaii-title">Hawaii</div>
    <div class="title alaska-title">Alaska</div>
    <Map {geoJsonToFit} {index} />
  </div> 
  <div class="sections-container" >
    {#each sections as section, i}
    
      <section class="section-{i}"> 
        <div>
          <div>{section.text}</div>
          <div class="button-container">
            {#if section.showButton}
              {#if i === 0}
                <button class="show-plots-button" on:click={incrementIndex}>
                  Next Section
                </button>
              {/if}
              {#if i === sections.length - 1}
                <button class="show-plots-button" on:click={decrementIndex}>
                  Previous Section
                </button>
              {/if}
            {/if}
            {#if section.showButton && !showPlots[i] && i !== 0 && i !== sections.length - 1}
              <button class="show-plots-button" on:click={() => togglePlots(i)}>
                Show Plots
              </button>
              <button class="show-plots-button" on:click={incrementIndex}>
                Next Section
              </button>
              <button class="show-plots-button" on:click={decrementIndex}>
                Previous Section
              </button>
            {/if}
          </div>
        </div>
        {#if section.showGraphs && showPlots[i]}
          <div class="graph-section" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
            <div class="button-container">
              <button class="hide-plots-button" on:click={() => togglePlots(i)}>
                Hide Plots
              </button>
              <button class="show-plots-button" on:click={incrementIndex}>
                Next Section
              </button>
              <button class="show-plots-button" on:click={decrementIndex}>
                Previous Section
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
</div>
</Scroller>

<style>
  .container {
    display: flex;
    overflow: hidden; 
    height: 100vh;
    width: 100%;
    position: relative;
  }


  .map-container {
    width: 70%;
    height: 100vh;
    position: auto;
  }

  .sections-container {
    width: 30%;
    height: 100vh;
    overflow-y: auto;
    position: relative;
    right: 0; 
    scroll-snap-type: y mandatory;
    overflow: hidden
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


  .yellow-background {
  background-color: #92ecde ;
  color: black;
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>
