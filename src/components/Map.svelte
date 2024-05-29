<script>
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  export let index;
  export let geoJsonToFit;

  mapboxgl.accessToken =
    "pk.eyJ1IjoiMjU0OTQ4NjM3MyIsImEiOiJjbHcyc2pvdnMwcHRyMmp0aTF2Zm9uMG1jIn0.5jMEYh4ZzoZT0-SDWUfVqA";

  let container;
  let alaskaContainer;
  let hawaiiContainer;
  let map, alaskaMap, hawaiiMap;

  let zoomLevel;

  function updateZoomLevel() {
    const screenWidth = window.innerWidth;
    zoomLevel = screenWidth <= 600 ? 3 : 4; 
  }

  function handleResize() {
    updateZoomLevel();
    map.setZoom(zoomLevel);
  }

  onMount(() => {
    console.log("-----------");
    console.log(index);
    console.log("-----------");
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
        data: 'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json' // replace with your county boundaries GeoJSON URL if different
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

    map.on("load", () => {
      hideLabelLayers(map);

      // Add state and county boundaries
      map.addSource('state-boundaries', {
        type: 'geojson',
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson' // replace with your state boundaries GeoJSON URL if different
      });

      map.addLayer({
        id: 'state-boundaries',
        type: 'line',
        source: 'state-boundaries',
        layout: {},
        paint: {
          'line-color': '#000000',
          'line-width': 1
        }
      });

      addCountyBoundaries(map);

      updateBounds();
      map.on("zoom", updateBounds);
      map.on("drag", updateBounds);
      map.on("move", updateBounds);
    });

    alaskaMap.on("load", () => {
      hideLabelLayers(alaskaMap);
      addCountyBoundaries(alaskaMap);
    });

    hawaiiMap.on("load", () => {
      hideLabelLayers(hawaiiMap);
      addCountyBoundaries(hawaiiMap);
    });
  });

  function updateBounds() {
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

  // $: if (index >= 2) {
  //   isVisible = true;
  // } else {
  //   isVisible = false;
  // }
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
</style>
