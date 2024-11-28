import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Divider, Avatar, Button, Input, Textarea, Skeleton } from "@nextui-org/react";
import { AcademicCapIcon, BriefcaseIcon, HeartIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../config/config';
import { Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';

export default function EditCV() {
    
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState({
    firstname: '',
    lastname: '',
    title: '',
    location: '',
    summary: '',
    education: [],
    experiences: [],
    hobbies: [],
    status_label: 'public'
  });
  const userid = user.userid;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const fetchCV = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/cv/get-cv/${userid}`,
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        
        if (data.success) {
          const transformedData = {
            ...data.data,
            education: data.data.education.map(edu => ({
              _id: edu._id,
              degree: edu.degree,
              institution: edu.institution,
              startdate: edu.startdate,
              enddate: edu.enddate,
              description: edu.description
            })),
            experiences: data.data.experiences.map(exp => ({
              _id: exp._id,
              role: exp.role,
              company: exp.company,
              startdate: exp.startdate,
              enddate: exp.enddate,
              description: exp.description
            })),
            hobbies: data.data.hobbies.map(hobby => ({
              _id: hobby._id,
              hobby: hobby.hobby
            }))
          };
          setCvData(transformedData);
        }
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch CV data');
        setLoading(false);
      }
    };
    if (userid) {
      fetchCV();
    }
  }, [user, userid]);

  const handleInputChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      setCvData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [name]: value } : item
        )
      }));
    } else {
      setCvData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addItem = (section) => {
    const newItem = section === 'education' 
      ? { degree: '', institution: '', startdate: '', enddate: '', description: '' }
      : section === 'experiences'
      ? { role: '', company: '', startdate: '', enddate: '', description: '' }
      : { hobby: '' };

    setCvData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeItem = (index, section) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const updateData = {
            ...cvData,
            userid: userid,
            cvid: cvData._id,
            status_label: cvData.status_label || 'private',
          education: cvData.education.map(edu => ({
            ...edu,
            cvid: cvData._id,
            userid: userid
          })),
          experiences: cvData.experiences.map(exp => ({
            ...exp,
            cvid: cvData._id,
            userid: userid
          })),
          hobbies: cvData.hobbies.map(hobby => ({
            _id: hobby._id, 
            hobby: hobby.hobby, 
            cvid: cvData._id,
            userid: userid
          }))
        };
        
        const response = await fetch(
          `${BACKEND_URL}/api/cv/update-cv`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updateData)
          }
        );
        const data = await response.json();
    
        if (data.success) {
          toast.success('CV updated successfully!');
          navigate(`/cv/${userid}`);
        } else {
          toast.error(data.message || 'Failed to update CV');
          console.error('Update error:', data.error); 
        }
      } catch (err) {
        toast.error('Failed to update CV');
        console.error('Update error:', err);
      }
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Modifier le CV</h1>
          <p className="text-gray-600">Modifiez les champs ci-dessous pour mettre à jour votre CV</p>
        </div>
        <form onSubmit={handleSubmit}>
          {loading ? (
            <>
              {/* Header Section*/}
              <Card className="mb-8">
                <CardHeader className="flex gap-6 p-6">
                  <Skeleton className="rounded-full w-24 h-24" />
                  <div className="flex flex-col flex-grow gap-4">
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                  </div>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <Skeleton className="h-24 rounded-lg" />
                </CardBody>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Education Section*/}
                <Card>
                  <CardHeader className="flex justify-between p-6">
                    <div className="flex gap-3">
                      <Skeleton className="w-6 h-6 rounded" />
                      <Skeleton className="w-32 h-6 rounded" />
                    </div>
                    <Skeleton className="w-32 h-10 rounded" />
                  </CardHeader>
                  <Divider />
                  <CardBody className="p-6">
                    {[1, 2].map((_, index) => (
                      <div key={index} className="mb-6">
                        <Skeleton className="h-12 rounded-lg mb-2" />
                        <Skeleton className="h-12 rounded-lg mb-2" />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Skeleton className="h-12 rounded-lg" />
                          <Skeleton className="h-12 rounded-lg" />
                        </div>
                        <Skeleton className="h-24 rounded-lg mb-2" />
                        <Skeleton className="w-24 h-10 rounded" />
                        <Divider className="my-3" />
                      </div>
                    ))}
                  </CardBody>
                </Card>

                {/* Experience Section*/}
                <Card>
                  <CardHeader className="flex justify-between p-6">
                    <div className="flex gap-3">
                      <Skeleton className="w-6 h-6 rounded" />
                      <Skeleton className="w-32 h-6 rounded" />
                    </div>
                    <Skeleton className="w-32 h-10 rounded" />
                  </CardHeader>
                  <Divider />
                  <CardBody className="p-6">
                    {[1, 2].map((_, index) => (
                      <div key={index} className="mb-6">
                        <Skeleton className="h-12 rounded-lg mb-2" />
                        <Skeleton className="h-12 rounded-lg mb-2" />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Skeleton className="h-12 rounded-lg" />
                          <Skeleton className="h-12 rounded-lg" />
                        </div>
                        <Skeleton className="h-24 rounded-lg mb-2" />
                        <Skeleton className="w-24 h-10 rounded" />
                        <Divider className="my-3" />
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </div>

              {/* Hobbies Section*/}
              <Card className="mt-8">
                <CardHeader className="flex justify-between p-6">
                  <div className="flex gap-3">
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="w-32 h-6 rounded" />
                  </div>
                  <Skeleton className="w-32 h-10 rounded" />
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Skeleton className="w-40 h-12 rounded-lg" />
                        <Skeleton className="w-10 h-10 rounded" />
                      </div>
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
                    name={`${cvData.firstname} ${cvData.lastname}`}
                    size="lg"
                    className="w-24 h-24 text-2xl"
                  />
                  <div className="flex flex-col flex-grow gap-4">
                    <div className="flex gap-4">
                      <Input
                        label="First Name"
                        name="firstname"
                        value={cvData.firstname}
                        onChange={handleInputChange}
                        required
                        className="w-1/2"
                      />
                      <Input
                        label="Last Name"
                        name="lastname"
                        value={cvData.lastname}
                        onChange={handleInputChange}
                        required
                        className="w-1/2"
                      />
                    </div>
                    <Input
                      label="Title"
                      name="title"
                      value={cvData.title}
                      onChange={handleInputChange}
                      className="w-1/2"
                    />
                    <Input
                      label="Location"
                      name="location"
                      value={cvData.location}
                      onChange={handleInputChange}
                      className="w-1/2"
                    />
                  </div>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <Textarea
                    label="Summary"
                    name="summary"
                    value={cvData.summary}
                    onChange={handleInputChange}
                  />
                </CardBody>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Education Section */}
                <Card>
                  <CardHeader className="flex justify-between p-6">
                    <div className="flex gap-3">
                      <AcademicCapIcon className="w-6 h-6 text-primary" />
                      <h2 className="text-xl font-bold">Education</h2>
                    </div>
                    <Button color="primary" onClick={() => addItem('education')}>
                      Add Education
                    </Button>
                  </CardHeader>
                  <Divider />
                  <CardBody className="p-6">
                    {cvData.education.map((edu, index) => (
                      <div key={index} className="mb-6">
                        <Input
                          label="Degree"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleInputChange(e, index, 'education')}
                          className="mb-2"
                        />
                        <Input
                          label="Institution"
                          name="institution"
                          value={edu.institution}
                          onChange={(e) => handleInputChange(e, index, 'education')}
                          className="mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Input
                            type="date"
                            label="Start Date"
                            name="startdate"
                            value={edu.startdate?.split('T')[0]}
                            onChange={(e) => handleInputChange(e, index, 'education')}
                          />
                          <Input
                            type="date"
                            label="End Date"
                            name="enddate"
                            value={edu.enddate?.split('T')[0]}
                            onChange={(e) => handleInputChange(e, index, 'education')}
                          />
                        </div>
                        <Textarea
                          label="Description"
                          name="description"
                          value={edu.description}
                          onChange={(e) => handleInputChange(e, index, 'education')}
                          className="mb-2"
                        />
                        <Button 
                          color="danger" 
                          onClick={() => removeItem(index, 'education')}
                        >
                          Remove
                        </Button>
                        <Divider className="my-3" />
                      </div>
                    ))}
                  </CardBody>
                </Card>

                {/* Experience Section */}
                <Card>
                  <CardHeader className="flex justify-between p-6">
                    <div className="flex gap-3">
                      <BriefcaseIcon className="w-6 h-6 text-primary" />
                      <h2 className="text-xl font-bold">Experience</h2>
                    </div>
                    <Button color="primary" onClick={() => addItem('experiences')}>
                      Add Experience
                    </Button>
                  </CardHeader>
                  <Divider />
                  <CardBody className="p-6">
                    {cvData.experiences.map((exp, index) => (
                      <div key={index} className="mb-6">
                        <Input
                          label="Role"
                          name="role"
                          value={exp.role}
                          onChange={(e) => handleInputChange(e, index, 'experiences')}
                          className="mb-2"
                        />
                        <Input
                          label="Company"
                          name="company"
                          value={exp.company}
                          onChange={(e) => handleInputChange(e, index, 'experiences')}
                          className="mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Input
                            type="date"
                            label="Start Date"
                            name="startdate"
                            value={exp.startdate?.split('T')[0]}
                            onChange={(e) => handleInputChange(e, index, 'experiences')}
                          />
                          <Input
                            type="date"
                            label="End Date"
                            name="enddate"
                            value={exp.enddate?.split('T')[0]}
                            onChange={(e) => handleInputChange(e, index, 'experiences')}
                          />
                        </div>
                        <Textarea
                          label="Description"
                          name="description"
                          value={exp.description}
                          onChange={(e) => handleInputChange(e, index, 'experiences')}
                          className="mb-2"
                        />
                        <Button 
                          color="danger" 
                          onClick={() => removeItem(index, 'experiences')}
                        >
                          Remove
                        </Button>
                        <Divider className="my-3" />
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </div>

              {/* Hobbies Section */}
              <Card className="mt-8">
                <CardHeader className="flex justify-between p-6">
                  <div className="flex gap-3">
                    <HeartIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold">Hobbies</h2>
                  </div>
                  <Button color="primary" onClick={() => addItem('hobbies')}>
                    Add Hobby
                  </Button>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {cvData.hobbies.map((hobby, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          name="hobby"
                          value={hobby.hobby}
                          onChange={(e) => handleInputChange(e, index, 'hobbies')}
                          className="w-40"
                        />
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => removeItem(index, 'hobbies')}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
              {/* End Hobbies Section */}
              {/* Status label dropdown */}
              <Card className="mt-8">
                <CardHeader className="flex justify-between p-6">
                  <div className="flex gap-3">
                    <h2 className="text-xl font-bold">Status</h2>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <Select
                    label="Select CV visibility status"
                    value={cvData.status_label}
                    onChange={(e) => handleInputChange({target: {name: 'status_label', value: e.target.value}}, null, null)}
                    className="max-w-xs"
                  >
                    <SelectItem key="public" value="public">Public</SelectItem>
                    <SelectItem key="private" value="private">Private</SelectItem>
                  </Select>
                </CardBody>
              </Card>


              {/* Save Changes Button */}
              <div className="mt-8 flex justify-end">
                <Button 
                  color="primary" 
                  type="submit"
                  size="lg"
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}