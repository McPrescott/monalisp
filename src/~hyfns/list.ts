// -----------------------------------------------------------------------------
// -- LIST FUNCTIONS
//------------------------------------------------------------------------------


/**
 * Return the first element of *list*.
 */
export const head = <T>(list: T[]): T => (
  list[0]
);


/**
 * Return the last element of *list*.
 */
export const last = <T>(list: T[]) => (
  list[list.length-1]
);


/**
 * Return new `Array` containing all but the first element of *list*.
 */
export const tail = <T>(list: T[]): T[] => (
  list.filter((_, i) => i !== 0)
);


/**
 * Return new `Array` zipped from *firstList* and *secondList*.
 */
export const zip: Zip = (firstList, secondList) => {
  const zipped = [];
  let minLength = Math.min(firstList.length, secondList.length);
  for (let i=0; i<minLength; i++) {
    zipped.push([firstList[i], secondList[i]]);
  }
  return zipped;
}

interface Zip {
  <T extends unknown[], U extends unknown[]>(firstList: T, secondList: U): 
    [ArrayType<T>, ArrayType<U>][]
}


/**
 * Get given *index* of *list* or last element in case of overflow.
 */
export const sget = <T>(ls: T[], index: number): T => (
  ls[Math.min(index, ls.length-1)]
);


/**
 * Zip given lists, repeating the last element of the shorter list until the
 * longer list is exhausted.
 */
export const zipLong = <T, U>(ls1: T[], ls2: U[]): [T, U][] => {
  const zipped: [T, U][] = [];
  const max = Math.max(ls1.length, ls2.length);
  for (let i=0; i<max; i++) {
    const elem1 = sget(ls1, i);
    const elem2 = sget(ls2, i);
    zipped.push([elem1, elem2]);
  }
  return zipped;
}

// export const zip = <T=any[][]>(...lists: unknown[][]): T => {
//   const zipped = [];
//   let minLength = Math.min(...map(list => list.length, lists));
//   for (let i=0; i<minLength; i++) {
//     zipped.push(map(list => list[i], lists));
//   }
//   //@ts-ignore
//   return zipped as T;
// }
