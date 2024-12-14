<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_PARTYKIT_URL } from "$env/static/public";
    import PartySocket from "partysocket";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import type { GameInfo } from "../../../shared/packet";

    const create = async () => {
        const res = await PartySocket.fetch(
            {
                host: PUBLIC_PARTYKIT_URL,
                party: "games",
                room: "list",
            },
            {
                method: "POST",
                body: JSON.stringify({}),
            },
        )
            .then((res) => res.json())
            .catch((_) => null);

        if (!res) {
            toast.error("Failed to create a game.");
            return;
        }

        await goto(`/play/${res.id}`);
    };

    let games: GameInfo[] = [];
    onMount(async () => {
        const res = await PartySocket.fetch(
            {
                host: PUBLIC_PARTYKIT_URL,
                party: "games",
                room: "list",
                query: {
                    id: "*",
                },
            },
            {
                method: "GET",
            },
        )
            .then((res) => res.json())
            .catch((_) => null);

        console.log(res);
        games = res ?? [];
    });
</script>

<div class="h-screen flex flex-col gap-5 justify-center items-center">
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title">Mancala</h2>
            <div class="flex flex-col gap-2 px-2">
                <p>
                    At some point, there will be options here but for now, there
                    aren't any
                </p>
                <button class="btn btn-accent rounded-full" on:click={create}
                    >Create game</button
                >
            </div>
        </div>
    </div>
</div>
<div class="px-12 grid grid-cols-3 gap-4">
    {#each games as { id, players }}
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title flex flex-row justify-between">
                        Game {id.substring(0,6)}
                        <div class="self-center badge badge-neutral">{players.length}/2</div>
                    </h2>
                    <p></p>
                    <div class="card-actions justify-end">
                        <a class="btn" href="/play/{id}">Join now!</a>
                    </div>
                </div>
            </div>
    {/each}
</div>
