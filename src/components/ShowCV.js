import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Avatar,
  Chip,
  ScrollShadow,
  Button,
  Textarea,
  Skeleton,
} from "@nextui-org/react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  HeartIcon,
  MapPinIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config/config";
import { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ShowCV = () => {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState("");
  const { user } = useAuth();
  const userid = user?.userid;
  const requestedUserid = useParams().userid;

  const isOwner = userid === cv?.userid;

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/cv/get-cv/${requestedUserid}`,
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Impossible de récupérer le CV");
        }
        const data = await response.json();
        setCV(data.data);
      } catch (err) {
        console.error("Erreur lors du chargement du CV :", err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/recommendation/${requestedUserid}/recommendations`,
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Impossible de récupérer les recommandations");
        }
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Erreur lors du chargement des recommandations :", err.message);
      }
    };

    fetchCV();
    fetchRecommendations();
  }, [requestedUserid]);

  const handleAddRecommendation = async (e) => {
    e.preventDefault();

    if (!newRecommendation.trim()) {
        alert("Veuillez saisir une recommandation valide.");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/recommendation/add-recommendation`, {
            method: "POST",
            credentials: "include", // Important pour inclure les cookies JWT
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: newRecommendation,
                cvid: requestedUserid, // ID du CV
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur API :", errorData);
            throw new Error(errorData.message || "Erreur lors de l'ajout de la recommandation");
        }

        const data = await response.json();
        setRecommendations((prev) => [...prev, data.recommendation]);
        setNewRecommendation("");
    } catch (err) {
        console.error("Erreur lors de l'ajout de la recommandation :", err.message);
    }
  };
  const handleDeleteRecommendation = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/recommendation/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Inclure les cookies JWT si nécessaires
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        throw new Error(errorData.message || "Erreur lors de la suppression de la recommandation");
      }
  
      // Mettre à jour la liste des recommandations après suppression
      setRecommendations((prev) => prev.filter((rec) => rec._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression de la recommandation :", err.message);
    }
  };
  
  
  
  return (
    <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil CV</h1>
          <p className="text-gray-600">Détails du CV</p>
        </div>

        {loading ? (
          <SkeletonCV />
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader className="flex gap-6 p-6 relative">
                {isOwner && (
                  <Button
                    color="primary"
                    variant="light"
                    startContent={<PencilIcon className="h-5 w-5" />}
                    as={Link}
                    to={`/edit-cv/${userid}`}
                    className="absolute top-4 right-4"
                  >
                    Modifier le CV
                  </Button>
                )}
                <Avatar
                  name={`${cv.firstname} ${cv.lastname}`}
                  size="lg"
                  className="w-24 h-24 text-2xl"
                />
                <div className="flex flex-col flex-grow">
                  <h1 className="text-3xl font-bold">{`${cv.firstname} ${cv.lastname}`}</h1>
                  <p className="text-xl text-default-500 mt-2">{cv.title}</p>
                  <div className="flex items-center gap-2 mt-3">
                  <MapPinIcon className="h-4 w-4 text-default-500" />
                    <span className="text-default-400">{cv.location}</span>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <p className="text-lg">{cv.summary}</p>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Section Éducation */}
              <SectionCard title="Éducation" icon={AcademicCapIcon}>
                <ScrollShadow className="max-h-[400px]">
                  {cv.education.map((edu) => (
                    <SectionItem
                      key={edu._id}
                      title={edu.degree}
                      subtitle={edu.institution}
                      description={edu.description}
                      date={`${new Date(edu.startdate).getFullYear()} - ${new Date(edu.enddate).getFullYear()}`}
                    />
                  ))}
                </ScrollShadow>
              </SectionCard>

              {/* Section Expériences professionnelles */}
              <SectionCard title="Expériences professionnelles" icon={BriefcaseIcon}>
                <ScrollShadow className="max-h-[400px]">
                  {cv.experiences.map((exp) => (
                    <SectionItem
                      key={exp._id}
                      title={exp.role}
                      subtitle={exp.company}
                      description={exp.description}
                      date={`${new Date(exp.startdate).getFullYear()} - ${new Date(exp.enddate).getFullYear()}`}
                    />
                  ))}
                </ScrollShadow>
              </SectionCard>

              {/* Section Hobbies & Intérêts */}
              <SectionCard title="Hobbies & Intérêts" icon={HeartIcon}>
                <div className="flex flex-wrap gap-3">
                  {cv.hobbies.map((hobby) => (
                    <Chip
                      key={hobby._id}
                      variant="flat"
                      className="bg-primary/10 p-2"
                    >
                      {hobby.hobby}
                    </Chip>
                  ))}
                </div>
              </SectionCard>
            </div>
          </>
        )}
      </div>

      {/* Bloc Recommandations */}
      <div className="w-full md:w-1/4 bg-gray-50 shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Recommandations</h2>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar à gauche */}
                  <Avatar
                    name={`${rec.firstname} ${rec.lastname}`}
                    size="md"
                    color="primary"
                    isBordered
                  />
                  {/* Conteneur pour nom/prénom et commentaire */}
                  <div className="flex-1">
                    {/* Nom et prénom alignés horizontalement */}
                    <p className="font-semibold text-lg">{`${rec.firstname} ${rec.lastname}`}</p>
                    {/* Commentaire sous le nom/prénom */}
                    <p className="text-sm text-gray-600 mt-1">{rec.text}</p>
                  </div>
                  {/* Bouton de suppression visible uniquement pour le propriétaire */}
                  {String(user?.userid) === String(rec.commentatorid) && (
                    <TrashIcon
                      className="h-5 w-5 text-red-500 cursor-pointer"
                      onClick={() => handleDeleteRecommendation(rec._id)}
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune recommandation pour ce CV.</p>
        )}


        <Divider className="my-4" />
        <form onSubmit={handleAddRecommendation}>
          <Textarea
            placeholder="Laissez une recommandation..."
            value={newRecommendation}
            onChange={(e) => setNewRecommendation(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <Button type="submit" color="primary" disabled={!newRecommendation.trim()}>
            Ajouter
          </Button>
        </form>
      </div>
    </div>
  );
};

const SkeletonCV = () => (
  <div className="space-y-8">
    <Card className="mb-8">
      <CardHeader className="flex gap-6 p-6">
        <Skeleton className="rounded-full w-24 h-24" />
        <div className="flex flex-col flex-grow gap-3">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
          <Skeleton className="h-5 w-1/4 rounded-lg" />
        </div>
      </CardHeader>
      <CardBody className="px-6 pb-6">
        <Skeleton className="h-20 w-full rounded-lg" />
      </CardBody>
    </Card>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <Card>
    <CardHeader className="flex gap-3 p-6">
      <Icon className="w-6 h-6 text-primary" />
      <h2 className="text-xl font-bold">{title}</h2>
    </CardHeader>
    <Divider />
    <CardBody className="p-6">{children}</CardBody>
  </Card>
);

const SectionItem = ({ title, subtitle, description, date }) => (
  <div className="mb-6">
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-default-500">{subtitle}</p>
    <p className="text-sm mt-1">{description}</p>
    {date && (
      <Chip size="sm" className="mt-2">
        {date}
      </Chip>
    )}
    <Divider className="my-3" />
  </div>
);

export default ShowCV;
