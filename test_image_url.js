// Test image URL generation
const { getImageUrl } = require('./client/src/services/api.js');

console.log('Testing getImageUrl function:');

// Test cases
const testCases = [
  'uploads/profiles/image-123.jpg',
  '/uploads/profiles/image-123.jpg',
  'image-123.jpg',
  null,
  '',
  'http://example.com/image.jpg'
];

testCases.forEach(testCase => {
  console.log(`Input: "${testCase}"`);
  console.log(`Output: "${getImageUrl(testCase)}"`);
  console.log('---');
});
