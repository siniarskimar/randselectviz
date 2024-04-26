<script>
  import {
    Add,
    TrashOutline,
    Play,
    Pause,
    PlayForwardSharp,
    PlayBackSharp,
  } from "svelte-ionicons";

  let elements = [];
  let timeline = [];

  /** @param {('play' | 'pause')} playbackState */
  let playbackState = "pause";

  const onClick = () => {
    elements = [...elements, Math.floor(Math.random() * 5)];
  };

  const removeElement = (/** @type {number} */ index) => {
    elements = elements.filter((_, idx) => idx != index);
  };
</script>

<main>
  <div class="array-display">
    {#each elements as elem, i}
      <div class="array-element">
        <div class="array-element-drag"></div>
        <p>{elem}</p>
        <div class="array-element-operations">
          <TrashOutline
            class="array-element-remove"
            on:click={() => removeElement(i)}
          />
        </div>
      </div>
    {/each}
    {#if elements.length == 0}
      <div class="array-element--placeholder">
        Add a array element using <Add size="12" /> button
      </div>
    {/if}
  </div>
  <button class="btn-add-element button--round" on:click={onClick}
    ><Add size="34" /></button
  >
</main>

<div class="playback">
  <div class="playback-timeline"></div>
  <div class="playback-controls">
    <PlayBackSharp />
    {#if playbackState == "pause"}
      <Play size="36" />
    {:else if playbackState == "play"}
      <Pause size="36" />
    {/if}
    <PlayForwardSharp />
  </div>
</div>

<style>
  main {
    position: relative;
    display: flex;
    place-content: center center;
    flex-direction: column;
  }

  .array-display {
    display: flex;
    place-content: center center;
    flex-direction: row;
  }

  .array-element {
    width: 5rem;
    aspect-ratio: 1/1;
  }

  .array-element--placeholder {
    width: 5rem;
    aspect-ratio: 1/1;
    margin: 0;
    text-align: center;
  }

  .btn-add-element {
    position: absolute;
    right: 2rem;
    bottom: 2rem;

    width: 4rem;
  }

  .button--round {
    aspect-ratio: 1/1;
    border-radius: 50%;
    padding: 0;
  }

  .playback {
    display: flex;
    flex-direction: column;
    justify-items: end;
  }

  .playback-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
  }
</style>
