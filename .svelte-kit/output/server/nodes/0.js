

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.4ccac22d.js","_app/immutable/chunks/index.11e7d0cf.js"];
export const stylesheets = [];
export const fonts = [];
