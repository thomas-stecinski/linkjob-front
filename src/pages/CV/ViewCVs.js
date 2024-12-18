import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Skeleton,
  Avatar,
  Divider,
  Chip,
  Input,
} from "@nextui-org/react";
import { MapPinIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { BACKEND_URL } from "../../config/config";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// Wrap Card avec motion
const MotionCard = motion(Card);

export default function ViewCVs() {
  const [cvs, setCvs] = useState([]);
  const [filteredCvs, setFilteredCvs] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/cv/get-cv`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await response.json();
        if (data.success) {
          setCvs(data.data);
          setFilteredCvs(data.data); 
        }
      } catch (error) {
        console.error("Error fetching CVs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVs();
  }, []);

  // Met à jour les résultats de recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = cvs.filter((cv) =>
      `${cv.firstname} ${cv.lastname}`.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCvs(filtered);
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="w-full p-8">
          <CardBody className="gap-4">
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} /> {/* Barre de recherche connectée */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bibliothèque de CV
            </h1>
            <p className="text-gray-600">Découvrez les talents de notre communauté</p>
          </div>
          {/* Barre de recherche */}
          <Input
            clearable
            underlined
            placeholder="Rechercher par nom"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-xs md:max-w-md"
          />
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCvs.map((cv) => (
              <MotionCard
                key={cv._id}
                className="p-8"
                onClick={() => navigate(`/cv/${cv.userid}`)}
                initial={{ scale: 1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardHeader className="flex gap-4 pb-6">
                  <Avatar
                    name={getInitials(cv.firstname, cv.lastname)}
                    size="md"
                    color="primary"
                    isBordered
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">
                        {cv.firstname} {cv.lastname}
                      </p>
                      {user && cv.userid === user.userid && (
                        <Chip color="primary" size="sm">
                          Mon CV
                        </Chip>
                      )}
                    </div>
                    <p className="text-small text-default-500 flex items-center gap-1">
                      <BriefcaseIcon className="h-4 w-4" />
                      {cv.title}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="py-6">
                  <div className="flex items-center gap-1 mb-4">
                    <MapPinIcon
                      className="h-4 w-4 text-default-500"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <span className="text-default-500">{cv.location}</span>
                  </div>
                  <p className="text-default-700">
                    {cv.summary.length > 150
                      ? `${cv.summary.substring(0, 150)}...`
                      : cv.summary}
                  </p>
                </CardBody>
                <Divider />
                <CardFooter className="pt-6">
                  <Button
                    color="primary"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cv/${cv.userid}`);
                    }}
                  >
                    Voir le CV complet
                  </Button>
                </CardFooter>
              </MotionCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
