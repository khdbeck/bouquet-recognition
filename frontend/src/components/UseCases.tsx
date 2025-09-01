import type React from 'react';

const UseCases: React.FC = () => {
  const useCases = [
    {
      title: 'Thesis',
      description: 'Website is mainly made as a beta version for my bachelors thesis'
    },
    {
      title: 'FLorists',
      description: 'To get fill their Bouquet descriptions or meanings automatically '
    },
    {
      title: 'Educational purposes',
      description: 'May help to understand the flower types'
    },
    {
      title: 'Customers of flower shops',
      description: 'To understand whats inside their bouquets and get meaningful descriptions with what does certain bouquet means'
    }

  ];

  return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-2xl font-semibold">What's the purpose of it?</h2>
          <p className="mb-8 text-center text-gray-600">
            The website is made for:
          </p>

          <div className="mx-auto max-w-3xl">
            <ul className="space-y-4">
              {useCases.map((useCase) => (
                  <li key={useCase.title} className="flex items-start">
                    <div className="mr-3 mt-1 flex-shrink-0 text-yellow-500">

                    </div>
                    <div>
                      <p className="font-semibold">{useCase.title}:</p>
                      <p className="text-gray-600">{useCase.description}</p>
                    </div>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default UseCases;
