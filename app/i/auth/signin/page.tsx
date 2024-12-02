'use client'
import React, { useState } from 'react';
import { toast } from '../../../components/ui/use-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Image from 'next/image';

function Login() {
  const [email, setEmail] = useState('');
  const handleEmailSubmit = async () => {
    if (!email || email === '') {
      toast({
        title: 'Please enter your email',
      });
      return;
    }

    
  }

  return (
    <section className="bg-muted min-h-screen py-16">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Image
            width={40}
            height={40}
            src="/assets/logo.png"
            alt="Glow"
            className="mx-auto h-10 w-auto rounded-md mb-4"
          />

          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Welcome back!
          </p>
          <p className='mt-1 text-gray-500'>Login to your account below.</p>
        </div>
        <div className='flex flex-col items-center w-full max-w-lg mx-auto'>
          <div className="mt-7 w-full flex-1 rounded-lg border bg-white px-8 py-8 shadow-sm dark:bg-zinc-950 text-center">
            <form action={handleEmailSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <Button size="lg" type="submit" className="w-full mt-4">
                Continue with Email
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;