<script lang="ts">
  import { onMount } from 'svelte';
  let input = $state('');
  let messages: { role: 'user' | 'assistant'; content: string }[] = $state([]);
  let loading = $state(false);
  let inputEl: HTMLInputElement = $state();

  async function send() {
    const text = input.trim();
    if (!text) return;
    input = '';
    messages = [...messages, { role: 'user', content: text }];
    loading = true;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-8) })
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {}
      if (!res.ok || !data?.reply) {
        const err = data?.error || 'Error contacting server.';
        const detail = data?.detail ? ` (${data.detail})` : '';
        messages = [...messages, { role: 'assistant', content: `${err}${detail}` }];
      } else {
        messages = [...messages, { role: 'assistant', content: data.reply }];
      }
    } catch {
      messages = [...messages, { role: 'assistant', content: 'Error contacting server.' }];
    } finally {
      loading = false;
      inputEl?.focus();
    }
  }

  async function moreDetail() {
    const text = 'More detail';
    messages = [...messages, { role: 'user', content: text }];
    loading = true;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-8) })
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {}
      if (!res.ok || !data?.reply) {
        const err = data?.error || 'Error contacting server.';
        const detail = data?.detail ? ` (${data.detail})` : '';
        messages = [...messages, { role: 'assistant', content: `${err}${detail}` }];
      } else {
        messages = [...messages, { role: 'assistant', content: data.reply }];
      }
    } catch {
      messages = [...messages, { role: 'assistant', content: 'Error contacting server.' }];
    } finally {
      loading = false;
      inputEl?.focus();
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  onMount(() => inputEl?.focus());
</script>

<!-- Terminal UI -->
<section class="min-h-[70vh] p-6 sm:p-8 font-mono">
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <div class="text-slate-400">alex@site:~$</div>
      <div class="text-2xl sm:text-3xl">Personal AI Terminal</div>
    </div>

    <div class="space-y-4">
      {#each messages as m, i (i)}
        <div>
          <span class="text-slate-400">{m.role === 'user' ? 'you' : 'bot'}&gt;</span>
          <span class="whitespace-pre-wrap"> {m.content}</span>
          {#if i === messages.length - 1 && m.role === 'assistant' && !loading}
            <div class="mt-1">
              <button
                class="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
                onclick={moreDetail}
                aria-label="Ask for more detail"
              >More detail</button>
            </div>
          {/if}
        </div>
      {/each}

      {#if loading}
        <div class="text-slate-400">bot&gt; thinking...</div>
      {/if}

      <div class="flex items-start gap-2">
        <div class="text-slate-400 pt-3">you&gt;</div>
        <div class="flex-1">
          <input
            bind:this={inputEl}
            bind:value={input}
            onkeydown={onKey}
            placeholder="What do you want to know about me?"
            class="w-full bg-transparent border-b border-slate-600 focus:outline-none caret placeholder:text-slate-500 text-white py-3"
          />
        </div>
        <button onclick={send} class="px-3 py-2 border border-slate-600 hover:bg-slate-700/50">Send</button>
      </div>
    </div>
  </div>
</section>

<style>
  .caret::after {
    content: "";
    display: inline-block;
    width: 8px;
    height: 1.25em;
    margin-left: 2px;
    background: #9ca3af; /* slate-400 */
    animation: blink 1s step-end infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
</style>
