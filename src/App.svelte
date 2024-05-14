<script>
  import ArrayDisplay from "./ArrayDisplay.svelte";
  import Timeline from "./Timeline.svelte";

  import {
    Add,
    TrashOutline,
    Play,
    Pause,
    PlayForwardSharp,
    PlayBackSharp,
  } from "svelte-ionicons";

  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";
  import CircleProgressBar from "./CircleProgressBar.svelte";

  /** @type {import('./types.d.ts').Element[]} */
  let original = [];
  let elements = original;

  /** @type {import('./types.d.ts').TimelineKeyframe[]} */
  let timeline = [];
  let timelineStep = 0;
  let selectedElement = 1;
  let timelineLow = 0;
  let timelineHigh = 0;

  /**@type {number | null} */
  let timelinePivot = null;
  /**@type {string | null}*/
  let timelineDesc = null;

  /** @type {('play' | 'pause')} */
  let playbackState = "pause";

  $: {
  }

  const generateTimeline = () => {
    timeline = [];
    if (original.length == 0) {
      return;
    }
    timelineLow = 0;
    timelineHigh = original.length - 1;
    timelineStep = 0;
    randSelect(original, 0, original.length - 1, selectedElement);
  };

  const removeElement = (/** @type {number} */ index) => {
    original = original.filter((elem) => elem.id != index);
    elements = original;
    generateTimeline();
  };

  let elementIdCount = 0;
  const addElement = () => {
    original = [
      ...original,
      { id: elementIdCount, value: Math.floor(Math.random() * 50) },
    ];
    elements = original;
    elementIdCount += 1;
    generateTimeline();
  };

  const changeSelectedElement = () => {
    timelineStep = 0;
    elements = original;
    generateTimeline();
  };

  const play = () => {
    if (playbackState == "pause") {
      playbackState = "play";
    } else {
      playbackState = "pause";
    }
  };

  const partition = (arr, low, high) => {
    const pivotIndex = Math.floor(Math.random() * (high - low) + low);
    timeline.push({
      state: arr,
      low,
      high: pivotIndex - 1,
      pivot: pivotIndex,
      description:
        "The element we are searching for is on the left side of the pivot",
      kind: "partition",
    });
    if (low > high) {
      throw Error("low > high");
    }

    [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];

    for (let j = low; j < high; j++) {
      if (arr[j].value > arr[high].value) {
        continue;
      }

      [arr[low], arr[j]] = [arr[j], arr[low]];
      low += 1;
    }

    [arr[low], arr[high]] = [arr[high], arr[low]];
    return low;
  };

  const changeTimepoint = (step) => {
    if (step < 0 || step > timeline.length - 1) {
      throw Error("out of bounds");
    }
    timelineStep = step;

    const tpoint = timeline[timelineStep];
    elements = tpoint.state;
    timelineLow = tpoint.low;
    timelineHigh = tpoint.high;
    timelinePivot = tpoint.pivot;
    timelineDesc = tpoint.description;
  };

  const takeStepForward = () => {
    if (timelineStep == timeline.length - 1) {
      return;
    }
    changeTimepoint(timelineStep + 1);
  };

  const takeStepBackward = () => {
    if (timelineStep == 0) {
      return;
    }
    changeTimepoint(timelineStep - 1);
  };

  const randSelect = (arr, low, high, n) => {
    arr = [...arr];
    if (low > high) {
      throw Error("low > high");
    }
    if (low == high) {
      timeline.push({
        state: arr,
        low,
        high,
        pivot: low,
        description: "Done!",
        kind: "select",
      });
      return low;
    }
    const q = partition(arr, low, high);
    timeline.push({
      state: arr,
      low,
      high,
      pivot: q,
      description: "Partitioned around " + q,
      kind: "select",
    });

    const k = q - low + 1;
    if (n == k) {
      timeline.push({
        state: arr,
        low,
        high,
        pivot: q,
        description: "Done!",
        kind: "select",
      });
      return q;
    } else if (n < k) {
      // left
      timeline.push({
        state: arr,
        low,
        high: q - 1,
        pivot: q,
        description:
          "The element we are searching for is on the left side of the pivot",
        kind: "select",
      });
      return randSelect(arr, low, q - 1, n);
    }

    // right
    timeline.push({
      state: arr,
      low,
      high: q - 1,
      pivot: q,
      description:
        "The element we are searching for is on the right side of the pivot",
      kind: "select",
    });
    return randSelect(arr, q + 1, high, n - k);
  };

  const onChangeNumElements = (e) => {
    const delta = parseInt(e.currentTarget.value) - original.length;
    const absdelta = Math.abs(delta);

    if (delta < 0) {
      original = original.slice(0, delta);
    } else if (delta > 0) {
      for (let i = 0; i < absdelta; i++) {
        addElement();
      }
    }
    elements = original;
    generateTimeline();
  };
</script>

<main>
  <ArrayDisplay
    bind:elements
    bind:selectedElement
    bind:low={timelineLow}
    bind:high={timelineHigh}
    bind:pivot={timelinePivot}
    on:removeElement={(e) => {
      removeElement(e.detail);
    }}
  ></ArrayDisplay>
</main>

<div class="visualization-container">
  <Timeline
    bind:timeline
    bind:step={timelineStep}
    on:changetimepoint={(e) => changeTimepoint(e.detail)}
  ></Timeline>
  <div class="visualization-controls">
    <div class="visualization-controls-left">
      <div class="no-elements">
        <span>Number of elements: {original.length}</span>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={original.length}
          on:change={onChangeNumElements}
        />
      </div>
    </div>
    <div class="playback-controls">
      <PlayBackSharp on:click={takeStepBackward} />
      {#if playbackState == "pause"}
        <Play size="36" on:click={play} />
      {:else if playbackState == "play"}
        <CircleProgressBar>
          <Pause size="36" on:click={play} />
        </CircleProgressBar>
      {/if}
      <PlayForwardSharp on:click={takeStepForward} />
    </div>
    <div class="visualization-controls-right">
      <input
        type="number"
        bind:value={selectedElement}
        min="1"
        max={original.length}
        disabled={original.length == 0}
        on:change={changeSelectedElement}
      />
    </div>
  </div>
</div>

<style lang="scss">
  main {
    position: relative;
    display: flex;
    place-content: center center;
    flex-direction: column;
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

  .visualization-container {
    display: flex;
    flex-direction: column;
    justify-items: end;

    padding-bottom: 0.5rem;

    & > * {
      flex-grow: 1;
    }
  }

  .visualization-controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    margin-left: 0.5rem;
    margin-right: 0.5rem;

    .visualization-controls-left {
      display: flex;
      justify-content: start;
    }

    .visualization-controls-right {
      display: flex;
      justify-content: end;
    }

    .no-elements {
      display: flex;
      flex-direction: column;
    }
  }

  .playback-controls {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
