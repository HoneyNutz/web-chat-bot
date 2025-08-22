<script lang="ts">
  import SITE_DATA from '$lib/site-data/siteData';
  let socialsites = SITE_DATA.SOCIAL_DATA.SOCIALMEDIA;
</script>

<section>
  <footer
    class="flex fixed bottom-0 w-full mt-12 gap-10 justify-center content-center text-2xl bg-black p-4"
  >
    {#each socialsites as socialsite}
      <a href={socialsite.URL}>
        <img class="w-5 h-5" src={socialsite.IMG} alt="icon" />
      </a>
    {/each}
  </footer>
</section>
