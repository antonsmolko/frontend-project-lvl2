/**
 * Simple object check.
 *
 * @param item
 * @returns {boolean}
 */
export const isObject = (item) => (
  item && typeof item === 'object' && !Array.isArray(item)
);

export default {
  isObject,
};
