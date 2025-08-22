declare module '*.json?raw' {
  const content: string;
  export default content;
}

// Fallback type for emailjs when types fail to resolve in Svelte files
declare module '@emailjs/browser' {
  const mod: any;
  export default mod;
  export = mod;
}
