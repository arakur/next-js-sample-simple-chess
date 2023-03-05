export type Index8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Tuple8<T> = [T, T, T, T, T, T, T, T];

export class Array8<T> {
  public inner: Tuple8<T>;
  public constructor(inner: Tuple8<T>) {
    this.inner = inner;
  }
  public destruct(): Tuple8<T> {
    return this.inner;
  }
  public static fill<T>(df: T): Array8<T> {
    return new Array8<T>([df, df, df, df, df, df, df, df]);
  }
  public get(index: Index8): T {
    return this.inner[index];
  }
  public set(index: Index8, t: T) {
    this.inner[index] = t;
  }
  public map<U>(f: (val: T, index: Index8) => U): Array8<U> {
    const innerU = this.inner.map((val, index) => f(val, index as Index8));
    return new Array8<U>(innerU as [U, U, U, U, U, U, U, U]);
  }
  public allInnerDur(
    cond: (val: T, index: Index8) => boolean,
    i0: Index8,
    i1: Index8
  ): boolean {
    const iMin = Math.min(i0, i1);
    const iMax = Math.max(i0, i1);
    for (let i = iMin + 1; i < iMax; i++) {
      if (!cond(this.get(i as Index8), i as Index8)) return false;
    }
    return true;
  }
}

export type Row = Index8;
export type Col = Index8;
export type Coordinate = { r: Row; c: Col };

export function ToChessCoordinate(coord: Coordinate): string {
  return String.fromCharCode(97 + coord.c) + (8 - coord.r);
}

export class Table8x8<T> {
  public inner: Array8<Array8<T>>;
  public constructor(inner: Array8<Array8<T>>) {
    this.inner = inner;
  }
  public static fill<T>(df: T) {
    return new Table8x8(
      new Array8([
        Array8.fill(df),
        Array8.fill(df),
        Array8.fill(df),
        Array8.fill(df),
        Array8.fill(df),
        Array8.fill(df),
        Array8.fill(df),
        Array8.fill(df),
      ])
    );
  }
  public get(coord: Coordinate): T {
    return this.inner.get(coord.r).get(coord.c);
  }
  public set(coord: Coordinate, t: T) {
    this.inner.get(coord.r).set(coord.c, t);
  }
  public map<U>(f: (val: T, coord: Coordinate) => U): Table8x8<U> {
    return new Table8x8(
      this.inner.map((row, r) => row.map((val, c) => f(val, { r, c })))
    );
  }
  public mapRow<U>(f: (row: Array8<T>, r: Row) => U): Array8<U> {
    return this.inner.map((row, r) => f(row, r));
  }
  public all(cond: (val: T, coord: Coordinate) => boolean): boolean {
    for (let i = 0; i < 8; i++) {
      const r = i as Row;
      for (let j = 0; j < 8; j++) {
        const c = j as Col;
        if (!cond(this.get({ r, c }), { r, c })) return false;
      }
    }
    return true;
  }
  public allDurInnerRow(
    cond: (val: T) => boolean,
    coord0: Coordinate,
    c1: Col
  ): boolean {
    return this.inner.get(coord0.r).allInnerDur(cond, coord0.c, c1);
  }
  public allDurInnerCol(
    cond: (val: T) => boolean,
    coord0: Coordinate,
    r1: Row
  ): boolean {
    return this.inner.allInnerDur(
      (row, _) => cond(row.get(coord0.c)),
      coord0.r,
      r1
    );
  }
  public allDurInnerDownDiag(
    cond: (val: T) => boolean,
    coord0: Coordinate,
    coord1: Coordinate
  ): boolean {
    // assertion:
    if (coord0.r - coord1.r !== coord0.c - coord1.c)
      throw new Error("assertion error: not diagonal");
    // end assertion
    const rMin = Math.min(coord0.r, coord1.r);
    const cMin = Math.min(coord0.c, coord1.c);
    return this.inner.allInnerDur(
      (row, i) => cond(row.get((cMin + i - rMin) as Col)),
      coord0.r,
      coord1.r
    );
  }
  public allDurInnerUpDiag(
    cond: (val: T) => boolean,
    coord0: Coordinate,
    coord1: Coordinate
  ): boolean {
    // assertion:
    if (coord0.r - coord1.r !== coord1.c - coord0.c)
      throw new Error("assertion error: not diagonal");
    // end assertion
    const rMin = Math.min(coord0.r, coord1.r);
    const cMax = Math.max(coord0.c, coord1.c);
    return this.inner.allInnerDur(
      (row, i) => cond(row.get((cMax - i + rMin) as Col)),
      coord0.r,
      coord1.r
    );
  }

  public destruct(): Tuple8<Tuple8<T>> {
    return this.mapRow((row, _) => row.destruct()).destruct();
  }
}
