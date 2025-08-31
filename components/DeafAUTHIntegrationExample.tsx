"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Globe, Users, Shield, Zap } from "lucide-react"

export function DeafAUTHIntegrationExample() {
  const integrationExamples = [
    {
      domain: "dao.mbtquniverse.com",
      type: "DAO Platform",
      description: "Governance voting with deaf community representation",
      features: ["Visual voting", "Community verification", "Contribution tracking"],
      color: "from-blue-500 to-purple-500",
    },
    {
      domain: "startup.com",
      type: "Tech Startup",
      description: "Inclusive hiring and team collaboration",
      features: ["Accessibility expertise", "Team diversity", "Skill verification"],
      color: "from-green-500 to-teal-500",
    },
    {
      domain: "university.edu",
      type: "Educational Institution",
      description: "Student services and academic support",
      features: ["Accommodation tracking", "Peer mentoring", "Academic verification"],
      color: "from-orange-500 to-red-500",
    },
    {
      domain: "nonprofit.org",
      type: "Non-Profit",
      description: "Community outreach and volunteer coordination",
      features: ["Impact measurement", "Volunteer verification", "Community building"],
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>DeafAUTH Universal Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-lg font-semibold mb-2">One Identity, Everywhere</div>
            <div className="text-muted-foreground">
              DeafAUTH provides universal authentication that works across any domain with deaf community presence
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationExamples.map((example, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${example.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{example.domain}</CardTitle>
                    <Badge variant="outline">{example.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                  <div className="space-y-1">
                    {example.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>Integration Code Example</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-green-400">// Any domain can integrate DeafAUTH in 3 lines</div>
            <div className="mt-2">
              <span className="text-blue-400">import</span> {`{ DeafAUTHProvider, useDeafAUTH }`}{" "}
              <span className="text-blue-400">from</span> <span className="text-yellow-400">'@deafauth/sdk'</span>
            </div>
            <div className="mt-4">
              <span className="text-purple-400">function</span> <span className="text-yellow-400">App</span>() {`{`}
            </div>
            <div className="ml-4 mt-1">
              <span className="text-blue-400">return</span> (
            </div>
            <div className="ml-8 mt-1">{`<DeafAUTHProvider>`}</div>
            <div className="ml-12 mt-1">{`<YourApp />`}</div>
            <div className="ml-8 mt-1">{`</DeafAUTHProvider>`}</div>
            <div className="ml-4 mt-1">)</div>
            <div className="mt-1">{`}`}</div>
            <div className="mt-4 text-green-400">// That's it! DeafAUTH handles the rest</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Key Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 mx-auto text-blue-500" />
              <h4 className="font-semibold">Universal Identity</h4>
              <p className="text-sm text-muted-foreground">
                One verified identity works across all integrated platforms
              </p>
            </div>
            <div className="text-center space-y-2">
              <Users className="w-8 h-8 mx-auto text-green-500" />
              <h4 className="font-semibold">Community Verified</h4>
              <p className="text-sm text-muted-foreground">Authentic deaf community validation and peer verification</p>
            </div>
            <div className="text-center space-y-2">
              <Globe className="w-8 h-8 mx-auto text-purple-500" />
              <h4 className="font-semibold">Cross-Platform</h4>
              <p className="text-sm text-muted-foreground">Seamless integration with any website or application</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
