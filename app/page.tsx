'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSurveyStore } from '@/stores/surveyStore';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setCustomerEmail } = useSurveyStore();
  const router = useRouter();

  const handleStartSurvey = async () => {
    if (!email.trim()) return;
    
    setIsLoading(true);
    setCustomerEmail(email);
    
    // Navigate to first survey step
    router.push('/step/meter-closeup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-heading-4 text-blue-90">
            Base Power Site Survey
          </CardTitle>
          <CardDescription className="text-body-large">
            Enter your email address to begin the site survey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-body-medium font-medium">
              Customer Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleStartSurvey}
            disabled={!email.trim() || isLoading}
            className="w-full bg-blue-40 hover:bg-blue-90"
          >
            {isLoading ? 'Starting Survey...' : 'Start Survey'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
