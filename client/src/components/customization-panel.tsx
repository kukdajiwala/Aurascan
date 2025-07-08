import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type AppConfig } from "@/lib/types";

const colorOptions = [
  { name: "Cyber Cyan", value: "#00FFFF" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F59E0B" },
];

export default function CustomizationPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: appConfig } = useQuery<AppConfig>({
    queryKey: ["/api/config"],
  });

  const [localConfig, setLocalConfig] = useState<Partial<AppConfig>>({});

  const updateConfigMutation = useMutation({
    mutationFn: async (config: Partial<AppConfig>) => {
      const response = await apiRequest("POST", "/api/config", config);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
      toast({
        title: "Settings Updated",
        description: "Your customization changes have been applied successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApplyChanges = () => {
    if (Object.keys(localConfig).length > 0) {
      updateConfigMutation.mutate(localConfig);
      setLocalConfig({});
    }
  };

  const getCurrentConfig = () => ({
    ...appConfig,
    ...localConfig,
  });

  const currentConfig = getCurrentConfig();

  return (
    <Card className="glassmorphism rounded-2xl glow-cyan fade-in mt-8">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2 text-[var(--cyber-cyan)]">
            Customization Settings
          </h2>
          <p className="text-gray-400">Personalize your Aurascan experience</p>
        </div>

        <div className="space-y-6">
          {/* App Name */}
          <div className="space-y-2">
            <Label htmlFor="app-name" className="text-gray-200">
              Application Name
            </Label>
            <Input
              id="app-name"
              value={currentConfig?.appName || ""}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, appName: e.target.value }))}
              className="bg-[var(--dark-surface)] border-glow text-white"
              placeholder="Enter app name"
            />
          </div>

          {/* Color Theme */}
          <div className="space-y-2">
            <Label className="text-gray-200">Accent Color</Label>
            <div className="flex gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentConfig?.accentColor === color.value
                      ? "border-white"
                      : "border-transparent hover:border-white"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setLocalConfig(prev => ({ ...prev, accentColor: color.value }))}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Recommendation Wording */}
          <div className="space-y-2">
            <Label className="text-gray-200">Recommendation Labels</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Hire Label"
                value={currentConfig?.hireLabel || ""}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, hireLabel: e.target.value }))}
                className="bg-[var(--dark-surface)] border-glow text-white text-sm"
              />
              <Input
                placeholder="Review Label"
                value={currentConfig?.reviewLabel || ""}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, reviewLabel: e.target.value }))}
                className="bg-[var(--dark-surface)] border-glow text-white text-sm"
              />
              <Input
                placeholder="Reject Label"
                value={currentConfig?.rejectLabel || ""}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, rejectLabel: e.target.value }))}
                className="bg-[var(--dark-surface)] border-glow text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleApplyChanges}
            disabled={updateConfigMutation.isPending || Object.keys(localConfig).length === 0}
            className="bg-[var(--cyber-cyan)] text-black font-semibold hover-glow"
          >
            {updateConfigMutation.isPending ? "Applying..." : "Apply Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
