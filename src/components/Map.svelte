<script>
  import mapboxgl from "mapbox-gl";
  import { onMount, afterUpdate } from "svelte";
  export let index;
  export let geoJsonToFit;
  let year;
  let url = 'public/data/year.json';
  let data = [];
  let currentData = [];

  const colors = [
    '#F7FCF0',  
    '#E0F3DB', 
    '#CCEBC5', 
    '#A8DDB5', 
    '#7BCCC4', 
    '#43A2CA', 
    '#0868AC', 
    '#084081' 
  ];

  const labels = [
    '0-9',
    '10-99',
    '100-999',
    '1,000-9,999',
    '10,000-99,999',
    '100,000-999,999',
    '1,000,000-2,999,999',
    '3,000,000+'
  ];

  async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
  }

  onMount(async () => {
    data = await fetchData(url);
    queryData();
    initializeMaps();
  });

  function queryData() {
    if (index <= 1) {
      year = 2020;
    } else if (index === 2) {
      year = 2021;
    } else {
      year = 2022;
    }
    currentData = data.filter(item => item.year === year);
    updateMaps();
  }

  mapboxgl.accessToken = "pk.eyJ1IjoiMjU0OTQ4NjM3MyIsImEiOiJjbHcyc2pvdnMwcHRyMmp0aTF2Zm9uMG1jIn0.5jMEYh4ZzoZT0-SDWUfVqA";

  let container;
  let alaskaContainer;
  let hawaiiContainer;
  let map, alaskaMap, hawaiiMap;

  let zoomLevel;
  let hoveredCounty = null;

  function updateZoomLevel() {
    const screenWidth = window.innerWidth;
    zoomLevel = screenWidth <= 600 ? 3 : 4; 
  }

  function handleResize() {
    updateZoomLevel();
    if (map) map.setZoom(zoomLevel);
  }

  function calculatePercentiles(data, percentiles) {
    const sorted = data.slice().sort((a, b) => a - b);
    const results = percentiles.map(p => {
      const idx = Math.ceil(p * sorted.length) - 1;
      return sorted[idx];
    });
    return results;
  }

  async function fetchAndPrepareGeoJSON() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json');
      const countyGeoJSON = await response.json();

      countyGeoJSON.features.forEach((feature) => {
        const fips = parseInt(feature.id, 10);
        const countyData = currentData.find(item => item.fips === fips);
        feature.properties.cases_per_day = countyData ? countyData.cases_per_day : 0;
        feature.properties.county = countyData ? countyData.county : '';
        feature.properties.state = countyData ? countyData.state : '';
        feature.properties.cases = countyData ? countyData.cases : 0;
      });

      return countyGeoJSON;
    } catch (error) {
      console.error("Error fetching and preparing GeoJSON data:", error);
      return null;
    }
  }

  let countyGeoJSON;

  async function initializeMaps() {
    countyGeoJSON = await fetchAndPrepareGeoJSON();

    if (!countyGeoJSON) {
      console.error("Failed to fetch or prepare GeoJSON data");
      return;
    }

    updateZoomLevel();

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98.583333, 39.833333], 
      zoom: zoomLevel,
      attributionControl: true, 
    });

    alaskaMap = new mapboxgl.Map({
      container: alaskaContainer,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-152.4044, 61.3707],
      zoom: 1.2,
      attributionControl: false,
    });

    hawaiiMap = new mapboxgl.Map({
      container: hawaiiContainer,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-157.5828, 19.8968],
      zoom: 4.1,
      attributionControl: false,
    });

    window.addEventListener("resize", handleResize);

    function hideLabelLayers(mapInstance) {
      const labelLayerIds = mapInstance
        .getStyle()
        .layers.filter(
          (layer) =>
            layer.type === "symbol" && /label|text|place/.test(layer.id)
        )
        .map((layer) => layer.id);

      for (const layerId of labelLayerIds) {
        mapInstance.setLayoutProperty(layerId, "visibility", "none");
      }
    }

    function addCountyBoundaries(mapInstance) {
      mapInstance.addSource('county-boundaries', {
        type: 'geojson',
        data: countyGeoJSON
      });

      mapInstance.addLayer({
        id: 'county-boundaries',
        type: 'line',
        source: 'county-boundaries',
        layout: {},
        paint: {
          'line-color': '#000000',
          'line-width': 0.1
        }
      });
    }

    function colorCounties(mapInstance) {
      mapInstance.addLayer({
        id: 'county-data',
        type: 'fill',
        source: 'county-boundaries',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'cases_per_day'],
            0, '#F7FCF0',  // 浅绿色
            10, '#E0F3DB', // 淡绿色
            100, '#CCEBC5', // 中绿色
            1000, '#A8DDB5', // 绿色
            10000, '#7BCCC4', // 浅蓝绿色
            100000, '#43A2CA', // 深蓝绿色
            1000000, '#0868AC', // 深蓝色
            3000000, '#084081'  // 深蓝黑色
          ],
          'fill-opacity': 0.7
        }
      });
    }

    function addHoverEffect(mapInstance) {
      mapInstance.on('mousemove', 'county-data', (e) => {
        if (e.features.length > 0) {
          hoveredCounty = e.features[0].properties;
        }
      });

      mapInstance.on('mouseleave', 'county-data', () => {
        hoveredCounty = null;
      });
    }

    map.on("load", () => {
      hideLabelLayers(map);

      addCountyBoundaries(map);
      colorCounties(map);
      addHoverEffect(map);

      updateBounds();
      map.on("zoom", updateBounds);
      map.on("drag", updateBounds);
      map.on("move", updateBounds);
    });

    alaskaMap.on("load", () => {
      hideLabelLayers(alaskaMap);
      addCountyBoundaries(alaskaMap);
      colorCounties(alaskaMap);
      addHoverEffect(alaskaMap);
    });

    hawaiiMap.on("load", () => {
      hideLabelLayers(hawaiiMap);
      addCountyBoundaries(hawaiiMap);
      colorCounties(hawaiiMap);
      addHoverEffect(hawaiiMap);
    });
  }

  function updateMaps() {
    fetchAndPrepareGeoJSON().then(updatedGeoJSON => {
      if (updatedGeoJSON) {
        countyGeoJSON = updatedGeoJSON;
        if (map && map.getSource('county-boundaries')) {
          map.getSource('county-boundaries').setData(countyGeoJSON);
        }
        if (alaskaMap && alaskaMap.getSource('county-boundaries')) {
          alaskaMap.getSource('county-boundaries').setData(countyGeoJSON);
        }
        if (hawaiiMap && hawaiiMap.getSource('county-boundaries')) {
          hawaiiMap.getSource('county-boundaries').setData(countyGeoJSON);
        }
      }
    });
  }

  afterUpdate(() => {
    queryData();
  });

  function updateBounds() {
    if (!map) return;
    const bounds = map.getBounds();
    geoJsonToFit.features[0].geometry.coordinates = [
      bounds._ne.lng,
      bounds._ne.lat,
    ];
    geoJsonToFit.features[1].geometry.coordinates = [
      bounds._sw.lng,
      bounds._sw.lat,
    ];
  }

  let isVisible = true;
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"
  />
