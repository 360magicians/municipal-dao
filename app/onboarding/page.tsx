"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Users, Search, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const availableDAOs = [
  {
    id: "developer-dao",
    name: "DeveloperDAO",
    description: "A community of builders creating the future of web3",
    members: 1247,
    category: "Development",
    logo: "/placeholder.svg?height=60&width=60",
    requirements: "Open to all developers",
    featured: true,
  },
  {
    id: "defi-collective",
    name: "DeFi Collective",
    description: "Advancing decentralized finance through governance",
    members: 892,
    category: "Finance",
    logo: "/placeholder.svg?height=60&width=60",
    requirements: "Hold 100+ tokens",
    featured: true,
  },
  {
    id: "nft-creators",
    name: "NFT Creators Guild",
    description: "Supporting digital artists and creators",
    members: 634,
    category: "Art",
    logo: "/placeholder.svg?height=60&width=60",
    requirements: "Portfolio review required",
    featured: false,
  },
  {
    id: "climate-dao",
    name: "Climate Action DAO",
    description: "Funding climate solutions through collective action",
    members: 445,
    category: "Impact",
    logo: "/placeholder.svg?height=60&width=60",
    requirements: "Open membership",
    featured: false,
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({
    bio: "",
    interests: [] as string[],
    skills: [] as string[],
  })
  const [selectedDAOs, setSelectedDAOs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const skillOptions = [
    "Smart Contracts",
    "Frontend",
    "Backend",
    "Design",
    "Marketing",
    "Community",
    "Finance",
    "Legal",
  ]
  const interestOptions = ["DeFi", "NFTs", "Gaming", "Social", "Infrastructure", "Governance", "Education", "Climate"]

  const filteredDAOs = availableDAOs.filter(
    (dao) =>
      dao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dao.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSkillToggle = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleDAOToggle = (daoId: string) => {
    setSelectedDAOs((prev) => (prev.includes(daoId) ? prev.filter((id) => id !== daoId) : [...prev, daoId]))
  }

  const handleComplete = () => {
    // Save onboarding data
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        profile,
        joinedOrgs: selectedDAOs,
        onboardingComplete: true,
      }),
    )

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Welcome to the DAO Ecosystem</h1>
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Profile Setup */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>Help us personalize your DAO experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your background and what you're passionate about..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={profile.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {profile.skills.includes(skill) && <Check className="w-3 h-3 mr-1" />}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={profile.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {profile.interests.includes(interest) && <Check className="w-3 h-3 mr-1" />}
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: DAO Discovery */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Discover DAOs</CardTitle>
              <CardDescription>Find communities that match your interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search DAOs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDAOs.map((dao) => (
                  <Card
                    key={dao.id}
                    className={`cursor-pointer transition-all ${
                      selectedDAOs.includes(dao.id) ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                    }`}
                    onClick={() => handleDAOToggle(dao.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={dao.logo || "/placeholder.svg"} alt={dao.name} />
                          <AvatarFallback>{dao.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold truncate">{dao.name}</h3>
                            {selectedDAOs.includes(dao.id) && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{dao.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {dao.members}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {dao.category}
                              </Badge>
                            </div>
                            {dao.featured && (
                              <Badge variant="secondary" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{dao.requirements}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={selectedDAOs.length === 0}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Complete */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Selections</CardTitle>
              <CardDescription>Confirm your profile and DAO memberships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Profile</h3>
                  <p className="text-sm text-muted-foreground mb-2">{profile.bio || "No bio provided"}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Skills: </span>
                      {profile.skills.length > 0 ? (
                        <span className="text-sm text-muted-foreground">{profile.skills.join(", ")}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">None selected</span>
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Interests: </span>
                      {profile.interests.length > 0 ? (
                        <span className="text-sm text-muted-foreground">{profile.interests.join(", ")}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">None selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Selected DAOs ({selectedDAOs.length})</h3>
                  <div className="space-y-2">
                    {selectedDAOs.map((daoId) => {
                      const dao = availableDAOs.find((d) => d.id === daoId)
                      return dao ? (
                        <div key={dao.id} className="flex items-center space-x-3 p-2 border rounded">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={dao.logo || "/placeholder.svg"} alt={dao.name} />
                            <AvatarFallback>{dao.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{dao.name}</p>
                            <p className="text-xs text-muted-foreground">{dao.members} members</p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleComplete}>
                  Complete Setup <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
