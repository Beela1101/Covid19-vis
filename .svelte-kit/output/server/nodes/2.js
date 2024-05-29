

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.2032959f.js","_app/immutable/chunks/index.11e7d0cf.js"];
export const stylesheets = ["_app/immutable/assets/2.6c6a0b5c.css"];
export const fonts = [];
