'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-base-lg">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-heading-2 text-grounded">
            Base Power Site Survey
          </CardTitle>
          <CardDescription className="text-body-large text-gray-60">
            Enter your email address to begin the site survey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label
              htmlFor="email"
              className="text-body-large font-medium text-grounded"
            >
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
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Starting Survey...' : 'Start Survey'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
