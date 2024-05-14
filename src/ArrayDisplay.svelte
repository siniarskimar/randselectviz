<script>
  import { Help, TrashOutline } from "svelte-ionicons";

  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  /** @type {import('./types').Element[]}*/
  export let elements = [];

  /** @type {number} */
  export let selectedElement = 1;

  /** @type {number}*/
  export let low = 0;

  /** @type {number}*/
  export let high = elements.length;

  /** @type {?number}*/
  export let pivot = null;

  //   $: console.log(low, high);

  /** @param {number} id */
  const removeElement = (id) => {
    dispatch("removeElement", id);
  };
</script>

<div class="array-display">
  <div class="element-display">
    {#each elements as elem, i (elem.id)}
      <div
        class="array-element"
        animate:flip
        class:array-element--discarded={i < low || i > high}
        class:array-element--pivot={pivot != null && i == pivot}
      >
        <div class="array-element-drag"></div>
        <p>{elem.value}</p>
        <div class="array-element-operations">
          <TrashOutline
            class="array-element-remove"
            on:click={() => removeElement(elem.id)}
          />
        </div>
      </div>
    {/each}
    {#if elements.length == 0}
      <div class="array-element array-element--placeholder">
        <Help size="3rem"></Help>
      </div>
    {/if}
  </div>
  <div class="indicators-display">
    {#each elements as elem, i}
      <div
        class="indicator-container"
      >
      <p class="element-index">{i}</p>
      {#if i == pivot}
      <p class="indicator indicator--pivot">pivot</p>
      {/if}
      {#if i == selectedElement - 1}
      <p class="indicator indicator--selected">n-th element</p>
      {/if}
    </div>
    {/each}
  </div>
</div>

<style>
  .array-display {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    height: 100%;

    margin-left: 4rem;
    margin-right: 4rem;
  }

  .element-display,
  .indicators-display {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;

    width: 100%;
    place-content: center center;
  }

  .indicators-display {
    margin-top: .5rem;
  }

  .array-element {
    flex-grow: 1;
    max-width: 5rem;
    aspect-ratio: 1/1;

    border: 2px solid black;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    transition: opacity 250ms ease-in-out;
  }

  .array-element--placeholder {
    width: 5rem;
    aspect-ratio: 1/1;
    margin: 0;
    text-align: center;
  }

  .array-element--discarded {
    filter: grayscale(0.5);
    opacity: 0.5;
  }

  .indicator-container {
    flex-grow: 1;
    max-width: 5rem;
    height: 0.9rem;
    margin: 0 2px;

    & p {
      font-size: 0.6rem;
      margin: 0;
      text-align: center; 
    }
  }

  .indicator--pivot {
    background-color: hsla(220, 94%, 52%, 1);
  }

  .indicator--selected {
    background-color: hsla(347, 94%, 52%, 1);
  }

  .element-index {
    text-align: center;
    margin: 0;
  }

  .array-element-operations {
    /* margin: 4rem; */
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
