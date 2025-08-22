<script lang="ts">
  import SITE_DATA from '$lib/site-data/siteData';
  import { onMount } from 'svelte';

  interface Props {
    showContactModal?: boolean;
  }

  let { showContactModal = $bindable(false) }: Props = $props();

  function closeModal() {
    showContactModal = false;
  }

  // Lazy-load emailjs only in the browser to avoid SSR "window is not defined"
  let emailjs: any;
  onMount(async () => {
    const mod = await import('@emailjs/browser');
    emailjs = mod.default ?? mod;
  });

  function sendEmail(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!emailjs) {
      alert('Email client not ready. Please try again in a moment.');
      return;
    }
    emailjs.sendForm('service_42xpr2q', 'template_pgifo6b', form, 'XUGeY1f-j8D-VcUaI').then(
      () => {
        alert('Message sent successfully!');
        closeModal();
        form.reset();
      },
      () => {
        alert('SUBMISSION FAILED...');
      }
    );
  }
</script>

<!-- Contact Modal - Only visible when triggered by navbar button -->
{#if showContactModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    role="button"
    tabindex="0"
    aria-label="Close contact modal"
    onclick={closeModal}
    onkeydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeModal(); }}
  >
    <div
      class="bg-slate-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      tabindex="-1"
      onkeydown={(e) => { if (e.key === 'Escape') closeModal(); e.stopPropagation(); }}
      onclick={(e) => e.stopPropagation()}
    >
      <button class="btn btn-sm btn-circle absolute right-2 top-2 z-10" onclick={closeModal} aria-label="Close">✕</button>

      <div class="p-6">
        <h2 id="contact-modal-title" class="mb-6 text-4xl tracking-tight font-extrabold text-center text-white">
          Contact Me
        </h2>
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Profile Pic -->
          <div class="flex flex-col items-center px-6 py-4 text-white lg:w-1/3">
            <img
              class="object-cover rounded-full w-32 lg:w-48 p-1 border-4 border-[#FF00B4]"
              src={SITE_DATA.ABOUT_DATA.IMG}
              alt="Alex Profile Pic"
            />
            <div class="font-bold text-xl text-center mt-4">{SITE_DATA.ABOUT_DATA.NAME}</div>
            <p class="text-sm text-center text-gray-300">{SITE_DATA.ABOUT_DATA.TITLE}</p>
          </div>

          <!-- Form -->
          <div class="flex flex-col w-full lg:w-2/3 px-6">
            <form onsubmit={sendEmail} class="space-y-4">
              <div class="form-control w-full">
                <label class="label" for="from_name">
                  <span class="label-text text-white">What is your name?</span>
                </label>
                <input
                  id="from_name"
                  type="text"
                  placeholder="Type here"
                  name="from_name"
                  required
                  class="input input-bordered w-full bg-slate-700 text-white"
                />
              </div>

              <div class="form-control w-full">
                <label class="label" for="reply_to">
                  <span class="label-text text-white">What is your email?</span>
                </label>
                <input
                  id="reply_to"
                  type="email"
                  placeholder="your@email.com"
                  name="reply_to"
                  required
                  class="input input-bordered w-full bg-slate-700 text-white"
                />
              </div>

              <div class="form-control w-full">
                <label class="label" for="message">
                  <span class="label-text text-white">What can I help you with?</span>
                </label>
                <textarea
                  id="message"
                  placeholder="Type Here"
                  name="message"
                  required
                  rows="4"
                  class="textarea textarea-bordered w-full bg-slate-700 text-white"
                ></textarea>
              </div>

              <div class="flex gap-4 justify-end mt-6">
                <button type="button" class="btn btn-ghost" onclick={closeModal}>Close</button>
                <input class="btn btn-primary" type="submit" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
