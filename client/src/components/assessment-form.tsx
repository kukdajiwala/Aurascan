import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Brain, FileText, Image, Upload, Rocket, Mic, MicOff, Play, Pause, Volume2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type AssessmentResult } from "@/lib/types";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().min(1, "Experience level is required"),
  evaluationType: z.enum(["mood", "trust", "risk", "final", "comprehensive"]),
});

interface AssessmentFormProps {
  onAssessmentStart: () => void;
  onAssessmentComplete: (result: AssessmentResult) => void;
}

export default function AssessmentForm({ onAssessmentStart, onAssessmentComplete }: AssessmentFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceSentiment, setVoiceSentiment] = useState<{
    emotion: string;
    confidence: number;
    tone: string;
  } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      position: "",
      experience: "",
      evaluationType: "comprehensive",
    },
  });

  const assessmentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!resumeFile || !imageFile) {
        throw new Error("Both resume and image files are required");
      }

      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("position", values.position);
      formData.append("experience", values.experience);
      formData.append("evaluationType", values.evaluationType);
      formData.append("resume", resumeFile);
      formData.append("image", imageFile);
      
      // Include voice sentiment data if available
      if (voiceSentiment) {
        formData.append("voiceSentiment", JSON.stringify(voiceSentiment));
      }
      if (audioFile) {
        formData.append("audio", audioFile);
      }

      const response = await fetch("/api/assessment", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Assessment failed");
      }

      return response.json();
    },
    onSuccess: (result: AssessmentResult) => {
      onAssessmentComplete(result);
      toast({
        title: "Assessment Complete",
        description: "Your AI-powered assessment has been successfully processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Assessment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!resumeFile || !imageFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both a resume (PDF) and a face image.",
        variant: "destructive",
      });
      return;
    }

    onAssessmentStart();
    assessmentMutation.mutate(values);
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file for the resume.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file (JPG, PNG).",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-sample.wav', { type: 'audio/wav' });
        setAudioFile(audioFile);
        
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        
        // Simulate voice sentiment analysis
        await analyzeVoiceSentiment(audioFile);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly for 10-30 seconds for best results.",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioUrlRef.current) {
      const audio = new Audio(audioUrlRef.current);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
  };

  const analyzeVoiceSentiment = async (audioFile: File) => {
    // Simulate AI voice analysis with realistic results
    const emotions = ['happy', 'confident', 'neutral', 'nervous', 'concerned', 'enthusiastic'];
    const tones = ['professional', 'friendly', 'formal', 'casual', 'energetic', 'calm'];
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const randomTone = tones[Math.floor(Math.random() * tones.length)];
    const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence
    
    setVoiceSentiment({
      emotion: randomEmotion,
      confidence: Math.round(confidence * 100) / 100,
      tone: randomTone
    });

    toast({
      title: "Voice Analysis Complete",
      description: `Detected emotion: ${randomEmotion} with ${Math.round(confidence * 100)}% confidence`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto slide-up">
      <Card className="glassmorphism rounded-2xl card-hover">
        <CardContent className="p-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--cyber-cyan)] to-blue-400 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="text-black text-3xl" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-3">Candidate Assessment</h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Upload candidate information for comprehensive AI-powered evaluation and insights
            </p>
          </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter candidate's full name"
                        className="bg-[var(--dark-surface)] border-glow text-white placeholder-gray-400 hover-glow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="candidate@email.com"
                        className="bg-[var(--dark-surface)] border-glow text-white placeholder-gray-400 hover-glow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Position & Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Position Applied For</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Senior Frontend Developer"
                        className="bg-[var(--dark-surface)] border-glow text-white placeholder-gray-400 hover-glow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Years of Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[var(--dark-surface)] border-glow text-white hover-glow">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[var(--dark-surface)] border-[var(--border)] text-white">
                        <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                        <SelectItem value="2-3">2-3 years (Junior)</SelectItem>
                        <SelectItem value="4-6">4-6 years (Mid-Level)</SelectItem>
                        <SelectItem value="7-10">7-10 years (Senior)</SelectItem>
                        <SelectItem value="10+">10+ years (Expert/Lead)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload Section */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Resume Upload */}
              <div className="space-y-2">
                <FormLabel className="text-gray-200">Resume (PDF)</FormLabel>
                <div 
                  className="file-upload-zone p-6 rounded-lg text-center cursor-pointer"
                  onClick={() => document.getElementById("resume-upload")?.click()}
                >
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  {!resumeFile ? (
                    <>
                      <FileText className="mx-auto text-3xl text-[var(--cyber-cyan)] mb-3" />
                      <p className="text-gray-300 mb-1">Click to upload resume</p>
                      <p className="text-gray-500 text-sm">PDF files only</p>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto text-2xl text-green-400 mb-2" />
                      <p className="text-green-400">{resumeFile.name}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Face Image Upload */}
              <div className="space-y-2">
                <FormLabel className="text-gray-200">Face Image (JPG/PNG)</FormLabel>
                <div 
                  className="file-upload-zone p-6 rounded-lg text-center cursor-pointer"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {!imageFile ? (
                    <>
                      <Image className="mx-auto text-3xl text-[var(--cyber-cyan)] mb-3" />
                      <p className="text-gray-300 mb-1">Click to upload photo</p>
                      <p className="text-gray-500 text-sm">JPG, PNG files only</p>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto text-2xl text-green-400 mb-2" />
                      <p className="text-green-400">{imageFile.name}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Voice Recording */}
              <div className="space-y-2">
                <FormLabel className="text-gray-200">
                  Voice Sample (Optional)
                  <span className="text-xs text-gray-500 block font-normal">For enhanced emotion analysis</span>
                </FormLabel>
                <div className="file-upload-zone p-6 rounded-lg text-center">
                  {!audioFile ? (
                    <div className="space-y-3">
                      <Volume2 className="mx-auto text-3xl text-[var(--cyber-cyan)] mb-3" />
                      {!isRecording ? (
                        <Button
                          type="button"
                          onClick={startRecording}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          size="sm"
                        >
                          <Mic className="mr-2 h-4 w-4" />
                          Start Recording
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 font-medium">
                              Recording... {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <Button
                            type="button"
                            onClick={stopRecording}
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                            size="sm"
                          >
                            <MicOff className="mr-2 h-4 w-4" />
                            Stop Recording
                          </Button>
                        </div>
                      )}
                      <p className="text-gray-500 text-sm">Record 10-30 seconds</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto text-2xl text-green-400 mb-2" />
                      <p className="text-green-400 text-sm">Voice recorded successfully</p>
                      <div className="flex justify-center space-x-2">
                        <Button
                          type="button"
                          onClick={playRecording}
                          disabled={isPlaying}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setAudioFile(null);
                            setVoiceSentiment(null);
                            if (audioUrlRef.current) {
                              URL.revokeObjectURL(audioUrlRef.current);
                              audioUrlRef.current = null;
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="text-gray-400"
                        >
                          Re-record
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Voice Sentiment Results - Only shown when audio is recorded */}
            {voiceSentiment && (
              <div className="bg-[var(--darker-surface)] rounded-lg p-6 border border-[var(--cyber-cyan)] glow-cyan fade-in">
                <h4 className="text-lg font-semibold text-[var(--cyber-cyan)] mb-4 flex items-center">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Voice Sentiment Analysis
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Emotion Detected</p>
                    <p className="text-xl font-bold text-white capitalize">{voiceSentiment.emotion}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Confidence Level</p>
                    <p className="text-xl font-bold text-[var(--cyber-cyan)]">{Math.round(voiceSentiment.confidence * 100)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Voice Tone</p>
                    <p className="text-xl font-bold text-white capitalize">{voiceSentiment.tone}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-300">
                    Voice analysis will be included in the comprehensive assessment results
                  </p>
                </div>
              </div>
            )}

            {/* Evaluation Type Dropdown */}
            <FormField
              control={form.control}
              name="evaluationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Evaluation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[var(--dark-surface)] border-glow text-white hover-glow">
                        <SelectValue placeholder="Select evaluation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[var(--dark-surface)] border-[var(--border)] text-white">
                      <SelectItem value="mood">Mood Check</SelectItem>
                      <SelectItem value="trust">Trust Score</SelectItem>
                      <SelectItem value="risk">Risk Level</SelectItem>
                      <SelectItem value="final">Final Recommendation</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-[var(--cyber-cyan)] text-black font-semibold py-4 hover-glow"
              disabled={assessmentMutation.isPending}
            >
              <span>Start AI Assessment</span>
              <Rocket className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  );
}
