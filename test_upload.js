const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Test image upload
async function testUpload() {
  try {
    // Create a simple test image buffer
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );

    const form = new FormData();
    form.append('file', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    form.append('type', 'profile');

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer your_token_here' // You'll need to replace with actual token
      }
    });

    const result = await response.json();
    console.log('Upload result:', result);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

testUpload();
