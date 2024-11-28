import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../config/config';
import Navbar from '../../components/Navbar';

export default function CreateCV() {
  const { user } = useAuth();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [education, setEducation] = useState([
    { degree: '', institution: '', startdate: '', enddate: '', description: '' }
  ]);
  const [experiences, setExperiences] = useState([
    { role: '', company: '', startdate: '', enddate: '', description: '' }
  ]);
  const [hobbies, setHobbies] = useState(['']);
  const [status, setStatus] = useState('public');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const headers = token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'  
  } : {
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
    }
  }, [user]);

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };

  const handleHobbyChange = (index, value) => {
    const updatedHobbies = [...hobbies];
    updatedHobbies[index] = value;
    setHobbies(updatedHobbies);
  };

  const addEducationField = () => {
    setEducation([...education, { degree: '', institution: '', startdate: '', enddate: '', description: '' }]);
  };

  const addExperienceField = () => {
    setExperiences([...experiences, { role: '', company: '', startdate: '', enddate: '', description: '' }]);
  };

  const addHobbyField = () => {
    setHobbies([...hobbies, '']);
  };

  const removeEducationField = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  const removeExperienceField = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const removeHobbyField = (index) => {
    const updatedHobbies = hobbies.filter((_, i) => i !== index);
    setHobbies(updatedHobbies);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const response = await fetch(`${BACKEND_URL}/api/cv/create-cv`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                firstname,
                lastname,
                title,
                location,
                summary,
                education, 
                experiences, 
                hobbies, 
                userid: user?.userid,
                status_label: status,
            }),
            
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create CV');
        }

        const data = await response.json();
        setSuccess('CV créé avec succès !');
        console.log('CV créé :', data);
    } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la création du CV :', err.message);
    }
};



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
        <div className="container mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Créer un CV</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2">Prénom</label>
                <input
                type="text"
                value={firstname}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-500"
                disabled
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Nom</label>
                <input
                type="text"
                value={lastname}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-500"
                disabled
                />
            </div>
            </div>

            {/* Titre, localisation et résumé */}
            <div>
            <label className="block text-gray-700 font-medium mb-2">Titre</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-500"
                placeholder="Entrez votre titre professionnel"
            />
            </div>

            <div>
            <label className="block text-gray-700 font-medium mb-2">Localisation</label>
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-500"
                placeholder="Entrez votre localisation"
            />
            </div>

            <div>
            <label className="block text-gray-700 font-medium mb-2">Résumé</label>
            <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-500"
                placeholder="Décrivez vos compétences et objectifs"
                rows="4"
            />
            </div>

            {/* Éducation */}
            <div>
            <h2 className="text-xl font-bold mb-4">Éducation</h2>
            {education.map((edu, index) => (
                <div key={index} className="space-y-2 mb-4">
                <input
                    type="text"
                    placeholder="Diplôme"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Établissement"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <input
                    type="date"
                    placeholder="Date de début"
                    value={edu.startdate}
                    onChange={(e) => handleEducationChange(index, 'startdate', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <input
                    type="date"
                    placeholder="Date de fin"
                    value={edu.enddate}
                    onChange={(e) => handleEducationChange(index, 'enddate', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <textarea
                    placeholder="Description"
                    value={edu.description}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <button
                    type="button"
                    onClick={() => removeEducationField(index)}
                    className="text-red-500 text-sm underline"
                >
                    Supprimer
                </button>
                </div>
            ))}
            <button type="button" onClick={addEducationField} className="text-blue-500 underline">
                Ajouter une éducation
            </button>
            </div>

            {/* Expériences */}
            <div>
            <h2 className="text-xl font-bold mb-4">Expériences</h2>
            {experiences.map((exp, index) => (
                <div key={index} className="space-y-2 mb-4">
                <input
                    type="text"
                    placeholder="Poste"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Entreprise"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <input
                    type="date"
                    placeholder="Date de début"
                    value={exp.startdate}
                    onChange={(e) => handleExperienceChange(index, 'startdate', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <input
                    type="date"
                    placeholder="Date de fin"
                    value={exp.enddate}
                    onChange={(e) => handleExperienceChange(index, 'enddate', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <textarea
                    placeholder="Description des missions"
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <button
                    type="button"
                    onClick={() => removeExperienceField(index)}
                    className="text-red-500 text-sm underline"
                >
                    Supprimer
                </button>
                </div>
            ))}
            <button type="button" onClick={addExperienceField} className="text-blue-500 underline">
                Ajouter une expérience
            </button>
            </div>

            {/* Hobbies */}
            <div>
            <h2 className="text-xl font-bold mb-4">Hobbies</h2>
            {hobbies.map((hobby, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                <input
                    type="text"
                    placeholder="Hobby"
                    value={hobby}
                    onChange={(e) => handleHobbyChange(index, e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <button
                    type="button"
                    onClick={() => removeHobbyField(index)}
                    className="text-red-500 text-sm underline"
                >
                    Supprimer
                </button>
                </div>
            ))}
            <button type="button" onClick={addHobbyField} className="text-blue-500 underline">
                Ajouter un hobby
            </button>
            </div>

            {/* Statut */}
            <div>
            <label className="block text-gray-700 font-medium mb-2">Statut</label>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
            >
                <option value="public">Public</option>
                <option value="private">Privé</option>
            </select>
            </div>

            <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600"
            >
            Enregistrer le CV
            </button>
        </form>
        </div>
    </div>
  );
}
