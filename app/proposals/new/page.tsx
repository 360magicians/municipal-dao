"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, Eye, Save, Send } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"

const proposalTypes = [
  { value: "treasury", label: "Treasury Allocation", description: "Request funds from the treasury" },
  { value: "governance", label: "Governance Change", description: "Modify DAO rules or structure" },
  { value: "partnership", label: "Partnership", description: "Propose strategic partnerships" },
  { value: "technical", label: "Technical Upgrade", description: "Smart contract or system updates" },
  { value: "community", label: "Community Initiative", description: "Community programs or events" },
  { value: "other", label: "Other", description: "General proposals" },
]

const organizations = [
  { id: "developer-dao", name: "DeveloperDAO" },
  { id: "defi-collective", name: "DeFi Collective" },
]

export default function NewProposalPage() {
  const [formData, setFormData] = useState({
    organization: "",
    title: "",
    type: "",
    summary: "",
    description: "",
    requestedAmount: "",
    beneficiary: "",
    votingDuration: "7",
    tags: [] as string[],
    attachments: [] as File[],
  })
  const [votingEndDate, setVotingEndDate] = useState<Date>()
  const [currentTag, setCurrentTag] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleAddTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }))
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    // Simulate saving draft
    setTimeout(() => {
      setIsSaving(false)
      alert("Draft saved successfully!")
    }, 1000)
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    // Simulate proposal submission
    setTimeout(() => {
      setIsSaving(false)
      router.push("/proposals")
    }, 2000)
  }

  const selectedType = proposalTypes.find((t) => t.value === formData.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-bold">DAO Platform</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/proposals" className="text-sm font-medium text-blue-600">
                Proposals
              </Link>
              <Link href="/organizations" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Organizations
              </Link>
            </nav>
            <Button variant="outline" asChild>
              <Link href="/proposals">Cancel</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Create New Proposal</h1>
              <p className="text-muted-foreground mt-2">Submit a proposal for community voting</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? "Edit" : "Preview"}
              </Button>
            </div>
          </div>

          {!isPreview ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide the essential details of your proposal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Select
                        value={formData.organization}
                        onValueChange={(value) => setFormData({ ...formData, organization: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Proposal Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proposal type" />
                        </SelectTrigger>
                        <SelectContent>
                          {proposalTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear, descriptive title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Provide a brief summary of your proposal (max 280 characters)"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      maxLength={280}
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {formData.summary.length}/280 characters
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Description</CardTitle>
                  <CardDescription>Provide comprehensive details about your proposal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your proposal, including rationale, implementation plan, and expected outcomes..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={10}
                    />
                  </div>

                  {/* Treasury Request Fields */}
                  {formData.type === "treasury" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Requested Amount (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={formData.requestedAmount}
                          onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="beneficiary">Beneficiary Address</Label>
                        <Input
                          id="beneficiary"
                          placeholder="0x..."
                          value={formData.beneficiary}
                          onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Add tags..."
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        Add
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* File Attachments */}
                  <div className="space-y-2">
                    <Label>Attachments</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to select</p>
                      <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose Files
                        </label>
                      </Button>
                    </div>
                    {formData.attachments.length > 0 && (
                      <div className="space-y-1">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                            <span>{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  attachments: prev.attachments.filter((_, i) => i !== index),
                                }))
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Voting Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Voting Configuration</CardTitle>
                  <CardDescription>Set the parameters for voting on this proposal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Voting Duration (days)</Label>
                      <Select
                        value={formData.votingDuration}
                        onValueChange={(value) => setFormData({ ...formData, votingDuration: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Voting End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {votingEndDate ? format(votingEndDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={votingEndDate} onSelect={setVotingEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button onClick={handleSubmit} disabled={isSaving || !formData.title || !formData.organization}>
                  <Send className="w-4 h-4 mr-2" />
                  {isSaving ? "Submitting..." : "Submit Proposal"}
                </Button>
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{formData.title || "Untitled Proposal"}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>by you</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                      {selectedType && <Badge variant="outline">{selectedType.label}</Badge>}
                    </div>
                  </div>
                  <Badge variant="outline">Preview</Badge>
                </div>
                <CardDescription className="text-base">{formData.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{formData.description}</div>
                </div>

                {formData.type === "treasury" && formData.requestedAmount && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Treasury Request</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-2 font-medium">${formData.requestedAmount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Beneficiary:</span>
                        <span className="ml-2 font-mono text-xs">{formData.beneficiary}</span>
                      </div>
                    </div>
                  </div>
                )}

                {formData.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.attachments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <div className="space-y-1">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          📎 {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Voting Information</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Voting Duration: {formData.votingDuration} days</p>
                    <p>Minimum Quorum: 51% of voting power</p>
                    <p>Voting Options: For, Against, Abstain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
