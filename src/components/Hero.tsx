import type React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-semibold text-green-500">
            Identify flowers <span className="text-nyckel-darkGray">using Yolo</span>
          </h1>
          <p className="mt-4 text-lg">
            Below is flowers in bouquets classifier to identify flowers. Just upload your image, and the model will
            predict what flower the bouquet contains. Made by Diyorbek Kholmirzaev
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src="https://storage.googleapis.com/regalflowers-cdn/img-2022-07-Regal-Red-Roses-Bouquet-1_11zon-1-scaled.jpg"
            alt="Flowers Garden"
            className="rounded-lg object-cover shadow-lg"
            style={{ maxHeight: '300px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
