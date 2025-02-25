<script lang="ts">
    let haiku: string = "";
    let error: string = "";

    async function fetchHaiku() {
        try {
            const response = await fetch('/api/translate');
            const data = await response.json();
            if (data.error) {
                error = data.error;
            } else {
                haiku = data.haiku;
            }
        } catch (e) {
            error = "Failed to fetch the haiku.";
            console.error(e);
        }
    }
</script>

<h1>Translate</h1>
<button on:click={fetchHaiku}>Get Haiku</button>

{#if haiku}
    <p><strong>Haiku:</strong> {haiku}</p>
{/if}

{#if error}
    <p style="color: red;"><strong>Error:</strong> {error}</p>
{/if}

