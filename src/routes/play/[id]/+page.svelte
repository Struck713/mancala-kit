<script lang="ts">
    import PartySocket from "partysocket";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import { PUBLIC_PARTYKIT_URL } from "$env/static/public";
    import { goto } from "$app/navigation";

    export let data;

    let open = false;
    let socket: PartySocket;
    let username: string | null = data.username;

    onMount(async () => {
        const res = await PartySocket.fetch({
            host: PUBLIC_PARTYKIT_URL,
            party: "games",
            room: "list",
            query: {
                id: data.id,
            },
        })
            .then((res) => res.json())
            .catch((_) => null);
        if (!res) {
            toast.error("There is no game with that ID.");
            await goto("/play/");
        }

        if (data.username) join()
    });

    const join = async () => {
        socket = new PartySocket({
            host: PUBLIC_PARTYKIT_URL,
            party: "game",
            room: data.id,
            query: {
                username,
            },
        });

        socket.onmessage = (msg) => console.log(msg);
        socket.onopen = () => (open = true);
        socket.onerror = (err) => {
            toast.error(`Failed to connect to game server.`);
            open = false;
        };
    };
</script>

<div class="h-screen flex justify-center items-center">
    {#if !open}
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Mancala: {data.id}</h2>
                <div class="flex flex-col px-2">
                    <div class="join">
                        <input
                            class="input input-bordered join-item"
                            placeholder="Enter your username.."
                            bind:value={username}
                        />
                        <button
                            class="btn btn-accent join-item rounded-r-full"
                            on:click={join}>Join game</button
                        >
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <p>Thanks for the code.</p>
    {/if}
</div>
