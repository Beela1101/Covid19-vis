import { c as create_ssr_component, d as add_attribute, e as escape, v as validate_component, f as each } from "../../chunks/index.js";
import mapboxgl from "mapbox-gl";
import { geoMercator } from "d3-geo";
const Scroller_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "svelte-scroller-outer.svelte-xdbafy{display:block;position:relative}svelte-scroller-background.svelte-xdbafy{display:block;position:relative;width:100%}svelte-scroller-foreground.svelte-xdbafy{display:block;position:relative;z-index:2}svelte-scroller-foreground.svelte-xdbafy::after{content:' ';display:block;clear:both}svelte-scroller-background-container.svelte-xdbafy{display:block;position:absolute;width:100%;max-width:100%;pointer-events:none;will-change:transform}",
  map: null
};
const handlers = [];
if (typeof window !== "undefined") {
  const run_all = () => handlers.forEach((fn) => fn());
  window.addEventListener("scroll", run_all);
  window.addEventListener("resize", run_all);
}
if (typeof IntersectionObserver !== "undefined") {
  const map = /* @__PURE__ */ new Map();
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const update = map.get(entry.target);
        const index = handlers.indexOf(update);
        if (entry.isIntersecting) {
          if (index === -1)
            handlers.push(update);
        } else {
          update();
          if (index !== -1)
            handlers.splice(index, 1);
        }
      });
    },
    {
      rootMargin: "400px 0px"
      // TODO why 400?
    }
  );
}
const Scroller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let style;
  let widthStyle;
  let { top = 0 } = $$props;
  let { bottom = 1 } = $$props;
  let { threshold = 0.5 } = $$props;
  let { query = "section" } = $$props;
  let { parallax = false } = $$props;
  let { index = 0 } = $$props;
  let { count = 0 } = $$props;
  let { offset = 0 } = $$props;
  let { progress = 0 } = $$props;
  let { visible = false } = $$props;
  let outer;
  let foreground;
  let background;
  let offset_top = 0;
  if ($$props.top === void 0 && $$bindings.top && top !== void 0)
    $$bindings.top(top);
  if ($$props.bottom === void 0 && $$bindings.bottom && bottom !== void 0)
    $$bindings.bottom(bottom);
  if ($$props.threshold === void 0 && $$bindings.threshold && threshold !== void 0)
    $$bindings.threshold(threshold);
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.parallax === void 0 && $$bindings.parallax && parallax !== void 0)
    $$bindings.parallax(parallax);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.count === void 0 && $$bindings.count && count !== void 0)
    $$bindings.count(count);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  $$result.css.add(css$2);
  style = `
		position: ${"absolute"};
		top: 0;
		transform: translate(0, ${offset_top}px);
		z-index: ${1};
	`;
  widthStyle = "";
  return `

<svelte-scroller-outer class="svelte-xdbafy"${add_attribute("this", outer, 0)}><svelte-scroller-background-container class="background-container svelte-xdbafy" style="${escape(style, true) + escape(widthStyle, true)}"><svelte-scroller-background class="svelte-xdbafy"${add_attribute("this", background, 0)}>${slots.background ? slots.background({}) : ``}</svelte-scroller-background></svelte-scroller-background-container>

	<svelte-scroller-foreground class="svelte-xdbafy"${add_attribute("this", foreground, 0)}>${slots.foreground ? slots.foreground({}) : ``}</svelte-scroller-foreground>
</svelte-scroller-outer>`;
});
const Map_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".map-container.svelte-m3bbj5{position:relative;width:100%;height:100vh}.map.svelte-m3bbj5{width:100%;height:100%;position:absolute;opacity:0;visibility:hidden;transition:opacity 2s, visibility 2s}.map.visible.svelte-m3bbj5{opacity:1;visibility:visible}.inset-map.svelte-m3bbj5{position:absolute;width:150px;height:150px;border:2px solid #000}.alaska.svelte-m3bbj5{bottom:10px;left:10px}.hawaii.svelte-m3bbj5{bottom:10px;left:170px}",
  map: null
};
const Map$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index } = $$props;
  let { geoJsonToFit } = $$props;
  mapboxgl.accessToken = "pk.eyJ1IjoiMjU0OTQ4NjM3MyIsImEiOiJjbHcyc2pvdnMwcHRyMmp0aTF2Zm9uMG1jIn0.5jMEYh4ZzoZT0-SDWUfVqA";
  let container;
  let alaskaContainer;
  let hawaiiContainer;
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.geoJsonToFit === void 0 && $$bindings.geoJsonToFit && geoJsonToFit !== void 0)
    $$bindings.geoJsonToFit(geoJsonToFit);
  $$result.css.add(css$1);
  return `${$$result.head += `<!-- HEAD_svelte-1s9kg0l_START --><link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css"><!-- HEAD_svelte-1s9kg0l_END -->`, ""}

