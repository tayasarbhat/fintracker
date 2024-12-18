import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Finance Tracker
        </h1>
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#2563eb',
                    brandButtonText: 'white',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                },
              },
              className: {
                button: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors',
                container: 'text-white',
                label: 'text-white/90',
                input: 'bg-white/5 border border-white/10 text-white placeholder-white/40',
                divider: 'bg-white/10',
                message: 'text-white/90',
                anchor: 'text-blue-400 hover:text-blue-300',
              },
            }}
            providers={['google', 'github']}
            providerScopes={{
              google: 'profile email',
              github: 'read:user user:email',
            }}
          />
        </div>
      </div>
    </div>
  );
}