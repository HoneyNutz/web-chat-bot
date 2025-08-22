<script lang="ts">
  import SITE_DATA from '$lib/site-data/siteData';
  let services = SITE_DATA.SERVICE_DATA.SERVICE_LIST;
</script>

<section class="text-white bg-slate-800" id={SITE_DATA.SERVICE_DATA.ID}>
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-lg text-center">
      <h2 class="text-3xl font-bold sm:text-4xl">
        {SITE_DATA.SERVICE_DATA.HEADING}
      </h2>
      <h3 class="text-xl italic pt-1">{SITE_DATA.SERVICE_DATA.SUBHEADING}</h3>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each services as service}
        <div
          class="block rounded-xl border border-slate-300 p-8 shadow-xl transition scroll-m-20 hover:border-[#FF00B4] hover:shadow-[0_20px_25px_-5px_rgba(255,0,180,0.3),0_10px_10px_-5px_rgba(255,0,180,0.1)]"
          id={service.ID}
        >
          <img class="w-20 mx-auto flex h-20" src={service.IMG} alt="icon" />

          <h2 class="mt-4 text-xl font-bold text-white">{service.LABEL}</h2>

          <p class="mt-1 text-sm text-slate-100 text-justify">
            {service.DESCRIPTION}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