<div class="map-container svelte-m3bbj5"><div class="${["map svelte-m3bbj5", "visible"].join(" ").trim()}"${add_attribute("this", container, 0)}></div>
  <div class="inset-map alaska svelte-m3bbj5"${add_attribute("this", alaskaContainer, 0)}></div>
  <div class="inset-map hawaii svelte-m3bbj5"${add_attribute("this", hawaiiContainer, 0)}></div>
</div>`;
});
const ScrollyTeller_svelte_svelte_type_style_lang = "";
const css = {
  code: ".container.svelte-f73pu2{display:flex;width:100%;height:100vh}.map-container.svelte-f73pu2{width:75%;height:100vh;position:relative}.sections-container.svelte-f73pu2{width:25%;height:100vh;overflow-y:auto;position:relative}.title.svelte-f73pu2{position:absolute;font-size:1.5em;font-weight:bold;background:rgba(255, 255, 255, 0.7);padding:0.2em;border-radius:0.2em}.mainland-title.svelte-f73pu2{top:10px;left:10px}.hawaii-title.svelte-f73pu2{top:640px;left:200px}.alaska-title.svelte-f73pu2{top:640px;left:30px}section.svelte-f73pu2{height:40vh;text-align:center;max-width:750px;color:black;padding:1em;margin:0 0 2em 0}",
  map: null
};
const ScrollyTeller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let count, index, offset, progress;
  let width, height;
  let geoJsonToFit = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [1, 0] }
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [0, 1] }
      }
    ]
  };
  const sections = Array.from({ length: 26 }, (_, i) => `This is section ${i + 1}.`);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    geoMercator().fitSize([width, height], geoJsonToFit);
    $$rendered = `<div class="container svelte-f73pu2"><div class="map-container svelte-f73pu2">${validate_component(Map$1, "Map").$$render(
      $$result,
      { index, geoJsonToFit },
      {
        geoJsonToFit: ($$value) => {
          geoJsonToFit = $$value;
          $$settled = false;
        }
      },
      {}
    )}
    

    <div class="title mainland-title svelte-f73pu2">US Mainland</div>
    <div class="title hawaii-title svelte-f73pu2">Hawaii</div>
    <div class="title alaska-title svelte-f73pu2">Alaska</div></div>

  <div class="sections-container svelte-f73pu2">${validate_component(Scroller, "Scroller").$$render(
      $$result,
      {
        top: 0,
        bottom: 1,
        threshold: 0.5,
        count,
        index,
        offset,
        progress
      },
      {
        count: ($$value) => {
          count = $$value;
          $$settled = false;
        },
        index: ($$value) => {
          index = $$value;
          $$settled = false;
        },
        offset: ($$value) => {
          offset = $$value;
          $$settled = false;
        },
        progress: ($$value) => {
          progress = $$value;
          $$settled = false;
        }
      },
      {
        foreground: () => {
          return `<div class="foreground" slot="foreground">${each(sections, (section) => {
            return `<section class="svelte-f73pu2">${escape(section)}</section>`;
          })}</div>`;
        }
      }
    )}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main>${validate_component(ScrollyTeller, "ScrollyTeller").$$render($$result, {}, {}, {})}</main>`;
});
export {
  Page as default
};
