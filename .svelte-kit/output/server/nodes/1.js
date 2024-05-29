

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.9bc0ec12.js","_app/immutable/chunks/index.11e7d0cf.js","_app/immutable/chunks/singletons.e16eb260.js"];
export const stylesheets = [];
export const fonts = [];
