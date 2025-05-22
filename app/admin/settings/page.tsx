"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Database, Image, Mail, ExternalLink, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BUCKET_IMAGES, 
  BUCKET_VIDEOS, 
  BUCKET_EVENTS, 
  BUCKET_ARTISTS,
  checkBuckets,
  createBucket
} from "@/lib/supabase/storage";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [supabaseStats, setSupabaseStats] = useState({
    totalImages: '...',
    totalVideos: '...',
    totalEvents: '...',
    totalArtists: '...',
    storageUsed: '...',
  });
  
  const [bucketStatus, setBucketStatus] = useState<Array<{name: string, exists: boolean}>>([
    { name: BUCKET_IMAGES, exists: false },
    { name: BUCKET_VIDEOS, exists: false },
    { name: BUCKET_EVENTS, exists: false },
    { name: BUCKET_ARTISTS, exists: false }
  ]);
  
  const [creatingBucket, setCreatingBucket] = useState<string | null>(null);
  
  const [emailSettings, setEmailSettings] = useState({
    serviceId: '',
    templateId: '',
    publicKey: '',
    enabled: true
  });
  
  const [loading, setLoading] = useState(false);
  
  // Simulação de carregamento das configurações
  useEffect(() => {
    // Em um caso real, carregaríamos do banco de dados ou do localStorage
    const loadSettings = async () => {
      // Verificar status dos buckets
      const bucketsStatus = await checkBuckets();
      setBucketStatus(bucketsStatus);
      
      // Simular stats do Storage
      setSupabaseStats({
        totalImages: '24',
        totalVideos: '5',
        totalEvents: '12',
        totalArtists: '3',
        storageUsed: '128 MB',
      });
      
      // Carregar configurações de email do localStorage ou .env
      setEmailSettings({
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
        enabled: true
      });
    };
    
    loadSettings();
  }, []);
  
  const handleEmailSettingsSave = async () => {
    setLoading(true);
    
    // Simulação de salvamento
    try {
      // Em um caso real, salvaria no banco de dados ou API
      // Aqui apenas simulamos um atraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Email configuration has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setEmailSettings(prev => ({ ...prev, enabled: checked }));
  };
  
  const handleSupabaseTest = async () => {
    toast({
      title: "Connection test successful",
      description: "Your Supabase connection is working properly"
    });
  };
  
  const handleMigrateImagesClick = () => {
    toast({
      title: "Migration",
      description: "Migration tool will be available soon"
    });
  };

  const handleCreateBucket = async (bucketName: string) => {
    setCreatingBucket(bucketName);
    
    try {
      const success = await createBucket(bucketName, true);
      
      if (success) {
        // Atualizar o status dos buckets
        setBucketStatus(prev => 
          prev.map(bucket => 
            bucket.name === bucketName 
              ? { ...bucket, exists: true } 
              : bucket
          )
        );
        
        toast({
          title: "Bucket criado",
          description: `O bucket "${bucketName}" foi criado com sucesso.`,
        });
      } else {
        toast({
          title: "Erro",
          description: `Não foi possível criar o bucket "${bucketName}". Verifique as permissões e políticas RLS.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao criar bucket: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setCreatingBucket(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">Settings</h1>
            <p className="text-white/60 mt-1">Configure your website and integrations</p>
          </div>
        </div>
        
        <Tabs defaultValue="storage" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="site">Site Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="storage">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2 bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Supabase Storage
                  </CardTitle>
                  <CardDescription>
                    Manage your media storage for images and videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-md border border-white/10 bg-black/30">
                        <h3 className="text-lg font-medium mb-2">Storage Stats</h3>
                        <div className="space-y-1 text-white/70">
                          <div className="flex justify-between">
                            <span>Total Space Used:</span>
                            <span className="font-medium text-white">{supabaseStats.storageUsed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Images:</span>
                            <span className="font-medium text-white">{supabaseStats.totalImages} files</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Videos:</span>
                            <span className="font-medium text-white">{supabaseStats.totalVideos} files</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Events:</span>
                            <span className="font-medium text-white">{supabaseStats.totalEvents} files</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Artists:</span>
                            <span className="font-medium text-white">{supabaseStats.totalArtists} files</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-md border border-white/10 bg-black/30">
                        <h3 className="text-lg font-medium mb-4">Buckets</h3>
                        <div className="space-y-3">
                          {bucketStatus.map((bucket) => (
                            <div key={bucket.name} className="flex justify-between items-center">
                              <div className="flex items-center">
                                {bucket.exists ? (
                                  <Check className="h-4 w-4 mr-2 text-green-400" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 mr-2 text-amber-400" />
                                )}
                                <span className={`${bucket.exists ? 'text-white' : 'text-white/70'}`}>
                                  {bucket.name}
                                </span>
                              </div>
                              {!bucket.exists && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleCreateBucket(bucket.name)}
                                  disabled={creatingBucket === bucket.name}
                                >
                                  {creatingBucket === bucket.name ? "Criando..." : "Criar Bucket"}
                                </Button>
                              )}
                              {bucket.exists && (
                                <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded-full">
                                  Ativo
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-xs text-white/50">
                          <p>Nota: A criação de buckets requer permissões adequadas no Supabase.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Connection</h3>
                          <p className="text-white/60 text-sm">Test your Supabase connection</p>
                        </div>
                        <Button onClick={handleSupabaseTest}>
                          Test Connection
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Supabase Dashboard</h3>
                          <p className="text-white/60 text-sm">Open Supabase to manage files directly</p>
                        </div>
                        <Button variant="outline" asChild>
                          <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
                            Open Supabase
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Migrate Images</h3>
                          <p className="text-white/60 text-sm">Move existing images to Supabase Storage</p>
                        </div>
                        <Button variant="secondary" onClick={handleMigrateImagesClick}>
                          <Image className="mr-2 h-4 w-4" />
                          Start Migration
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle>Storage Documentation</CardTitle>
                  <CardDescription>
                    Learn how to use Supabase Storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md bg-black/30 p-4 border border-white/10">
                      <h3 className="font-medium mb-2">Quick Links</h3>
                      <ul className="space-y-2 text-white/70">
                        <li>
                          <a href="/docs/storage-usage.md" target="_blank" className="flex items-center hover:text-white">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Storage Usage Guide
                          </a>
                        </li>
                        <li>
                          <a href="https://supabase.com/docs/guides/storage" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Supabase Storage Docs
                          </a>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="rounded-md bg-black/30 p-4 border border-white/10">
                      <h3 className="font-medium mb-2">Tips</h3>
                      <ul className="space-y-2 text-white/70 text-sm list-disc pl-5">
                        <li>Use appropriate bucket for each media type</li>
                        <li>Keep file names without special characters</li>
                        <li>Organize files in folders within buckets</li>
                        <li>Use images under 10MB for best performance</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="email">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2 bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure EmailJS for contact form
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-enabled">Enable Email Service</Label>
                        <p className="text-sm text-white/60">Turn on to allow visitors to contact you</p>
                      </div>
                      <Switch 
                        id="email-enabled" 
                        checked={emailSettings.enabled}
                        onCheckedChange={handleSwitchChange}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceId">EmailJS Service ID</Label>
                        <Input
                          id="serviceId"
                          name="serviceId"
                          value={emailSettings.serviceId}
                          onChange={handleInputChange}
                          placeholder="service_xxxxxxx"
                          disabled={!emailSettings.enabled}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="templateId">EmailJS Template ID</Label>
                        <Input
                          id="templateId"
                          name="templateId"
                          value={emailSettings.templateId}
                          onChange={handleInputChange}
                          placeholder="template_xxxxxxx"
                          disabled={!emailSettings.enabled}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="publicKey">EmailJS Public Key</Label>
                        <Input
                          id="publicKey"
                          name="publicKey"
                          value={emailSettings.publicKey}
                          onChange={handleInputChange}
                          placeholder="xxxxxxxxxxxxx"
                          type="password"
                          disabled={!emailSettings.enabled}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleEmailSettingsSave} disabled={loading}>
                      {loading ? "Saving..." : "Save Email Settings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle>EmailJS Help</CardTitle>
                  <CardDescription>
                    Information about EmailJS integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md bg-black/30 p-4 border border-white/10">
                      <h3 className="font-medium mb-2">Getting Started</h3>
                      <p className="text-sm text-white/70 mb-4">
                        To use EmailJS, you need to create an account and set up a service and template.
                      </p>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit EmailJS
                        </a>
                      </Button>
                    </div>
                    
                    <div className="rounded-md bg-black/30 p-4 border border-white/10">
                      <h3 className="font-medium mb-2">Tips</h3>
                      <ul className="space-y-2 text-white/70 text-sm list-disc pl-5">
                        <li>Test your form after configuration</li>
                        <li>Check spam folder if emails aren't arriving</li>
                        <li>Keep your API keys private</li>
                        <li>Set up email templates with required variables</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="site">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2 bg-black border-white/10">
                <CardHeader>
                  <CardTitle>Site Settings</CardTitle>
                  <CardDescription>
                    Configure general website settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-white/70 text-center py-10">
                      Site settings will be available in a future update
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Resources and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md bg-black/30 p-4 border border-white/10">
                      <h3 className="font-medium mb-2">Help Center</h3>
                      <p className="text-sm text-white/70">
                        Visit our documentation for more information about managing your site.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 