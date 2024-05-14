<script>
  import {
    Play,
    Pause,
    PlayForwardSharp,
    PlayBackSharp,
  } from "svelte-ionicons";

  import { fade } from "svelte/transition";

  import ArrayDisplay from "./ArrayDisplay.svelte";
  import Timeline from "./Timeline.svelte";

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
  let playInterval = null;
  let playProgress = 0;
  let playProgressRequest = null;

  const generateTimeline = () => {
    timeline = [];
    if (original.length == 0) {
      return;
    }
    timelineLow = 0;
    timelineHigh = original.length - 1;
    timelineStep = 0;
    timeline.push({
      state: original,
      low: 0,
      high: original.length - 1,
      pivot: null,
      description: null,
      kind: "select",
    });
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
    if (timeline.length == 0) {
      return;
    }


    if (playbackState == "pause") {
      playInterval = setInterval(() => {
        takeStepForward();
        if (timelineStep == timeline.length - 1) {
          play();
        }
      }, 1500);
      playbackState = "play";
    } else {
      clearInterval(playInterval);
      playProgressRequest = null;
      playInterval = null;
      playbackState = "pause";
    }
  };

  const partition = (arr, low, high) => {
    const pivotIndex = Math.floor(Math.random() * (high - low) + low);
    timeline.push({
      state: [...arr],
      low,
      high,
      pivot: pivotIndex,
      description: "Partitioning around index " + pivotIndex,
      kind: "partition",
    });
    if (low > high) {
      throw Error("low > high");
    }

    const origLow = low;
    [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];

    timeline.push({
      state: [...arr],
      low: origLow,
      high,
      pivot: high,
      description: "Swap pivot with index " + high,
      kind: "partition",
    });

    for (let j = low; j < high; j++) {
      if (arr[j].value <= arr[high].value) {
        timeline.push({
          state: [...arr],
          low: origLow,
          high,
          pivot: high,
          description: "Swap index " + low + " with index " + j,
          kind: "partition",
        });
        [arr[low], arr[j]] = [arr[j], arr[low]];
        low += 1;

        timeline.push({
          state: [...arr],
          low: origLow,
          high,
          pivot: high,
          description: null,
          kind: "partition",
        });
      }
    }

    [arr[low], arr[high]] = [arr[high], arr[low]];

    timeline.push({
      state: [...arr],
      low: origLow,
      high,
      pivot: low,
      description: "Place pivot in the correct index",
      kind: "partition",
    });
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
    playProgress = 0;
  };

  const takeStepBackward = () => {
    if (timelineStep == 0) {
      return;
    }
    changeTimepoint(timelineStep - 1);
    playProgress = 0;
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
      description: "Middle index is " + q,
      kind: "partition",
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
      high,
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

<div>
  {#key timelineDesc}
    <p class="timeline-description" transition:fade>
      {timelineDesc ? timelineDesc : ""}
    </p>
  {/key}
</div>

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
          max="10"
          step="1"
          value={original.length}
          on:change={onChangeNumElements}
        />
      </div>
    </div>
    <div class="playback-controls">
      <PlayBackSharp on:click={() => {
        if(playbackState == "pause") takeStepBackward();
      }} />
      {#if playbackState == "pause"}
        <Play size="36" on:click={play} />
      {:else if playbackState == "play"}
        <Pause size="36" on:click={play} />
      {/if}
      <PlayForwardSharp on:click={() => {
        if(playbackState == "pause") takeStepForward();
      }} />
    </div>
    <div class="visualization-controls-right">
      <div class="selected-element">
        <span>N-th element to find</span>
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
</div>

<style lang="scss">
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
    justify-content: end;

    padding-bottom: 0.5rem;
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

  .timeline-description {
    margin: 0;
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
  }

  .selected-element {
    display: flex;
    flex-direction: column;
  }
</style>
