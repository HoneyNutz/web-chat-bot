declare module '*.json?raw' {
  const content: string;
  export default content;
}

// Fallback type for emailjs when types fail to resolve in Svelte files
declare module '@emailjs/browser' {
  const mod: any;
  export default mod;
}

// Svelte 5 runes ambient declarations (for TS tooling/ESLint)
// These are erased at compile time by Svelte, but TS needs them typed.
declare function $state<T>(initial?: T): T;
declare function $props<T>(): T;
declare function $bindable<T>(v?: T): T;
