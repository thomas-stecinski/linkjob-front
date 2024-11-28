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
import { useState, useEffect, useRef } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ShowCV = () => {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState("");
  const { user } = useAuth();
  const userid = user?.userid;
  const requestedUserid = useParams().userid;
  const recommendationsContainerRef = useRef(null);
  const [editingRecommendation, setEditingRecommendation] = useState(null);
  const isOwner = userid === requestedUserid;
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };


  useEffect(() => {
    console.log('Fetching CV for user:', requestedUserid);
    console.log('User ID:', userid);
    console.log('Is owner:', isOwner);
    const fetchCV = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/cv/get-cv/${requestedUserid}`,
          { headers }
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
          { headers }
        );
        if (!response.ok) {
          throw new Error("Impossible de récupérer les recommandations");
        }
        const data = await response.json();

        const sortedRecommendations = data.recommendations.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setRecommendations(sortedRecommendations || []);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des recommandations :",
          err.message
        );
      }
    };

    fetchCV();
    fetchRecommendations();
  }, [requestedUserid]);

  const scrollToBottom = () => {
    if (recommendationsContainerRef.current) {
      recommendationsContainerRef.current.scrollTo({
        top: recommendationsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleEditRecommendation = async (e, id) => {
    e.preventDefault();
  
    const updatedText = recommendations.find((rec) => rec._id === id)?.text;
  
    if (!updatedText.trim()) {
      toast.error("Veuillez saisir un texte valide.");
      return;
    }
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/recommendation/edit/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ text: updatedText }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la modification.");
      }
  
      const data = await response.json();
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec._id === id ? { ...rec, text: data.recommendation.text } : rec
        )
      );
      toast.success("Recommandation modifiée avec succès !");
      setEditingRecommendation(null);
    } catch (err) {
      toast.error(err.message || "Une erreur s'est produite.");
      console.error("Erreur lors de la modification :", err.message);
    }
  };
  
  

  const handleAddRecommendation = async (e) => {
    e.preventDefault();
  
    if (!newRecommendation.trim()) {
      toast.error("Veuillez saisir une recommandation valide.");
      return;
    }
  
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/recommendation/add-recommendation`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            text: newRecommendation,
            cvid: requestedUserid,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'ajout.");
      }
  
      const data = await response.json();
      setRecommendations((prev) => [...prev, data.recommendation]);
      toast.success("Recommandation ajoutée avec succès !");
      setTimeout(() => scrollToBottom(), 100);
      setNewRecommendation("");
    } catch (err) {
      toast.error(err.message || "Une erreur s'est produite.");
      console.error("Erreur lors de l'ajout de la recommandation :", err.message);
    }
  };
  

  const handleDeleteRecommendation = async (id) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/recommendation/delete/${id}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression.");
      }
  
      setRecommendations((prev) => prev.filter((rec) => rec._id !== id));
      toast.success("Recommandation supprimée avec succès !");
    } catch (err) {
      toast.error(err.message || "Une erreur s'est produite.");
      console.error("Erreur lors de la suppression de la recommandation :", err.message);
    }
  };
  


  return (

    <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
      <ToastContainer position="top-right" autoClose={3000} />
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
              <SectionCard title="Éducation" icon={AcademicCapIcon}>
                <ScrollShadow className="max-h-[400px]">
                  {cv.education.map((edu) => (
                    <SectionItem
                      key={edu._id}
                      title={edu.degree}
                      subtitle={edu.institution}
                      description={edu.description}
                      date={`${new Date(edu.startdate).getFullYear()} - ${new Date(
                        edu.enddate
                      ).getFullYear()}`}
                    />
                  ))}
                </ScrollShadow>
              </SectionCard>

              <SectionCard title="Expériences professionnelles" icon={BriefcaseIcon}>
                <ScrollShadow className="max-h-[400px]">
                  {cv.experiences.map((exp) => (
                    <SectionItem
                      key={exp._id}
                      title={exp.role}
                      subtitle={exp.company}
                      description={exp.description}
                      date={`${new Date(exp.startdate).getFullYear()} - ${new Date(
                        exp.enddate
                      ).getFullYear()}`}
                    />
                  ))}
                </ScrollShadow>
              </SectionCard>

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
      <div className="w-full md:w-1/4 bg-white shadow-lg rounded-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Recommandations</h2>
        <div
          id="recommendations-container"
          ref={recommendationsContainerRef}
          className="flex-1 overflow-y-auto"
          style={{
            maxHeight: "600px",
          }}
        >
        {recommendations.map((rec) => {
          const isToday =
            new Date(rec.createdAt).toDateString() === new Date().toDateString();
          const displayDate = isToday
            ? new Date(rec.createdAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date(rec.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

          const firstname = rec.userID?.firstname || "Utilisateur";
          const lastname = rec.userID?.lastname || "Inconnu";

          return (
            <Card
              key={rec._id}
              className="bg-white shadow-sm border border-gray-200 p-4 rounded-lg relative"
            >
              <div className="flex items-start gap-4">
                <Avatar
                  name={`${firstname} ${lastname}`}
                  size="md"
                  color="primary"
                  isBordered
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{`${firstname} ${lastname}`}</p>
                  {editingRecommendation === rec._id ? (
                    <form
                      onSubmit={(e) => {
                        handleEditRecommendation(e, rec._id);
                      }}
                    >
                      <Textarea
                        value={rec.text}
                        onChange={(e) =>
                          setRecommendations((prev) =>
                            prev.map((r) =>
                              r._id === rec._id ? { ...r, text: e.target.value } : r
                            )
                          )
                        }
                        rows={3}
                        className="w-full"
                      />
                      <div className="mt-2 flex gap-2">
                        <Button type="submit" size="sm" color="primary">
                          Sauvegarder
                        </Button>
                        <Button
                          size="sm"
                          color="default"
                          onClick={() => setEditingRecommendation(null)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{rec.text}</p>
                  )}
                </div>
                <div className="text-xs text-gray-400 absolute top-2 right-2">
                  {displayDate}
                </div>
              </div>
              {/* icône de suppression uniquement si l'utilisateur est le propriétaire du CV */}
              {(isOwner || String(user?.userid) === String(rec.userID?._id)) && (
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <TrashIcon
                    className="h-4 w-4 text-red-500 cursor-pointer" 
                    onClick={() => handleDeleteRecommendation(rec._id)}
                  />
                  {String(user?.userid) === String(rec.userID?._id) && (
                    <PencilIcon
                      className="h-4 w-4 text-gray-500 cursor-pointer" 
                      onClick={() => setEditingRecommendation(rec._id)}
                    />
                  )}
                </div>
              )}
            </Card>
          );
        })}

        </div>

        <Divider className="my-4" />
        <form
          onSubmit={(e) => {
            handleAddRecommendation(e);
          }}
          className="mt-4"
        >
          <Textarea
            placeholder="Laissez une recommandation..."
            value={newRecommendation}
            onChange={(e) => setNewRecommendation(e.target.value)}
            className="mb-4"
            rows={3}
          />
          <Button
            type="submit"
            color="primary"
            disabled={!newRecommendation.trim()}
            fullWidth
          >
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
