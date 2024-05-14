<script>
  import { flip } from "svelte/animate";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  /** @type {number} */
  export let step = 0;

  /** @type {import('./types').TimelineKeyframe[]}*/
  export let timeline = [];


</script>

<div class="timeline">
  {#each timeline as tpoint, idx (idx)}
    <button
      class="timeline-point"
      class:--active={idx == step}
      style:--scaling={idx == step ? 1.5 : 1}
      animate:flip
      on:click = {() => dispatch('changetimepoint', idx)}
    >
    </button>
  {/each}
</div>

<style lang="scss">
  .timeline {
    display: flex;
    flex-direction: row;
    padding-left: 2rem;
    padding-right: 2rem;

    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }

  .timeline-point {
    padding: 0;
    border: none;
    --scaling: 1;

    position: relative;
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;

    background-color: gray;

    transform: scale(var(--scaling));
    transition: --scaling 250ms ease-in-out;
  }
</style>
