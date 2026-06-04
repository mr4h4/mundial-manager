import { Card } from "@/components/ui/card";

export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          {Icon && (
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-slate-600 text-sm">{subtitle}</p>
          )}
        </div>

        {/* Content Card */}
        <Card className="p-6 border-slate-200 shadow-lg">
          <div className="space-y-6">
            {children}
          </div>
        </Card>

        {/* Footer */}
        {footer && (
          <div className="text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
