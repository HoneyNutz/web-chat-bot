<script lang="ts">
  import '../app.css';
  import Navbar from '../components/Navbar.svelte';
  import Footer from '../components/Footer.svelte';
  import Contact from '../components/Contact.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import '@fontsource/fira-code/400.css';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let showContactModal = $state(false);
  function openContactModal() {
    showContactModal = true;
  }
  function closeContactModal() {
    showContactModal = false;
  }

  onMount(() => {
    if (!browser) return;
    (window as any).openContactModal = openContactModal;
  });
  onDestroy(() => {
    if (!browser) return;
    if ((window as any).openContactModal) delete (window as any).openContactModal;
  });
</script>

<svelte:head>
  <title>Alex — Chat</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-screen bg-slate-800 text-white">
  <Navbar />
  <main class="pt-16">
    {@render children?.()}
  </main>
  <Footer />
  <Contact bind:showContactModal />
</div>
