<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_PARTYKIT_URL } from "$env/static/public";
    import PartySocket from "partysocket";
    import toast from "svelte-french-toast";

    let username: string;
    const create = async () => {
      const res = await PartySocket.fetch(
          {
              host: PUBLIC_PARTYKIT_URL,
              party: "games",
              room: "list"
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

      await goto(`/play/${res.id}?username=${username}`);
    }

</script>

<div class="h-screen flex justify-center items-center">
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title">Mancala</h2>
            <div class="flex flex-col px-2">
                <div class="join">
                    <input
                        class="input input-bordered join-item"
                        placeholder="Enter a username.."
                        bind:value={username}
                    />
                    <button class="btn btn-accent join-item rounded-r-full" on:click={create}>Create game</button>
                </div>
            </div>
        </div>
    </div>
</div>
