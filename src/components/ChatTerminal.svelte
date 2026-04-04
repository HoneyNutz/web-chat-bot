<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { marked } from 'marked';
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
      await tick();
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
      await tick();
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
  <div class="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl border border-slate-700 bg-black text-green-500">
    
    <!-- Linux Title Bar -->
    <div class="bg-zinc-800 text-zinc-300 px-4 py-2 text-sm flex items-center border-b border-zinc-700 shadow-sm">
      <span class="mr-2 px-2 bg-zinc-600 text-zinc-100 font-bold block">bash</span>
      <span>alex@site:~</span>
    </div>

    <!-- Terminal Content -->
    <div class="p-4 sm:p-6 pb-8 h-full min-h-[500px] flex flex-col">
      <div class="mb-6 border-b border-green-900 pb-4">
        <div class="text-xl sm:text-2xl font-bold opacity-90 tracking-wider">Personal AI Terminal</div>
        <div class="text-xs sm:text-sm opacity-70 mt-1">[System Initialized - Ready for Input]</div>
      </div>

      <div class="space-y-6 flex-1">
        {#each messages as m, i (i)}
          <div class="flex flex-col">
            <div class="mb-1 opacity-70">{m.role === 'user' ? 'alex@site:~$' : 'bot@system:~/'}</div>
            {#if m.role === 'user'}
              <div class="whitespace-pre-wrap ml-4 text-green-400">{m.content}</div>
            {:else}
              <div class="ml-4 terminal-md text-green-300">
                {@html marked.parse(m.content)}
              </div>
            {/if}
            
            {#if i === messages.length - 1 && m.role === 'assistant' && !loading}
              <div class="mt-3 ml-4">
                <button
                  class="text-xs text-green-500 hover:text-green-300 hover:bg-green-950/30 border border-green-800 px-3 py-1 rounded transition-colors"
                  onclick={moreDetail}
                  aria-label="Ask for more detail"
                >More detail _$</button>
              </div>
            {/if}
          </div>
        {/each}

        {#if loading}
          <div class="opacity-70 animate-pulse">bot@system:~/ thinking...</div>
        {/if}

        <div class="flex items-start gap-2 pt-2">
          <div class="opacity-70 pt-[0.6rem]">alex@site:~$</div>
          <div class="flex-1">
            <input
              bind:this={inputEl}
              bind:value={input}
              onkeydown={onKey}
              placeholder="What do you want to know about me?"
              class="w-full bg-transparent focus:outline-none placeholder:text-green-900 placeholder:italic text-green-400 py-2 transition-colors"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  input {
    caret-color: #4ade80; /* green-400 */
  }

  /* Custom Markdown Styling for Terminal */
  :global(.terminal-md p) { margin-bottom: 0.75rem; line-height: 1.6; }
  :global(.terminal-md p:last-child) { margin-bottom: 0; }
  :global(.terminal-md pre) { 
    background: rgba(34, 197, 94, 0.08); 
    padding: 1rem; 
    border-left: 2px solid #16a34a; 
    margin-top: 0.75rem;
    margin-bottom: 0.75rem; 
    overflow-x: auto;
    border-radius: 2px;
  }
  :global(.terminal-md code) { 
    color: #86efac; /* green-300 */
    font-family: inherit;
    background: rgba(34, 197, 94, 0.1);
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
  }
  :global(.terminal-md pre code) {
    color: #4ade80; /* green-400 */
    background: transparent;
    padding: 0;
  }
  :global(.terminal-md ul) { 
    list-style-type: square; 
    margin-left: 1.5rem; 
    margin-bottom: 0.75rem; 
  }
  :global(.terminal-md ul li) {
    margin-bottom: 0.25rem;
  }
  :global(.terminal-md ol) { 
    list-style-type: decimal; 
    margin-left: 1.5rem; 
    margin-bottom: 0.75rem; 
  }
  :global(.terminal-md ol li) {
    margin-bottom: 0.25rem;
  }
  :global(.terminal-md a) { 
    color: #4ade80; 
    text-decoration: underline; 
    text-underline-offset: 2px;
    font-weight: 500;
  }
  :global(.terminal-md a:hover) {
    color: #86efac;
  }
  :global(.terminal-md h1, .terminal-md h2, .terminal-md h3, .terminal-md h4) {
    font-weight: bold;
    color: #86efac;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }
  :global(.terminal-md h1) { font-size: 1.5rem; border-bottom: 1px dashed #166534; padding-bottom: 0.25rem;}
  :global(.terminal-md h2) { font-size: 1.25rem; }
  :global(.terminal-md h3) { font-size: 1.125rem; }
  
  :global(.terminal-md strong) {
    font-weight: bold;
    color: #86efac; /* green-300 */
  }
  :global(.terminal-md blockquote) {
    border-left: 2px solid #166534;
    padding-left: 1rem;
    margin-left: 0;
    color: #6ee7b7;
    font-style: italic;
  }
  :global(.terminal-md table) {
    width: 100%;
    margin-bottom: 1rem;
    border-collapse: collapse;
  }
  :global(.terminal-md th, .terminal-md td) {
    border: 1px solid #166534;
    padding: 0.5rem;
  }
  :global(.terminal-md th) {
    background: rgba(34, 197, 94, 0.1);
  }
</style>
