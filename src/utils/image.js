const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

function addDetailsToImage(imagePath, certificateName, otherDetails) {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await loadImage(imagePath);
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, 0, 0);

      ctx.font = '30px sans-serif'; // Adjust font and size as needed
      ctx.fillStyle = 'black'; // Adjust text color
      ctx.textAlign = 'center';
      ctx.fillText(certificateName.name, canvas.width / certificateName.width, 385); // Adjust position
      ctx.font = '18px sans-serif';
      // Add other details
      let yPosition = 267; // Adjust starting position for details
      for (const detail of otherDetails) {
        ctx.fillText(detail.text, canvas.width / detail.width, yPosition);
        yPosition += 182; // Adjust spacing between details
      }

      // Save the modified image
      const outputPath = path.join(path.dirname(imagePath), path.basename(imagePath, '.png') + '_annotated.png');
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);

      resolve(`Successfully added details to ${outputPath}`);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  try {
    const imagePath = 'cer.png'; // Replace with your image path
    const certificateName = { name: 'John Doe', width: 1.95 };
    const otherDetails = [
      { text: 'Course: Web Development', width: 2.09 },
      { text: '2024-05-10', width: 3.5 },
    ];

    const result = await addDetailsToImage(imagePath, certificateName, otherDetails);
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
})();