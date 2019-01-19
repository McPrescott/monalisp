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


// export const zip = <T=any[][]>(...lists: unknown[][]): T => {
//   const zipped = [];
//   let minLength = Math.min(...map(list => list.length, lists));
//   for (let i=0; i<minLength; i++) {
//     zipped.push(map(list => list[i], lists));
//   }
//   //@ts-ignore
//   return zipped as T;
// }
