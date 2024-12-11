<script lang="ts">
    import { Toaster } from "svelte-french-toast";
    import "../app.css";
    let { children } = $props();
</script>

<div>
    <div class="navbar bg-base-100 absolute">
        <div class="flex-1">
            <a href="/" class="btn btn-ghost text-xl">Mancala</a>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
                <li><a href="/play">Create</a></li>
            </ul>
        </div>
    </div>

    {@render children()}
</div>
<Toaster />
