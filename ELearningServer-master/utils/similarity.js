// utils/similarity.js

// Clean & tokenize text
export const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ")
    .filter(word => word.length > 2); // remove very small words
};

// Count matching words between two arrays
export const keywordSimilarity = (arr1, arr2) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  let common = 0;
  set1.forEach(word => {
    if (set2.has(word)) common++;
  });

  return common;
};

// Final similarity score
export const computeSimilarity = (courseA, courseB) => {
  const titleA = tokenize(courseA.title);
  const titleB = tokenize(courseB.title);
  

  const descA = tokenize(courseA.description);
  const descB = tokenize(courseB.description);

  const titleScore = keywordSimilarity(titleA, titleB);
  const descScore = keywordSimilarity(descA, descB);

  const categoryScore = courseA.category === courseB.category ? 1 : 0;

  // Weighted
  const finalScore = 
      (titleScore * 0.4) +
      (descScore * 0.4) +
      (categoryScore * 0.2);

  return finalScore;
};
