<script lang="ts" type="module">
    import type PartySocket from "partysocket";
    import type { ICanvas } from "pixi.js";
    import { onMount } from "svelte";

    export let socket: PartySocket;

    let canvas: ICanvas;
    onMount(async () => {
        socket.onmessage = (msg) => console.log(msg);

        const PIXI = await import("pixi.js");
        const app = new PIXI.Application();
        await app.init({ canvas: canvas, width: 640, height: 360 });

        await PIXI.Assets.load("/sample.png");
        let sprite = PIXI.Sprite.from("/sample.png");
        app.stage.addChild(sprite);

        let elapsed = 0.0;
        // Tell our application's ticker to run a new callback every frame, passing
        // in the amount of time that has passed since the last tick
        app.ticker.add((ticker) => {
            // Add the time to our total elapsed time
            elapsed += ticker.deltaTime;
            // Update the sprite's X position based on the cosine of our elapsed time.  We divide
            // by 50 to slow the animation down a bit...
            sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
        });
    });
</script>

<canvas bind:this={canvas}></canvas>
