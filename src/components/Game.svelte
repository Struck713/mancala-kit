<script lang="ts">
    import type PartySocket from "partysocket";
    import type { ICanvas } from "pixi.js";
    import { onMount } from "svelte";
    import { GamePacketType, type GamePacket } from "../../shared/packet"

    export let socket: PartySocket;

    const sendPacket = (packet: GamePacket) => socket.send(JSON.stringify(packet));

    let canvas: ICanvas;
    onMount(async () => {
        const PIXI = await import("pixi.js");
        const app = new PIXI.Application();
        await app.init({ canvas: canvas, width: 800, height: 800, backgroundAlpha: 0 });

        await PIXI.Assets.load("/board.png");

        const status = new PIXI.Text({
            text: "Loading.."
        });
        status.anchor.set(0.5, 0.5);
        status.x = app.screen.width / 2;
        status.y = app.screen.height / 5;
        app.stage.addChild(status)


        let board = PIXI.Sprite.from("/board.png");
        app.stage.addChild(board);

        board.scale.set(0.25, 0.25)
        board.anchor.set(0.5, 0.5)
        board.x = app.screen.width/2;
        board.y = app.screen.height/2;

        socket.onmessage = (msg) => {
            const packet = JSON.parse(msg.data) as GamePacket
            switch (packet.type) {
                case GamePacketType.STATUS: status.text = packet.data as string; break;
            }
        };

        sendPacket({ type: GamePacketType.READY })

    });
</script>

<canvas bind:this={canvas}></canvas>