</svelte:head>

<div class="map-container">
  <div class="map" class:visible={isVisible} bind:this={container}></div>
  <div class="inset-map alaska" bind:this={alaskaContainer}></div>
  <div class="inset-map hawaii" bind:this={hawaiiContainer}></div>
  <div class="info-box">
    {#if hoveredCounty}
      <div>
        <h3>County: {hoveredCounty.county}, State: {hoveredCounty.state}</h3>
        <p>Average Cases Per Day: {hoveredCounty.cases_per_day}</p>
        <p>Total Cases: {hoveredCounty.cases}</p>
      </div>
    {/if}
  </div>
  <div class="legend">
    <h4>Legend</h4>
    {#each labels as label, index}
      <div class="legend-item">
        <span class="legend-color" style="background-color: {colors[index]}"></span>
        <span>{label}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .map {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: opacity 2s, visibility 2s;
  }

  .map.visible {
    opacity: 1;
    visibility: visible;
  }

  .inset-map {
    position: absolute;
    width: 150px;
    height: 150px;
    border: 2px solid #000;
  }

  .alaska {
    bottom: 10px;
    left: 10px;
  }

  .hawaii {
    bottom: 10px;
    left: 170px;
  }

  .info-box {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .legend {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .legend h4 {
    margin: 0 0 5px 0;
    font-size: 14px;
    font-weight: bold;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .legend-color {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: 1px solid #000;
  }
</style>
