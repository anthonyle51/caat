<script lang="ts">
    let languages = ['Korean', 'Japanese', 'Vietnamese'];

	let selected = '';
	let prompt = '';
    let context = '';
    let error = '';

    async function fetchContext() {
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    selected,
                    prompt
                })
            });

            const data = await response.json();
            console.log(selected)
            console.log(prompt)
            
            if (response.ok) {
                context = data.contexts
                error = "";
            } else {
                context = "";
                error = data.error || "Failed to generate contexts.";
            }
        } catch (e) {
            error = "Failed to fetch the contexts.";
            console.error(e);
        }
    }
</script>

<form onsubmit={fetchContext}>
	<select bind:value={selected} onchange={() => (prompt = '')}>
		{#each languages as language}
			<option value={language}>
				{language}
			</option>
		{/each}
	</select>

	<input bind:value={prompt} />

	<button disabled={!prompt} type="submit"> Submit </button>
</form>

{#if context}
    <p><strong>Context:</strong> {context}</p>
{/if}

{#if error}
    <p style="color: red;"><strong>Error:</strong> {error}</p>
{/if}

