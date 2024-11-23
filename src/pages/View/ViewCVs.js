import React from 'react';

export default function ViewCVs() {
  const cvs = [
    { id: 1, name: 'Jean Dupont', status: 'public' },
    { id: 2, name: 'Marie Curie', status: 'private' },
  ];

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Tous les CV</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {cvs.map((cv) => (
          <div
            key={cv.id}
            className="bg-white shadow-md rounded-md p-4 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold">{cv.name}</h2>
            <p className="text-gray-600 mb-4">
              {cv.status === 'public' ? 'Public' : 'Privé'}
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Voir
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Modifier
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
