<script>
  import { Add, TrashOutline } from "svelte-ionicons";

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
  {#each elements as elem, i (elem.id)}
    <div
      class="array-element"
      animate:flip
      class:array-element--selected={i == selectedElement - 1}
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
    <div class="array-element--placeholder">
      Add a array element using <Add size="12" /> button
    </div>
  {/if}
</div>

<style>
  .array-display {
    display: flex;
    place-content: center center;
    flex-direction: row;
    gap: 0.5rem;

    max-height: 10rem;

    margin-left: 4rem;
    margin-right: 4rem;
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

  .array-element--selected {
    background-color: red;
  }

  .array-element--discarded {
    filter: grayscale(.5);
    opacity: .5;
  }

  .array-element-operations {
    /* margin: 4rem; */
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
