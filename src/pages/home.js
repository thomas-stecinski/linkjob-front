import React from 'react';
import { Card, CardBody, Button, Image } from '@nextui-org/react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-500">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-white">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Dream Tech Job with LinkJob
            </h1>
            <p className="text-xl mb-8">
              Connect with top tech companies and discover opportunities that match your skills and aspirations.
            </p>
            <div className="flex gap-4">
              <Button size="lg" color="primary" variant="shadow">
                Find Jobs
              </Button>
              <Button size="lg" variant="bordered" className="text-white">
                Post a Job
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="https://illustrations.popsy.co/white/developer.svg"
              alt="Developer illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
            <CardBody className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Smart Job Matching</h3>
              <p className="text-default-500">
                Our AI-powered system matches you with jobs that fit your skills and experience.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
            <CardBody className="text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2">Remote Opportunities</h3>
              <p className="text-default-500">
                Find remote work opportunities from companies around the world.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
            <CardBody className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Career Growth</h3>
              <p className="text-default-500">
                Access resources and tools to help advance your tech career.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <Card className="bg-background/60 dark:bg-default-100/50 backdrop-blur-md">
          <CardBody className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-default-500 mb-8">
              Join thousands of tech professionals who've found their perfect job through LinkJob
            </p>
            <Button size="lg" color="primary" variant="shadow">
              Create Your Profile
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
