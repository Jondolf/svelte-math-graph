class Range {
  public min: number = Number.MIN_SAFE_INTEGER;
  public max: number = Number.MAX_SAFE_INTEGER;

  constructor(min?: number, max?: number) {
    if (min !== undefined) {
      this.min = min;
    }
    if (max !== undefined) {
      this.max = max;
    }
  }
}

export class DefinedRanges {
  public ranges: Range[] = [];
  public min = NaN;
  public max = NaN;

  constructor(ranges?: [number, number][]) {
    if (ranges) {
      for (const range of ranges) {
        this.addRange(range[0], range[1]);
      }
    }
  }

  /**
   * Adds the given range. If it overlaps with other ranges, the ranges are merged.
   */
  public addRange(min: number, max: number): DefinedRanges {
    const minOverlapIndex = this.ranges.findIndex(r => r.min < min && r.max > min);
    const maxOverlapIndex = this.ranges.findIndex(r => r.min < max && r.max > max);

    const minOverlaps = minOverlapIndex !== -1;
    const maxOverlaps = maxOverlapIndex !== -1;

    // If the range is already contained by another range, there's no point in adding it again.
    if (minOverlaps && maxOverlaps && minOverlapIndex === maxOverlapIndex) {
      return this;
    }

    if (!minOverlaps && !maxOverlaps) {
      // Add range if there's no overlap.
      this.ranges.push(new Range(min, max));
    } else if (!maxOverlaps) {
      // Extend max of overlapping range if only min overlaps.
      this.ranges[minOverlapIndex].max = max;
    } else if (!minOverlaps) {
      // Extend min of overlapping range if only max overlaps.
      this.ranges[maxOverlapIndex].min = min;
    }

    this.updateExtents();
    return this;
  }

  /**
   * Removes a given range.
   */
  public removeRange(min: number, max: number): DefinedRanges {
    const minOverlapIndex = this.ranges.findIndex(r => r.min < min && r.max > min);
    const maxOverlapIndex = this.ranges.findIndex(r => r.min < max && r.max > max);

    const minOverlaps = minOverlapIndex !== -1;
    const maxOverlaps = maxOverlapIndex !== -1;

    // If a range is fully contained by the given range, remove it entirely.
    if (minOverlaps && maxOverlaps && minOverlapIndex === maxOverlapIndex) {
      this.ranges.splice(minOverlapIndex, 1);
      this.updateExtents();
      return this;
    }

    if (!minOverlaps && !maxOverlaps) {
      // Do nothing if there's no overlap.
      return this;
    } else if (!maxOverlaps) {
      // Reduce max of overlapping range if only min overlaps.
      this.ranges[minOverlapIndex].max = min;
    } else if (!minOverlaps) {
      // Reduce min of overlapping range if only max overlaps.
      this.ranges[maxOverlapIndex].min = max;
    }

    this.updateExtents();
    return this;
  }

  private updateExtents() {
    if (this.ranges.length === 0) {
      return;
    }
    this.min = this.ranges[0].min;
    this.max = this.ranges[this.ranges.length - 1].max;
  }
}
