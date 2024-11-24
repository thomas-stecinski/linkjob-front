import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../config/config';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Avatar,
  ScrollShadow,
  Skeleton
} from '@nextui-org/react';
import { MapPinIcon, AcademicCapIcon, BriefcaseIcon, HeartIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';

export default function GetCV() {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userid } = useParams();

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/cv/get-cv/${userid}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch CV');
        }

        const data = await response.json();
        setCV(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [userid]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil CV</h1>
          <p className="text-gray-600">Détails du CV</p>
        </div>

        {loading ? (
          <>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education Skeleton */}
              <Card>
                <CardHeader className="flex gap-3 p-6">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-6">
                      <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
                      <Skeleton className="h-4 w-1/2 rounded-lg mb-2" />
                      <Skeleton className="h-16 w-full rounded-lg mb-2" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Divider className="my-3" />
                    </div>
                  ))}
                </CardBody>
              </Card>

              {/* Experience Skeleton */}
              <Card>
                <CardHeader className="flex gap-3 p-6">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-6">
                      <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
                      <Skeleton className="h-4 w-1/2 rounded-lg mb-2" />
                      <Skeleton className="h-16 w-full rounded-lg mb-2" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Divider className="my-3" />
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>

            {/* Hobbies Skeleton */}
            <Card className="mt-8">
              <CardHeader className="flex gap-3 p-6">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-1/3 rounded-lg" />
              </CardHeader>
              <Divider />
              <CardBody className="p-6">
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              </CardBody>
            </Card>
          </>
        ) : (
          <>
            {/* Header Section */}
            <Card className="mb-8">
              <CardHeader className="flex gap-6 p-6">
                <Avatar
                  name={`${cv.firstname} ${cv.lastname}`}
                  size="lg"
                  className="w-24 h-24 text-2xl"
                />
                <div className="flex flex-col flex-grow">
                  <h1 className="text-3xl font-bold">{`${cv.firstname} ${cv.lastname}`}</h1>
                  <p className="text-xl text-default-500 mt-2">{cv.title}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <MapPinIcon className="w-5 h-5 text-default-400" />
                    <span className="text-default-400">{cv.location}</span>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <p className="text-lg">{cv.summary}</p>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education Section */}
              <Card>
                <CardHeader className="flex gap-3 p-6">
                  <AcademicCapIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">Education</h2>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <ScrollShadow className="max-h-[400px]">
                    {cv.education.map((edu) => (
                      <div key={edu._id} className="mb-6">
                        <h3 className="font-semibold text-lg">{edu.degree}</h3>
                        <p className="text-default-500">{edu.institution}</p>
                        <p className="text-sm mt-1">{edu.description}</p>
                        {edu.startdate && edu.enddate && (
                          <Chip size="sm" className="mt-2">
                            {new Date(edu.startdate).getFullYear()} - {new Date(edu.enddate).getFullYear()}
                          </Chip>
                        )}
                        <Divider className="my-3" />
                      </div>
                    ))}
                  </ScrollShadow>
                </CardBody>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardHeader className="flex gap-3 p-6">
                  <BriefcaseIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">Professional Experience</h2>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <ScrollShadow className="max-h-[400px]">
                    {cv.experiences.map((exp) => (
                      <div key={exp._id} className="mb-6">
                        <h3 className="font-semibold text-lg">{exp.role}</h3>
                        <p className="text-default-500">{exp.company}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                        {exp.startdate && exp.enddate && (
                          <Chip size="sm" className="mt-2">
                            {new Date(exp.startdate).getFullYear()} - {new Date(exp.enddate).getFullYear()}
                          </Chip>
                        )}
                        <Divider className="my-3" />
                      </div>
                    ))}
                  </ScrollShadow>
                </CardBody>
              </Card>
            </div>

            {/* Hobbies Section */}
            <Card className="mt-8">
              <CardHeader className="flex gap-3 p-6">
                <HeartIcon className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Hobbies & Interests</h2>
              </CardHeader>
              <Divider />
              <CardBody className="p-6">
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
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
