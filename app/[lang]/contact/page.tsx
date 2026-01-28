"use client";

import { useTranslationStore } from "@/lib/translations";
import { commonTranslations } from "@/lib/translations/common";
import { useEffect, useState, use } from "react";
import { Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Briefcase, Bug, Code, Users, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = use(params);
  const lang = langParam as Language;
  const { direction } = useTranslationStore();
  const t = commonTranslations[lang];
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const email = "SRaz.Sw@gmail.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    
    toast({
      title: lang === "en" ? "Email Copied!" : "האימייל הועתק!",
      description: lang === "en" ? "Email address copied to clipboard" : "כתובת האימייל הועתקה ללוח",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };



  return (
    <div className="container mx-auto py-12 px-4" dir={direction()}>
      <h1 className="text-3xl font-bold mb-8 text-center">
        {lang === "en" ? "Contact Us" : "צור קשר"}
      </h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-1 gap-8">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {lang === "en" ? "Get in Touch" : "יצירת קשר"}
          </h2>

          <div className="space-y-6">
                      <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">
                  {lang === "en" ? "Email" : "אימייל"}
                </h3>
                <p className="text-muted-foreground gap-8 flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-3 ps-0" 
                        onClick={copyToClipboard}
                      >
                        <span>{email}</span>
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {lang === "en" ? "Copy to clipboard" : "העתק ללוח"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </p>

              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">
                  {lang === "en" ? "Location" : "מיקום"}
                </h3>
                <p className="text-muted-foreground">
                  {lang === "en"
                    ? "Tel Aviv, Israel"
                    : "תל אביב, ישראל"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="font-medium text-lg border-b pb-2 border-muted">
              {lang === "en" ? "How Can I Help You?" : "איך אני יכול לעזור לך?"}
            </h3>
            
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">
                  {lang === "en" ? "Job Opportunities" : "הזדמנויות עבודה"}
                </h3>
                <p className="text-muted-foreground">
                  {lang === "en"
                    ? "Currently open to new software development opportunities. Feel free to reach out with positions that match my skills."
                    : "פתוח להזדמנויות חדשות בפיתוח תוכנה. אשמח לשמוע על משרות שמתאימות לכישורים שלי."}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">
                  {lang === "en" ? "Custom Calculator Development" : "פיתוח מחשבונים מותאמים אישית"}
                </h3>
                <p className="text-muted-foreground">
                  {lang === "en"
                    ? "Need a custom financial calculator for your business? I offer freelance services to create tailored solutions that match your specific requirements."
                    : "צריכים מחשבון פיננסי מותאם אישית לעסק שלכם? אני מציע שירותי פרילנס ליצירת פתרונות מותאמים שעונים על הדרישות הספציפיות שלכם."}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Bug className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">
                  {lang === "en" ? "Bug Reports & Feature Requests" : "דיווח על באגים ובקשות לתכונות"}
                </h3>
                <p className="text-muted-foreground">
                  {lang === "en"
                    ? "Found a bug or have a feature request for this project? Contact me via email with details."
                    : "מצאת באג או יש לך בקשה לתכונה חדשה לפרויקט זה? צור איתי קשר באימייל עם פרטים."}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">
                  {lang === "en" ? "Collaboration Opportunities" : "הזדמנויות לשיתוף פעולה"}
                </h3>
                <p className="text-muted-foreground">
                  {lang === "en"
                    ? "Interested in collaborating on a project? I'm open to discussing potential partnerships and collaborative ventures."
                    : "מעוניינים לשתף פעולה בפרויקט? אני פתוח לדון בשותפויות פוטנציאליות ומיזמים משותפים."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 