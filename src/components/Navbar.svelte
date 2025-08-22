<script lang="ts">
  import SITE_DATA from '$lib/site-data/siteData';
  import { browser } from '$app/environment';
  let services = SITE_DATA.SERVICE_DATA.SERVICE_LIST;
  let navelements = SITE_DATA.NAVBAR_DATA;
  let mobileMenuOpen = $state(false);

  function openContact() {
    if (!browser) return;
    const w = window as any;
    if (typeof w.openContactModal === 'function') w.openContactModal();
  }
</script>

<nav class="fixed top-0 w-full z-50 bg-black text-[#00f6ab] shadow-lg">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <a href="#" class="flex-shrink-0 text-xl font-bold">
          adicapr<span class="text-[#FF00B4]">.</span>io
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:items-center lg:space-x-8">
        {#each navelements as navelement}
          {#if navelement.label === 'Services'}
            <div class="relative group">
              <button
                class="flex items-center px-3 py-2 text-sm font-medium hover:text-[#FF00B4] transition-colors duration-200"
              >
                {navelement.label}
                <svg
                  class="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <!-- Services Dropdown -->
              <div
                class="absolute left-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <div class="py-1">
                  {#each services as service}
                    <a
                      href="#{service.ID}"
                      class="block px-4 py-2 text-sm hover:bg-slate-700 transition-colors duration-200"
                    >
                      {service.LABEL}
                    </a>
                  {/each}
                </div>
              </div>
            </div>
          {:else}
            <a
              href={navelement.url}
              class="px-3 py-2 text-sm font-medium hover:text-[#FF00B4] transition-colors duration-200"
            >
              {navelement.label}
            </a>
          {/if}
        {/each}
        <button 
          onclick={openContact}
          class="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-300 hover:text-gray-900 transition-all duration-200 cursor-pointer shadow-lg border border-gray-300 hover:border-gray-400 w-full"
        >
          Contact Me
        </button>
      </div>

      <!-- Mobile menu button -->
      <div class="lg:hidden flex items-center">
        <button
          onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
          class="inline-flex items-center justify-center p-2 rounded-md text-[#FF00B4] hover:text-[#ad60c7] focus:outline-none"
        >
          <svg
            class="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            {#if mobileMenuOpen}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            {:else}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Navigation Menu -->
  {#if mobileMenuOpen}
    <div class="lg:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 bg-slate-800 border-t border-slate-700">
        {#each navelements as navelement}
          {#if navelement.label === 'Services'}
            <div class="space-y-1">
              <div class="px-3 py-2 text-sm font-medium text-gray-300">
                {navelement.label}
              </div>
              {#each services as service}
                <a
                  href="#{service.ID}"
                  class="block pl-6 pr-3 py-2 text-sm hover:bg-slate-700 transition-colors duration-200"
                  onclick={() => (mobileMenuOpen = false)}
                >
                  {service.LABEL}
                </a>
              {/each}
            </div>
          {:else}
            <a
              href={navelement.url}
              class="block px-3 py-2 text-sm font-medium hover:bg-gray-900 transition-colors duration-200"
              onclick={() => (mobileMenuOpen = false)}
            >
              {navelement.label}
            </a>
          {/if}
        {/each}
        <button 
          onclick={() => { openContact(); mobileMenuOpen = false; }}
          class="block w-full text-left px-3 py-2 text-sm font-bold bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 hover:text-gray-900 transition-all duration-200 cursor-pointer shadow-lg border border-gray-300 hover:border-gray-400 mt-2"
        >
          Contact Me
        </button>
      </div>
    </div>
  {/if}
</nav>
