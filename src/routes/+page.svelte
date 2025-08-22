<script lang="ts">
  import { onMount } from 'svelte';
  let input = '';
  let messages: { role: 'user' | 'assistant'; content: string }[] = [];
  let loading = false;
  let inputEl: HTMLInputElement;

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
      } catch (e) {
        // ignore JSON parse error; will fall back to generic error below
      }
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
<main class="min-h-screen p-6 sm:p-8 font-mono">
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <div class="text-terminal-dim">alex@site:~$</div>
      <div class="text-2xl sm:text-3xl">Personal AI Terminal</div>
    </div>

    <div class="space-y-4">
      {#each messages as m, i (i)}
        <div>
          <span class="text-terminal-dim">{m.role === 'user' ? 'you' : 'bot'}&gt;</span>
          <span class="whitespace-pre-wrap"> {m.content}</span>
        </div>
      {/each}

      {#if loading}
        <div class="text-terminal-dim">bot&gt; thinking...</div>
      {/if}

      <div class="flex items-start gap-2">
        <div class="text-terminal-dim pt-3">you&gt;</div>
        <div class="flex-1">
          <input
            bind:this={inputEl}
            bind:value={input}
            on:keydown={onKey}
            placeholder="What do you want to know about me?"
            class="w-full bg-transparent border-b border-terminal-dim focus:outline-none caret caret-terminal-text placeholder:text-terminal-dim text-terminal-text py-3"
          />
        </div>
        <button on:click={send} class="px-3 py-2 border border-terminal-dim hover:bg-terminal-dim/10">Send</button>
      </div>
    </div>
  </div>
</main>
