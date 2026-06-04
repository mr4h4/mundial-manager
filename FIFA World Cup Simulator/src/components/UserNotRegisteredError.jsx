import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Not Registered</h1>
          <p className="text-slate-600">
            Your account hasn't been registered for this application yet. Please contact support or try again later.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem('local_token');
            localStorage.removeItem('local_user');
            window.location.href = '/login';
          }}
          className="w-full"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}
